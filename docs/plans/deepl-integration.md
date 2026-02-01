# DeepL Integration Plan

**Date:** 2026-01-09
**Status:** Planning
**Priority:** Medium

---

## 1. Overview

DeepL entegrasyonu, mevcut AI model sisteminden ayrı bir "translation provider" olarak eklenecek. Amaç:
- **Agent AI (chat):** Gemini/GPT/Claude gibi LLM'ler ile devam edecek (agentic reasoning, tool calling)
- **Translation:** DeepL özellikle çeviri kalitesi için kullanılacak

Bu ayrım önemli çünkü DeepL, çeviri için optimize edilmiş bir model iken, LLM'ler genel amaçlı ve araç kullanımına uygun.

### Kritik Mimari Karar: AI Drawer Only

**Tüm çeviriler AI Drawer üzerinden yapılır - sync worker'da otomatik çeviri YOK.**

Neden:
- Riskli: Binlerce key'i otomatik çevirmek tehlikeli
- Human oversight: Kullanıcı her batch'i onaylamalı
- Context: AI Drawer'da glossary ve proje context'i var
- Control: Kullanıcı ne zaman, neyi çevireceğine karar verir

DeepL bu flow'a entegre olacak - AI agentten ayrı bir "translation backend" olarak.

---

## 2. Etkilenecek Dosyalar

### Backend (API)

| Dosya | Değişiklik |
|-------|------------|
| `packages/schemas/src/ai-models.ts` | `TranslationProvider` type ekle (deepl, google, amazon) |
| `apps/api/domains/ai/llm-provider/schemas.ts` | Provider enum'a "deepl" ekle |
| `apps/api/shared/integrations/deepl.ts` | **YENİ** - DeepL client wrapper |
| `apps/api/domains/ai/models/resolve-translation-provider.ts` | **YENİ** - Çeviri provider çözümleme |
| `apps/sync-worker/src/gemini.ts` | Generic `translation-service.ts`'e dönüştür |
| `apps/sync-worker/src/processor.ts` | Provider seçimi ekle |

### Database

| Dosya | Değişiklik |
|-------|------------|
| `packages/db/schema/llm-provider.ts` | `translationProvider` tablosu ekle (ayrı tablo) |

### Frontend

| Dosya | Değişiklik |
|-------|------------|
| `apps/app/components/projects/settings/llm-providers.tsx` | "Translation Provider" section ekle |
| `apps/app/routes/(app)/$orgSlug/settings/llm-providers.tsx` | UI ayarları |

---

## 3. Key Yönetimi

### Platform Key (Default)
- Environment: `BETTER_DEEPL_API_KEY`
- Aylık limit: 500K karakter (free tier)
- Usage tracking: `translation_usage` tablosu

### User Key (Custom)
- DB'de sakla: `translation_provider.encrypted_api_key`
- Custom key varsa → limitsiz kullan
- Platform key → kotaya tabi

### Usage Tracking Schema

```sql
CREATE TABLE translation_usage (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organization(id),
  provider TEXT NOT NULL, -- 'deepl', 'google', etc.
  chars_translated INTEGER NOT NULL,
  month TEXT NOT NULL, -- '2026-01'
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. Glossary Entegrasyonu

### Mevcut Durum (Sorun)

**Chat (interactive mode):**
- Tüm 25 approved terim system prompt'a ekleniyor
- Token israfı ve dikkat dağılması

**Sync Worker (batch mode):**
- **HİÇBİR glossary context'i yok!** (kritik gap)
- `apps/sync-worker/src/gemini.ts:24-37` sadece basit prompt

### Önerilen Çözüm

#### A. Akıllı Glossary Segmentasyonu

```typescript
// apps/api/domains/project/ai-context/glossary-matcher.ts

interface RelevantGlossary {
  neverTranslate: string[];        // Her zaman dahil (brand names)
  specificTranslations: Map<string, Record<string, string>>; // Eşleşen terimler
  contextDefinitions: string[];    // Max 5 ilgili tanım
}

export function getRelevantGlossary(
  text: string,
  targetLanguage: string,
  allTerms: GlossaryTerm[]
): RelevantGlossary {
  // 1. Brand terimleri (mustNotTranslate) - her zaman
  const neverTranslate = allTerms
    .filter(t => t.mustNotTranslate)
    .map(t => t.term);

  // 2. Text içinde geçen terimleri bul (fuzzy matching)
  const matchingTerms = allTerms.filter(t => {
    const termLower = t.term.toLowerCase();
    const textLower = text.toLowerCase();
    return textLower.includes(termLower);
  });

  // 3. Hedef dil için çevirisi olanları al
  const specificTranslations = new Map();
  matchingTerms.forEach(t => {
    if (t.customTranslation?.[targetLanguage]) {
      specificTranslations.set(t.term, t.customTranslation);
    }
  });

  // 4. Max 5 tanım
  const contextDefinitions = matchingTerms
    .filter(t => t.description)
    .slice(0, 5)
    .map(t => `${t.term}: ${t.description}`);

  return { neverTranslate, specificTranslations, contextDefinitions };
}
```

#### B. DeepL Native Glossary

DeepL'in kendi glossary API'si var - bu LLM prompt'larından çok daha güvenilir:

```typescript
// apps/api/shared/integrations/deepl.ts

