# Namespace Entity Migration Plan

## 1. Mevcut Durum (As-Is)

### DB Schema

```
translation_key tablosu:
  - namespace: text (nullable) → sadece string, FK yok
  - key: text → "login.button.submit"
  - unique(repositoryId, namespace, key)

cdn_files tablosu:
  - namespace: text → default "translations"
  - unique(projectId, language, namespace)

activity_item tablosu:
  - namespace: text → sadece string
```

### Namespace Kullanım Haritası (Tüm Dosyalar)

#### 1.1 DB Schema (3 tablo)

| Dosya | Tablo | Kullanım |
|-------|-------|----------|
| `packages/db/schema/github.ts:284` | `translationKey.namespace` | `text("namespace")` - nullable string |
| `packages/db/schema/github.ts:317` | unique constraint | `unique().on(table.repositoryId, table.namespace, table.key)` |
| `packages/db/schema/github.ts:548` | `cdnFiles.namespace` | `text("namespace").default("translations")` |
| `packages/db/schema/github.ts:560` | unique constraint | `unique().on(table.projectId, table.language, table.namespace)` |
| `packages/db/schema/activity.ts:166` | `activityItem.namespace` | `text("namespace")` - activity item log |

#### 1.2 Sync Worker (6 dosya, ~50+ referans)

| Dosya | Satır | Kullanım |
|-------|-------|----------|
| **processors/utils/file-transformation.ts** | 143-146 | `extractNamespaceFromKey()` → key'den namespace çıkarır ("auth.login" → "auth") |
| **processors/utils/file-transformation.ts** | 162 | `groupByNamespace()` → key'leri namespace'e göre gruplar |
| **processors/utils/processor-helpers.ts** | 161, 209 | `key.namespace \|\| extractNamespaceFromKey(key.key)` → fallback mantığı |
| **processors/utils/processor-helpers.ts** | 188-195, 236-242 | `key.namespace ? \`${key.namespace}.${key.key}\`` → fullKeyPath oluşturma |
| **processors/github/initial-import.processor.ts** | 159, 186-187, 217-219, 259, 290 | Import sırasında namespace extraction ve prefix handling |
| **processors/github/source-sync.processor.ts** | 126, 134, 147, 175, 221-223 | Source sync sırasında namespace matching ve extraction |
| **processors/github/full-sync.processor.ts** | 220, 232, 239, 266, 316-318, 383, 483 | Full sync namespace handling |
| **processors/cdn/cdn-upload.processor.ts** | 283, 292-294, 310-313, 329, 355, 361-363, 442-445, 559 | CDN upload sırasında namespace-based file grouping |
| **processors/cdn/cdn-merge.processor.ts** | 193-195, 212-215, 227, 247, 253-255, 312-315, 367, 377-380, 389 | CDN merge sırasında namespace comparison |
| **processors/publish/publish-batch.processor.ts** | 356, 370, 375, 383, 440, 600, 622 | Publish batch - namespace'e göre dosya path oluşturma |
| **processors/publish/publish-sync.processor.ts** | 296, 317, 567 | Publish sync - cdnFiles.namespace karşılaştırma |
| **processors/cdn/cdn-setup.processor.ts** | 142 | CDN setup - `eq(cdnFiles.namespace, namespace)` |

#### 1.3 API Domain Layer (15+ dosya, ~80+ referans)

| Dosya | Referans Sayısı | Kritik Kullanım |
|-------|-----------------|-----------------|
| **domains/project/translation/service.ts** | ~30 referans | Namespace filtering, DISTINCT query, key creation with extracted namespace |
| **domains/project/cdn/service.ts** | ~25 referans | CDN file management, namespace-based R2 paths, duplicate detection |
| **domains/project/cdn/schemas.ts** | 3 referans | `namespaceHandling: "auto"\|"single"\|"none"`, `keepFormat: "flat"\|"namespaced"` |
| **domains/ai/mcp/router.ts** | ~20 referans | `normalizeNamespace()`, namespace filtering, key creation |
| **domains/ai/mcp/helpers.ts** | 4 referans | `normalizeNamespace()`, `namespaceCondition()` |
| **domains/ai/mcp/schemas.ts** | 3 referans | `ns` field in compact schemas |
| **domains/ai/tools/get-translations.ts** | ~15 referans | Namespace filtering, OR-based matching (field + key prefix) |
| **domains/ai/tools/propose-translations.ts** | ~8 referans | `namespace:key` map format, key resolution |
| **domains/ai/tools/propose-translation-edits.ts** | ~5 referans | Namespace in tool prompts |
| **domains/ai/tools/propose-delete-keys.ts** | 3 referans | `ns` field in deletion proposals |
| **domains/ai/tools/get-project-stats.ts** | 1 referans | `CRITICAL_NAMESPACES` constant |
| **domains/project/activity/recorder.ts** | 2 referans | Activity recording with namespace |
| **domains/project/activity/service.ts** | 1 referans | Activity item namespace field |