import * as deepl from 'deepl-node';

export async function createDeepLGlossary(
  translator: deepl.Translator,
  projectId: string,
  sourceLang: string,
  targetLang: string,
  terms: Array<{ source: string; target: string }>
): Promise<deepl.GlossaryInfo> {
  const glossaryName = `better-i18n-${projectId}-${targetLang}`;

  // Create entries from terms
  const entries = new deepl.GlossaryEntries({
    entries: Object.fromEntries(
      terms.map(t => [t.source, t.target])
    )
  });

  return translator.createGlossary(
    glossaryName,
    sourceLang as deepl.SourceLanguageCode,
    targetLang as deepl.TargetLanguageCode,
    entries
  );
}

export async function translateWithGlossary(
  translator: deepl.Translator,
  text: string,
  sourceLang: string,
  targetLang: string,
  glossaryId?: string
): Promise<string> {
  const result = await translator.translateText(
    text,
    sourceLang as deepl.SourceLanguageCode,
    targetLang as deepl.TargetLanguageCode,
    { glossary: glossaryId }
  );

  return result.text;
}
```

---

## 5. Sync Worker Değişiklikleri

### Mevcut: `gemini.ts`

```typescript
// Sadece Gemini, glossary yok
const prompt = `Translate from ${source} to ${target}: "${text}"`;
```

### Hedef: `translation-service.ts`

```typescript
// apps/sync-worker/src/translation-service.ts

interface TranslationProvider {
  translate(text: string, source: string, target: string, glossary?: GlossaryContext): Promise<string>;
  translateBatch(items: TranslationItem[], source: string, target: string, glossary?: GlossaryContext): Promise<TranslationResult[]>;
}

export function createTranslationService(
  provider: 'deepl' | 'gemini' | 'openai',
  apiKey: string
): TranslationProvider {
  switch (provider) {
    case 'deepl':
      return createDeepLProvider(apiKey);
    case 'gemini':
      return createGeminiProvider(apiKey);
    case 'openai':
      return createOpenAIProvider(apiKey);
  }
}
```

---

## 6. UI Değişiklikleri

### Settings > LLM Providers

Mevcut:
- OpenAI, Gemini, Claude, Mistral, OpenRouter, Ollama

Eklenecek section: **Translation Provider**

```
┌─────────────────────────────────────────────────────────────┐
│ Translation Provider                                         │
├─────────────────────────────────────────────────────────────┤
│ ○ Better AI (Default)          [Active]                     │
│   Powered by Gemini - No API key required                   │
│   Limit: 500K chars/month                                   │
│                                                              │
│ ○ DeepL                                                     │
│   Professional translation quality                          │
│   [Enter your API key] (optional)                           │
│   Your key: Unlimited | Platform key: 500K chars/month      │
│                                                              │
│ ○ Google Translate                                          │
│   [Enter your API key] (optional)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Implementation Steps

### Phase 1: Glossary Fix (Kritik)
1. [ ] `glossary-matcher.ts` oluştur
2. [ ] Sync worker'a glossary context ekle
3. [ ] Test: Batch çeviride glossary çalışıyor mu?

### Phase 2: Translation Service Abstraction
1. [ ] `translation-service.ts` oluştur
2. [ ] Gemini provider'ı migrate et
3. [ ] Provider interface tanımla

### Phase 3: DeepL Integration
1. [ ] `deepl.ts` integration wrapper
2. [ ] DeepL native glossary API entegrasyonu
3. [ ] Usage tracking tablosu ve logic
4. [ ] Schema ve migration

### Phase 4: UI & Settings
1. [ ] Translation Provider UI section
2. [ ] Key input ve kaydetme
3. [ ] Usage gösterimi (chars used / limit)

### Phase 5: Testing & Polish
1. [ ] E2E test: DeepL ile batch çeviri
2. [ ] Glossary sync test
3. [ ] Rate limit ve error handling

---

## 8. Open Questions

1. **DeepL Free vs Pro:** Free API 500K/month, Pro unlimited. Platform key olarak hangisi?
2. **Glossary Sync:** DeepL glossary'leri ne sıklıkta güncellenmeli? (term ekleme/silme)
3. **Fallback:** DeepL rate limit olursa Gemini'ye fallback?
4. **Batch Size:** DeepL batch limit nedir? (50 text/request?)

---

## 9. References

- DeepL API Docs: https://www.deepl.com/docs-api
- DeepL Node SDK: https://github.com/DeepLcom/deepl-node
- Mevcut Glossary Schema: `packages/db/schema/ai-context.ts`
- Translation Agent: `apps/api/domains/ai/agents/translation-agent.ts`
- Sync Worker: `apps/sync-worker/src/processor.ts`