#### 1.4 Frontend (48 dosya)

| Dosya | Kritik Kullanım |
|-------|-----------------|
| **translations/translations-editor.tsx** | Namespace grouping, expansion, filtering |
| **translations/translation-table.tsx** | `TranslationNamespace` type, `isNamespaceRow()` helper |
| **translations/search-filter-bar.tsx** | Namespace filter UI |
| **translations/pending-changes-tree.tsx** | Namespace tree display |
| **translations/pending-publish-popover.tsx** | Namespace-based publish grouping |
| **cdn/\*.tsx** (7 dosya) | CDN upload/merge namespace handling |
| **translations/ai/\*.tsx** (10+ dosya) | AI mention system, namespace context |

---

## 2. Hedef Durum (To-Be) - Tolgee Modeli

### Yeni Schema

```
translation_namespace (YENİ TABLO):
  - id: text PK
  - repositoryId: text FK → github_repository
  - name: text NOT NULL           // "auth", "checkout", "common"
  - description: text             // "Authentication akışı metinleri" (Tolgee'de YOK, bizim eklememiz)
  - context: text                 // AI için detaylı context (Tolgee'de YOK)
  - UNIQUE(repositoryId, name)

translation_key (GÜNCELLEME):
  - namespaceId: text FK → translation_namespace (nullable, ON DELETE SET NULL)
  - namespace: text               // GEÇİŞ DÖNEMİNDE KALIR, sonra kaldırılır
  - description: text             // Key-level context (Tolgee KeyMeta gibi)
  - UNIQUE güncelleme: (repositoryId, namespaceId, key) → yeni unique

cdn_files (GÜNCELLEME - Faz 2):
  - namespaceId: text FK → translation_namespace (nullable, ON DELETE SET NULL)
  - namespace: text               // GEÇİŞ DÖNEMİNDE KALIR, sonra kaldırılır
  - UNIQUE güncelleme: (projectId, language, namespaceId) → yeni unique

activity_item (GÜNCELLEME - Faz 2):
  - namespaceId: text FK → translation_namespace (nullable, ON DELETE SET NULL)
  - namespace: text               // GEÇİŞ DÖNEMİNDE KALIR, sonra kaldırılır
  // Activity history korunmalı - namespace silinse bile log kayıtları kalır
```

### Platform Karşılaştırması (Tolgee, Phrase, Crowdin)

| Özellik | Tolgee | Phrase | Crowdin | Bizim Hedef |
|---------|--------|-------|---------|-------------|
| Namespace | ✅ Ayrı tablo (FK) | ❌ Yok (tags kullanır) | ❌ Yok (directories kullanır) | ✅ Ayrı tablo (FK) |
| Key description | ✅ KeyMeta tablosu | ✅ `description` field | ✅ `context` field | ✅ `translation_key.description` |
| Namespace description | ❌ Yok | N/A | N/A | ✅ `description` + `context` (Tolgee'den ileride) |
| Organizasyon | Namespace + Tags | Tags only | Directories + Labels | Namespace |
| Namespace kaynağı | Explicit (API'de ayrı field) | N/A | N/A | JSON yapısından parse (top-level key) |
| Nested namespace | ❌ Flat | N/A | N/A | ❌ Flat (aynı kalacak) |
| Auto-cleanup | ✅ Boş namespace silinir | N/A | N/A | ✅ Faz 2'de eklenecek |
| cdnFiles namespace | N/A | N/A | N/A | ✅ FK'ya dönecek (Faz 2) |
| activityItem namespace | N/A | N/A | N/A | ✅ FK eklenecek (Faz 2) |

**Önemli fark:** Tolgee'de namespace key adından çıkarılmaz, API'de explicit olarak verilir:
```
Tolgee: { name: "error.network", namespace: "errors" }  // dots key'in parçası
Bizim:  JSON { "errors": { "error": { "network": "..." } } }  // top-level key = namespace
```

Tolgee namespace'i kullanıcı seçer, biz JSON yapısından parse ediyoruz. Phrase ve Crowdin'de namespace konsepti yok - tags/directories ile organize ediyorlar.

---

## 3. Migration Stratejisi: Soft Migration (3 Faz)

### Faz 1: Yeni Schema + Dual Write (Mevcut kodu bozmadan)

**Amaç:** Namespace tablosunu oluştur, mevcut kodu bozmadan yeni FK'yı ekle.

#### Faz 1a: Schema Oluşturma

**Dosya: `packages/db/schema/github.ts`**

- Yeni `translationNamespace` tablosu ekle
  - id, repositoryId, name, description, context, createdAt, updatedAt
  - UNIQUE(repositoryId, name)
  - Relations: project (via repository), keys (one-to-many)

- `translationKey` tablosuna ekle:
  - `namespaceId: text("namespace_id") FK → translationNamespace.id` (nullable)
  - `description: text("description")` (nullable)
  - Mevcut `namespace` string field'ı KALIR

- `cdnFiles` tablosu: Faz 1'de değişmez, Faz 2'de namespaceId FK eklenecek
- `activityItem` tablosu: Faz 1'de değişmez, Faz 2'de namespaceId FK eklenecek

**Dosya: `packages/db/schema/index.ts`**
- Yeni schema export ekle

#### Faz 1b: Migration Script

**Dosya: `packages/db/migrations/XXXX_add_namespace_table.sql`**

```sql
-- 1. Yeni tablo
CREATE TABLE translation_namespace (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id TEXT NOT NULL REFERENCES github_repository(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(repository_id, name)
);

-- 2. translation_key'e yeni kolonlar
ALTER TABLE translation_key ADD COLUMN namespace_id TEXT REFERENCES translation_namespace(id) ON DELETE SET NULL;
ALTER TABLE translation_key ADD COLUMN description TEXT;

-- 3. Mevcut unique namespaceleri migrate et
INSERT INTO translation_namespace (repository_id, name)
SELECT DISTINCT repository_id, namespace
FROM translation_key
WHERE namespace IS NOT NULL AND namespace != '';

-- 4. FK'leri doldur
UPDATE translation_key tk
SET namespace_id = tn.id
FROM translation_namespace tn
WHERE tk.repository_id = tn.repository_id
  AND tk.namespace = tn.name;

-- 5. Yeni unique constraint (eski kalır, yenisi eklenir)
-- Dikkat: Eski unique(repositoryId, namespace, key) kalıyor
-- Yeni: namespaceId bazlı unique ileride eklenecek (Faz 3'te)
```

#### Faz 1c: Dual Write Logic

Her yerde namespace yazılan yerde, hem string hem FK yazılacak:

**Etkilenen dosyalar:**

| Dosya | Değişiklik |
|-------|-----------|
| `apps/api/domains/project/translation/service.ts` → `createKey()` | Key oluştururken: namespace string + namespaceId FK birlikte yaz |
| `apps/api/domains/ai/mcp/router.ts` → `createKeys` | Aynı dual write |
| `apps/api/domains/ai/mcp/helpers.ts` → `normalizeNamespace()` | Namespace resolve + getOrCreate helper |
| `apps/sync-worker/src/processors/github/initial-import.processor.ts` | Import sırasında namespace entity oluştur + FK yaz |
| `apps/sync-worker/src/processors/github/source-sync.processor.ts` | Yeni key oluştururken namespace entity getOrCreate |
| `apps/sync-worker/src/processors/github/full-sync.processor.ts` | Aynı |

**Yeni helper fonksiyon:**

```typescript
// packages/db veya apps/api/domains/project/namespace/service.ts
async function getOrCreateNamespace(
  db: Database,
  repositoryId: string,
  name: string
): Promise<string | null> {
  if (!name || name === "default") return null;

  // Try to find existing
  const existing = await db.query.translationNamespace.findFirst({
    where: and(
      eq(translationNamespace.repositoryId, repositoryId),
      eq(translationNamespace.name, name),
    ),
  });
  if (existing) return existing.id;

  // Create new
  const [created] = await db.insert(translationNamespace).values({
    repositoryId,
    name,
  }).returning({ id: translationNamespace.id });

  return created.id;
}
```

---

### Faz 2: Okuma Katmanını Güncelle (FK'dan oku)

**Amaç:** Tüm okuma sorgularını namespaceId FK üzerinden çalışacak şekilde güncelle. String field hâlâ var ama artık okunmuyor.

#### Faz 2a: API Query Layer

**Dosya: `apps/api/domains/project/translation/service.ts`**

| Metod | Mevcut | Hedef |
|-------|--------|-------|
| `listKeys()` | `WHERE namespace = 'auth'` | `JOIN translation_namespace ON ... WHERE tn.name = 'auth'` |
| `listKeys()` namespace DISTINCT | `SELECT DISTINCT namespace FROM translation_key` | `SELECT id, name, description FROM translation_namespace WHERE repositoryId = ?` |
| `createKey()` | `namespace: extractNamespaceFromKey(key)` | `namespaceId: await getOrCreateNamespace(...)` + legacy string (auto-detection kaldırılır) |

**Dosya: `apps/api/domains/ai/mcp/router.ts`**

| Endpoint | Değişiklik |
|----------|-----------|
| `getProject` | `SELECT DISTINCT namespace` → `SELECT * FROM translation_namespace` (description dahil) |
| `listKeys` | Namespace filtering via JOIN |
| `getAllTranslations` | Response'a namespace description ekle |
| `createKeys` | getOrCreateNamespace() + namespaceId yazma |
| `updateKeys` | Namespace lookup via namespaceId |

**Dosya: `apps/api/domains/ai/mcp/helpers.ts`**

| Fonksiyon | Değişiklik |
|-----------|-----------|
| `normalizeNamespace()` | String → namespaceId resolve |
| `namespaceCondition()` | `eq(translationKey.namespace, ...)` → `eq(translationKey.namespaceId, ...)` |

**Dosya: `apps/api/domains/ai/tools/get-translations.ts`**

| Değişiklik | Detay |
|-----------|-------|
| Namespace filtering | `eq(translationKey.namespace, ns)` → `JOIN translation_namespace` |
| Response format | Namespace description'ı response'a ekle |

**Dosya: `apps/api/domains/ai/tools/propose-translations.ts`**

| Değişiklik | Detay |
|-----------|-------|
| Key lookup | `namespace:key` map → `namespaceId:key` map |

**Dosya: `apps/api/domains/ai/tools/propose-translation-edits.ts`**

| Değişiklik | Detay |
|-----------|-------|
| Key lookup | Aynı refactor |

**Dosya: `apps/api/domains/ai/tools/propose-delete-keys.ts`**

| Değişiklik | Detay |
|-----------|-------|
| ns field | String → ID resolve |

**Dosya: `apps/api/domains/project/cdn/service.ts`**

| Metod | Değişiklik |
|-------|-----------|
| CDN file lookup | `eq(translationKey.namespace, ...)` → JOIN bazlı |
| Duplicate detection | `key.namespace` → `key.namespaceId` + JOIN |
| R2 path generation | Namespace name'i JOIN'den al |

#### Faz 2b: Sync Worker

**Dosya: `apps/sync-worker/src/processors/utils/processor-helpers.ts`**

| Satır | Mevcut | Hedef |
|-------|--------|-------|
| 161 | `key.namespace \|\| extractNamespaceFromKey(key.key)` | Namespace name'i JOIN'den al (extractNamespaceFromKey kaldırılacak) |
| 191-192 | `key.namespace ? \`${key.namespace}.${key.key}\`` | `namespaceName ? \`${namespaceName}.${key.key}\`` |

**Dosya: `apps/sync-worker/src/processors/utils/file-transformation.ts`**

| Fonksiyon | Değişiklik |
|-----------|-----------|
| `extractNamespaceFromKey()` | KALDIRILACAK - JSON_NESTED'da namespace top-level JSON key'den geliyor, ayrı fonksiyona gerek yok |
| `groupByNamespace()` | Namespace name parametresi alır (string) veya namespaceId bazlı çalışır |

**Tüm processor dosyaları (initial-import, source-sync, full-sync, cdn-upload, cdn-merge, publish-batch, publish-sync):**

- `key.namespace` → `key.namespaceName` (JOIN'den gelen) veya resolve helper
- Yeni key insert: `namespaceId` FK ile
- CDN file operations: Faz 2b'de hâlâ string, Faz 2c'de namespaceId FK eklenir

#### Faz 2c: cdnFiles ve activityItem FK Migration

**Dosya: `packages/db/schema/github.ts` - cdnFiles tablosu**

- `namespaceId: text("namespace_id") FK → translationNamespace.id` (nullable) ekle
- Mevcut `namespace: text` string field KALIR (dual write)
- Unique constraint güncelleme: Yeni `(projectId, language, namespaceId)` eklenir, eski kalır

**Migration SQL:**

```sql
-- cdnFiles tablosuna FK ekle (ON DELETE SET NULL - CDN history korunur)
ALTER TABLE cdn_files ADD COLUMN namespace_id TEXT REFERENCES translation_namespace(id) ON DELETE SET NULL;

-- Mevcut cdnFiles'ların namespace_id'lerini doldur
UPDATE cdn_files cf
SET namespace_id = tn.id
FROM translation_namespace tn
WHERE cf.namespace = tn.name
  AND tn.repository_id IN (
    SELECT repository_id FROM project WHERE id = cf.project_id
  );
```

**Dosya: `packages/db/schema/activity.ts` - activityItem tablosu**

- `namespaceId: text("namespace_id") FK → translationNamespace.id` (nullable) ekle
- Mevcut `namespace: text` string field KALIR (dual write)

**Migration SQL:**

```sql
-- activityItem tablosuna FK ekle (ON DELETE SET NULL - activity history korunur)
ALTER TABLE activity_item ADD COLUMN namespace_id TEXT REFERENCES translation_namespace(id) ON DELETE SET NULL;

-- Mevcut activity_item'ların namespace_id'lerini doldur (opsiyonel - eski loglar string kalabilir)
-- Yeni activity'ler dual write ile namespace_id alacak
```

**Etkilenen dosyalar:**

| Dosya | Değişiklik |
|-------|-----------|
| `apps/api/domains/project/cdn/service.ts` | CDN file oluştururken namespaceId FK yaz |
| `apps/api/domains/project/activity/recorder.ts` | Activity kaydederken namespaceId FK yaz |
| `apps/sync-worker/src/processors/cdn/cdn-upload.processor.ts` | CDN upload sırasında namespaceId FK yaz |
| `apps/sync-worker/src/processors/cdn/cdn-merge.processor.ts` | CDN merge sırasında namespaceId FK yaz |
| `apps/sync-worker/src/processors/publish/publish-batch.processor.ts` | Publish sırasında namespaceId FK yaz |

#### Faz 2d: Namespace Auto-Cleanup

Tolgee modelinde olduğu gibi, son key silindiğinde boş namespace otomatik silinir.

**Uygulama:** DB trigger veya application-level logic

**Seçenek 1: Application-level (Önerilen)**

```typescript
// apps/api/domains/project/translation/service.ts veya namespace/service.ts
async function deleteKeyAndCleanup(db: Database, keyId: string) {
  const key = await db.query.translationKey.findFirst({
    where: eq(translationKey.id, keyId),
    columns: { namespaceId: true },
  });

  await db.delete(translationKey).where(eq(translationKey.id, keyId));

  // Auto-cleanup: Eğer namespace'te başka key kalmadıysa sil
  if (key?.namespaceId) {
    const remainingKeys = await db.query.translationKey.findFirst({
      where: eq(translationKey.namespaceId, key.namespaceId),
    });
    if (!remainingKeys) {
      await db.delete(translationNamespace).where(
        eq(translationNamespace.id, key.namespaceId)
      );
    }
  }
}
```

**Seçenek 2: DB Trigger**

```sql
CREATE OR REPLACE FUNCTION cleanup_empty_namespace()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM translation_key WHERE namespace_id = OLD.namespace_id
  ) THEN
    DELETE FROM translation_namespace WHERE id = OLD.namespace_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_namespace
AFTER DELETE ON translation_key
FOR EACH ROW
WHEN (OLD.namespace_id IS NOT NULL)
EXECUTE FUNCTION cleanup_empty_namespace();
```

**Etkilenen yerler:**

| Yer | Açıklama |
|-----|----------|
| `apps/api/domains/project/translation/service.ts` → `deleteKey()` | Key silindiğinde auto-cleanup |
| `apps/api/domains/ai/mcp/router.ts` → `deleteKeys` | MCP üzerinden key silindiğinde |
| `apps/sync-worker/src/processors/github/source-sync.processor.ts` | Sync sırasında key silindiğinde |
| `apps/sync-worker/src/processors/github/full-sync.processor.ts` | Full sync sırasında key silindiğinde |

#### Faz 2e: Frontend

**Dosya: `apps/app/components/translations/translations-editor.tsx`**

| Değişiklik | Detay |
|-----------|-------|
| Namespace grouping | API'den gelen response zaten namespace name içerir, minimal değişiklik |
| Namespace description gösterimi | Yeni: Namespace header'a description tooltip ekle |

**Dosya: `apps/app/components/translations/translation-table.tsx`**

| Değişiklik | Detay |
|-----------|-------|
| `TranslationNamespace` type | `id` field eklenir (namespace entity ID) |
| Description tooltip | Namespace satırında description göster |

**Dosya: `apps/app/components/translations/search-filter-bar.tsx`**

| Değişiklik | Detay |
|-----------|-------|
| Namespace filter | String list → namespace entity list (name + id) |

#### Faz 2f: AI System Prompt Entegrasyonu

**Dosya: `apps/api/domains/ai/agents/translation-agent.ts`**

| Değişiklik | Detay |
|-----------|-------|
| System prompt | Namespace description + context bilgisini prompt'a ekle |

**Dosya: `apps/api/domains/ai/tools/get-translations.ts`**

| Değişiklik | Detay |
|-----------|-------|
| Response | Her key'in namespace description'ını response'a ekle |

---

### Faz 3: Legacy Cleanup (String field kaldırma)

**Amaç:** Tüm okuma/yazma namespaceId FK üzerinden çalıştıktan sonra eski string field'ı kaldır.

**Ön koşullar:**
- Tüm okumalar namespaceId'den yapılıyor ✅
- Tüm yazmalar dual write yapıyor ✅
- Production'da 1+ hafta sorunsuz çalışmış ✅
- Tüm mevcut key'lerin namespaceId'si dolu ✅

#### Migration

```sql
-- 1. translation_key: Eski unique constraint'i kaldır
ALTER TABLE translation_key DROP CONSTRAINT translation_key_repository_id_namespace_key_unique;

-- 2. translation_key: Yeni unique constraint ekle
ALTER TABLE translation_key
  ADD CONSTRAINT translation_key_repository_id_namespace_id_key_unique
  UNIQUE(repository_id, namespace_id, key);

-- 3. translation_key: Eski namespace string kolonunu kaldır
ALTER TABLE translation_key DROP COLUMN namespace;

-- 4. cdn_files: Eski unique constraint'i kaldır
ALTER TABLE cdn_files DROP CONSTRAINT cdn_files_project_id_language_namespace_unique;

-- 5. cdn_files: Yeni unique constraint ekle
ALTER TABLE cdn_files
  ADD CONSTRAINT cdn_files_project_id_language_namespace_id_unique
  UNIQUE(project_id, language, namespace_id);

-- 6. cdn_files: Eski namespace string kolonunu kaldır
ALTER TABLE cdn_files DROP COLUMN namespace;

-- 7. activity_item: Eski namespace string kolonunu kaldır
ALTER TABLE activity_item DROP COLUMN namespace;
```

#### Etkilenen tüm dosyalar (son temizlik)

- `packages/db/schema/github.ts` → translation_key ve cdnFiles namespace string field kaldır, unique güncelle
- `packages/db/schema/activity.ts` → activityItem namespace string field kaldır
- `apps/api/domains/project/translation/service.ts` → namespace string referanslarını temizle
- `apps/api/domains/project/cdn/service.ts` → cdnFiles namespace string referanslarını temizle
- `apps/api/domains/project/activity/recorder.ts` → namespace string referanslarını temizle
- `apps/api/domains/ai/mcp/router.ts` → namespace string fallback'leri kaldır
- `apps/api/domains/ai/mcp/helpers.ts` → normalizeNamespace string logic kaldır
- `apps/api/domains/ai/tools/*.ts` → namespace string referanslarını temizle
- `apps/sync-worker/src/processors/**/*.ts` → namespace string okumalarını kaldır
- Frontend dosyaları → namespace string referanslarını temizle

---

## 4. Etki Analizi Özeti

### Toplam Etkilenen Dosya Sayısı

| Katman | Dosya Sayısı | Referans Sayısı |
|--------|-------------|-----------------|
| DB Schema | 3 | ~10 |
| Sync Worker | 10 | ~50 |
| API Domains | 15 | ~80 |
| Frontend | 48 | ~100+ |
| **TOPLAM** | **~76** | **~240+** |

### Risk Matrisi

| Risk | Olasılık | Etki | Mitigation |
|------|----------|------|------------|
| Dual write inconsistency | Orta | Yüksek | getOrCreateNamespace atomic yapılır |
| Sync worker namespace resolve hatası | Yüksek | Yüksek | Fallback: string namespace hâlâ okunabilir |
| CDN export path bozulması | Orta | Çok Yüksek | Faz 2'de dual write, Faz 3'te string kaldırılır |
| Frontend namespace filter kırılması | Düşük | Orta | API response formatı backward compat |
| AI tool namespace resolution hatası | Orta | Orta | Fallback: string-based lookup |
| Unique constraint violation | Düşük | Yüksek | Migration script dikkatli yazılır |

### FK ON DELETE Davranışları

| Tablo | FK | ON DELETE | Neden |
|-------|-----|-----------|-------|
| `translation_key.namespaceId` | → `translation_namespace.id` | **SET NULL** | Key silinmemeli, namespace'siz kalabilir |
| `cdn_files.namespaceId` | → `translation_namespace.id` | **SET NULL** | CDN history korunmalı |
| `activity_item.namespaceId` | → `translation_namespace.id` | **SET NULL** | Activity history asla bozulmamalı |
| `translation_namespace.repositoryId` | → `github_repository.id` | **CASCADE** | Repo silinirse namespace'ler de silinir |

**Not:** `translation_namespace` silindiğinde tüm FK'lar NULL olur. Bu sayede:
- Key'ler kaybolmaz (namespace'siz devam eder)
- CDN file geçmişi korunur
- Activity logları bozulmaz

### Backward Compatible API Response

Geçiş döneminde API response'larda hem string hem FK döndürülür:

```typescript
// Eski format (backward compat):
{ namespace: "auth", key: "login.button" }

// Yeni format (ek alanlar):
{
  namespace: "auth",              // ← String kalır (backward compat)
  namespaceId: "ns_abc123",       // ← Yeni FK
  namespaceDescription: "Auth flow texts",  // ← Yeni metadata
  key: "login.button",
  keyDescription: "Login page submit button" // ← Yeni key-level context
}
```

Frontend'de ilk etapta değişiklik gerekmez - mevcut `namespace` string field'ı çalışmaya devam eder.

### Geri Dönüş Planı

- **Faz 1:** Geri dönüş kolay - yeni tablo + kolon drop edilir
- **Faz 2:** Geri dönüş orta - okuma sorgularını eski haline çevir
- **Faz 3:** Geri dönüş ZOR - string kolon geri eklenip doldurulamaz. Bu yüzden Faz 3 sadece her şey stabil olduğunda yapılır.

---

## 5. Uygulama Sırası (Önerilen)

```
Faz 1a: Schema oluşturma (packages/db)
  ├→ translation_namespace tablosu oluştur
  ├→ translation_key'e namespaceId FK + description ekle
  └→ Faz 1b: Migration script (packages/db/migrations)
      ├→ Mevcut namespace string'lerden translation_namespace kayıtları oluştur
      ├→ translation_key.namespace_id FK'lerini doldur
      └→ Faz 1c: Dual write helper (getOrCreateNamespace)
          ├→ Faz 1c: translation/service.ts createKey güncelle
          ├→ Faz 1c: mcp/router.ts createKeys güncelle
          └→ Faz 1c: sync-worker processors (initial-import, source-sync, full-sync)
              └→ TEST: Yeni key'ler hem namespace string hem namespaceId ile oluşuyor mu?

Faz 2a: API query layer (translation/service.ts)
  ├→ Faz 2a: MCP router queries (mcp/router.ts, helpers.ts)
  ├→ Faz 2a: AI tools (get-translations.ts, propose-*.ts)
  └→ Faz 2a: CDN service (cdn/service.ts)
      └→ Faz 2b: Sync worker processors (tüm processors)
          └→ Faz 2c: cdnFiles + activityItem FK migration
              ├→ cdnFiles tablosuna namespaceId FK ekle + dual write
              ├→ activityItem tablosuna namespaceId FK ekle + dual write
              └→ TEST: cdnFiles ve activityItem'lar namespaceId ile oluşuyor mu?
                  └→ Faz 2d: Namespace auto-cleanup
                      ├→ Key silindiğinde boş namespace auto-delete
                      └→ TEST: Son key silinince namespace da siliniyor mu?
                          └→ Faz 2e: Frontend (translations-editor, translation-table, search-filter-bar)
                              ├→ Namespace description tooltip gösterimi
                              ├→ Key description alanı
                              └→ Faz 2f: AI system prompt (translation-agent.ts)
                                  ├→ Namespace description + context prompt'a eklenir
                                  ├→ Key description prompt'a eklenir
                                  └→ TEST: Tüm akışlar namespaceId ile çalışıyor mu?

Faz 3: Legacy cleanup (1+ hafta stabil çalışma sonrası)
  ├→ Migration: translation_key.namespace string column drop
  ├→ Migration: cdn_files.namespace string column drop
  ├→ Migration: activity_item.namespace string column drop
  ├→ Unique constraint'leri güncelle (string → namespaceId)
  └→ Tüm dosyalardan namespace string referanslarını temizle
```

---

## 6. Yeni API Endpoints (Namespace Management)

### Namespace CRUD

```
POST   /namespace.create     → { repositoryId, name, description?, context? }
GET    /namespace.list       → { projectId } → [{ id, name, description, context, keyCount }]
PATCH  /namespace.update     → { id, description?, context? }
DELETE /namespace.delete      → { id } (sadece boşsa veya force)
```

### MCP Endpoints

```
getProject response'una ekle:
  namespaces: [{ name: "auth", description: "Auth flows", keyCount: 45 }]

getAllTranslations response'una ekle:
  namespaceContext: { "auth": { description: "...", context: "..." } }

createKeys input'a ekle:
  nsCtx: { "auth": { description: "...", context: "..." } }  // Opsiyonel
```

---

## 7. Kararlar (Eski Açık Sorular - Çözüldü)

1. **cdnFiles.namespace** → ✅ **FK'ya dönecek** (Faz 2c'de namespaceId FK eklenecek, Faz 3'te string kaldırılacak)

2. **activityItem.namespace** → ✅ **FK eklenecek** (Faz 2c'de namespaceId FK eklenecek, Faz 3'te string kaldırılacak)

3. **extractNamespaceFromKey() (auto-detection)** → ❌ **Kaldırılacak** - Yerine format-aware `splitNamespaceAndKey()` gelecek.
   - JSON_NESTED: `{ "auth": { "login": { "title": "..." } } }` → flatten → `auth.login.title` → ilk segment "auth" = namespace, geri kalan "login.title" = key
   - JSON_FLAT: `{ "auth.login.title": "..." }` → ilk segment "auth" = namespace, geri kalan "login.title" = key (aynı kural)
   - Her iki format'ta da **ilk dot'a kadar olan kısım = namespace**, geri kalanı = key
   - `extractNamespaceFromKey()` yanlış çalışıyordu (son segment hariç tümünü namespace yapıyordu: `auth.login.title` → ns:`auth.login`, key:`title`). Yeni `splitNamespaceAndKey()` sadece ilk segmenti alır.
   - `githubRepository.fileFormat` zaten `JSON_FLAT` veya `JSON_NESTED` olarak kayıtlı (schema line 239)

4. **Namespace auto-cleanup** → ✅ **Evet, Faz 2d'de eklenecek** (Son key silindiğinde boş namespace otomatik silinir)

5. **Key-level description** → ✅ **İkisi birden** - Hem `translation_namespace.description/context` hem `translation_key.description` eklenecek (Faz 1a)

6. **JSON_FLAT namespace belirleme** → ✅ **İlk segment = namespace** (`auth.login.title` → ns: `auth`, key: `login.title`). JSON_NESTED ile aynı kural.

7. **Platform araştırması** → ✅ **Tamamlandı** - Tolgee (namespace entity), Phrase (tags, no namespace), Crowdin (directories, no namespace). Sadece Tolgee'de namespace var ama explicit set edilir, biz JSON yapısından parse ediyoruz.

8. **Default namespace** (project seviyesinde) → ⏸️ İleride - Faz 3 sonrası `project.defaultNamespaceId` eklenebilir

9. **useNamespaces feature flag** → ⏸️ Şimdilik gerek yok, tüm projeler namespace kullanabilir
