# Mention-Based System: Quick Reference Guide

**For:** Better-i18n AI Translation System
**Updated:** January 11, 2026
**Purpose:** Quick lookup for mention parsing patterns

---

## The 4 Mention Patterns (At a Glance)

### 🎯 Pattern 1: FULL DOT-NOTATION
**What:** `affordableEnglishLearning.comparison.columns.carna.title'i çevirsene`
**Parse:** namespace=`affordableEnglishLearning` + key=`comparison.columns.carna.title`
**Action:** → getTranslations → proposeTranslations
**Result:** Single key translated ✅

```
Input: "affordableEnglishLearning.comparison.columns.carna.title'i çevirsene"
↓ (PARSE)
ns: "affordableEnglishLearning"
key: "comparison.columns.carna.title"
↓ (FETCH)
getTranslations({ namespace: "affordableEnglishLearning" })
↓ (PROPOSE)
proposeTranslations({ keyId: "...", t: "Turkish..." })
✅ Result: ONE key translated
```

---

### 📦 Pattern 2: NAMESPACE ONLY
**What:** `hero'yu çevir` or `auth bölümünü tamamla`
**Parse:** namespace=`hero` or namespace=`auth`
**Action:** → getTranslations({ namespace: "hero" }) → proposeTranslations
**Result:** All keys in namespace translated ✅

```
Input: "hero'yu çevir"
↓ (PARSE)
ns: "hero"
↓ (FETCH)
getTranslations({ namespace: "hero" })
↓ (PROPOSE)
proposeTranslations({ all keys in hero: "Turkish..." })
✅ Result: ALL hero keys translated
```

---

### 📚 Pattern 3: MULTIPLE NAMESPACES (BATCH!)
**What:** `hero ve auth'i tamamla` or `hero, auth, common'ı çevir`
**Parse:** namespaces=`["hero", "auth"]`
**Action:** → getUntranslatedKeys({ namespaces: [...] }) SINGLE CALL → proposeTranslations
**Result:** All keys in all namespaces ✅ + FAST 🚀

```
Input: "hero ve auth'i tamamla"
↓ (PARSE)
ns: ["hero", "auth"]
↓ (BATCH FETCH - SINGLE CALL!)
getUntranslatedKeys({ namespaces: ["hero", "auth"], languageCodes: ["tr"] })
↓ (PROPOSE)
proposeTranslations({ all keys... })
✅ Result: ALL hero + auth keys
🚀 Speed: 1 call instead of 2 = 2x faster
```

---

### ❌ Pattern 4: VAGUE / NO MENTION
**What:** `bu kısmı çevir` or `şunları translate et` or just `çevir`
**Parse:** ???
**Action:** ❌ STOP - Ask for clarification
**Result:** User provides namespace, then follow Pattern 1-3 ✅

```
Input: "bu kısmı çevir"
↓ (PARSE)
ns: ??? (vague - could be anything)
↓ (NO ACTION - ASK)
"Hangi namespace? Örneğin: hero, auth, common, billing"
↓ (USER RESPONDS)
"auth'ı çevir" → Now Pattern 2 applies
✅ Result: Clear scope after clarification
```

---

## Decision Tree

```
User says something with translate/improve/fill

     ↓

Is there a mention in the message?
│
├─YES (Pattern 1-3):
│  │
│  ├─Contains dots (e.g., hero.title)?
│  │  └─YES → Pattern 1: Full key
│  │     [namespace="hero", key="title"]
│  │     → getTranslations → proposeTranslations
│  │
│  ├─Single word + action (e.g., hero'yu çevir)?
│  │  └─YES → Pattern 2: Namespace
│  │     [namespace="hero"]
│  │     → getTranslations({ namespace: "hero" })
│  │     → proposeTranslations
│  │
│  └─Multiple namespaces (e.g., hero ve auth)?
│     └─YES → Pattern 3: Multiple (BATCH!)
│        [namespaces=["hero", "auth"]]
│        → getUntranslatedKeys({ namespaces: [...] }) [1 CALL]
│        → proposeTranslations
│
└─NO (Pattern 4):
   └─Ask: "Hangi namespace? Örneğin: hero, auth, common"
      → User responds → Go back to tree with new input
```

---

## Performance Tips

### ✅ FAST (Do This)
```javascript
// Single call for multiple items
getUntranslatedKeys({
  namespaces: ["hero", "auth", "common"],  // ALL at once
  languageCodes: ["tr", "fr"]               // ALL at once
})
// Result: 1 API call, 200ms response

// Batch key details
getKeyDetailsBatch({
  keyIds: ["id1", "id2", "id3", "id4", "id5"]  // ALL at once
})
// Result: 1 API call, 150ms response
```

### ❌ SLOW (Don't Do This)
```javascript
// Loop = N calls = N × 500ms
for (const namespace of ["hero", "auth", "common"]) {
  getUntranslatedKeys({ namespaces: [namespace] })  // 3 calls!
}
// Result: 3 API calls, 1500ms response (3x slower!)

// Individual calls = N × 200ms
await getKeyDetails({ keyId: "id1" })  // Call 1
await getKeyDetails({ keyId: "id2" })  // Call 2
await getKeyDetails({ keyId: "id3" })  // Call 3
// Result: 3 API calls, 600ms response (slower!)
```

**Rule:** If making 2+ calls → check if you can batch them into 1 call

---

## Common Turkish Patterns

| User Says | Pattern | What It Means |
|-----------|---------|---------------|
| `hero'yu çevir` | Pattern 2 | Translate hero namespace |
| `affordableEnglishLearning.comparison.columns.carna.title'i çevirsene` | Pattern 1 | Translate that specific key |
| `hero ve auth'i tamamla` | Pattern 3 | Complete hero + auth (both) |
| `hero, auth, common'ı çevir` | Pattern 3 | Translate hero, auth, common (all three) |
| `bu kısmı çevir` | Pattern 4 | Vague - ask for clarification |
| `şunları translate et` | Pattern 4 | Vague - ask for clarification |
| `çevir` | Pattern 4 | No context - ask which namespace |
| `auth'ı iyileştir` | Pattern 2 | Improve auth namespace |
| `hero.title'ı gözden geçir` | Pattern 1 | Review that specific key |

---

## Error Recovery Examples

### Case 1: User Says Vague Thing
```
User: "çevir"
System: "Hangi bölümü çevirmek istiyorsunuz?
         Örneğin: hero, auth, common, billing"

↓ User responds ↓

User: "auth'ı çevir"
System: [Follows Pattern 2 workflow]
```

### Case 2: Namespace Not Found
```
User: "nonexistent'ı çevir"
System calls: getTranslations({ namespace: "nonexistent" })
Returns: Empty result

System responds:
"nonexistent namespace'ında key bulamadım.
 Mevcut bölümler: hero, auth, common, billing,
 features, landing, pricing"

User chooses → System continues
```

### Case 3: Typo in Key Name
```
User: "hero.titel'i çevir" (typo: titel instead of title)
System calls: getTranslations({ namespace: "hero" })
Fetches all hero keys, looks for "titel"
Returns: Key not found

System responds:
"hero namespace'ında 'titel' key'i bulamadım.
 Benzer keys: hero.title, hero.subtitle
 Hangisini çevirmek istiyorsunuz?"
```

---

## Workflow Examples

### Workflow A: User wants to translate ONE specific key
```
User: "affordableEnglishLearning.comparison.columns.carna.title'i çevirsene"

1. Parse: Pattern 1 detected
   └─ ns="affordableEnglishLearning", key="comparison.columns.carna.title"

2. Verify: Do I need to fetch first?
   └─ YES → Don't have the sourceText yet

3. Fetch: Call getTranslations
   └─ getTranslations({ namespace: "affordableEnglishLearning" })
   └─ Returns: { keyId: "abc-123", name: "comparison.columns.carna.title",
                  sourceText: "Learn English affordably" }

4. Translate: Generate translation
   └─ sourceText: "Learn English affordably"
   └─ targetLang: Turkish (from message language)
   └─ Result: "İngilizceyi uygun fiyatla öğrenin"

5. Propose: Call proposeTranslations
   └─ proposeTranslations({
        t: [{ k: "abc-123", l: "tr", t: "İngilizceyi uygun fiyatla öğrenin",
              n: "affordableEnglishLearning.comparison.columns.carna.title" }]
      })

✅ Result: Only 1 key translated (as expected)
⏱️ Time: ~500ms (1 getTranslations call + generate + 1 proposeTranslations call)
```

### Workflow B: User wants to translate MULTIPLE namespaces
```
User: "hero ve auth'i tamamla"

1. Parse: Pattern 3 detected
   └─ ns=["hero", "auth"]

2. Verify: Do I need to fetch first?
   └─ YES → Need to see what's missing

3. Fetch (BATCHED): Call getUntranslatedKeys with both namespaces
   └─ getUntranslatedKeys({
        namespaces: ["hero", "auth"],
        languageCodes: ["tr"]  // from context
      })
   └─ Returns: [
        { keyId: "1", namespace: "hero", name: "title", sourceText: "Welcome" },
        { keyId: "2", namespace: "hero", name: "subtitle", sourceText: "Start here" },
        { keyId: "3", namespace: "auth", name: "login", sourceText: "Login" },
        { keyId: "4", namespace: "auth", name: "signup", sourceText: "Sign up" }
      ]

4. Translate: Generate all translations
   └─ Result: 4 translated keys

5. Propose: Call proposeTranslations (BATCH)
   └─ proposeTranslations({
        t: [
          { k: "1", l: "tr", t: "Hoş geldiniz", n: "hero.title" },
          { k: "2", l: "tr", t: "Buradan başlayın", n: "hero.subtitle" },
          { k: "3", l: "tr", t: "Giriş Yap", n: "auth.login" },
          { k: "4", l: "tr", t: "Kaydol", n: "auth.signup" }
        ]
      })

✅ Result: All 4 keys translated from 2 namespaces
⏱️ Time: ~400ms (1 batched getUntranslatedKeys + generate + 1 proposeTranslations)
🚀 Speed: 2x faster than calling getUntranslatedKeys twice
```

---

## Testing Mention Parsing

### Test 1: Full Dot-Notation
**Input:** `affordableEnglishLearning.comparison.columns.carna.title'i çevirsene`
**Expected Parse:** namespace="affordableEnglishLearning", key="comparison.columns.carna.title"
**Check:** ✅ Only 1 key translated in proposal

### Test 2: Namespace Only
**Input:** `hero'yu çevir`
**Expected Parse:** namespace="hero"
**Check:** ✅ All hero namespace keys in proposal

### Test 3: Multiple Namespaces
**Input:** `hero ve auth'i tamamla`
**Expected Parse:** namespaces=["hero", "auth"]
**Check:** ✅ Only 1 API call, all hero + auth keys

### Test 4: Vague Request
**Input:** `bu kısmı çevir`
**Expected Parse:** Pattern 4 - ask for clarification
**Check:** ✅ System asks "Hangi namespace?"

### Test 5: Error Recovery
**Input:** `nonexistent'ı çevir`
**Expected:** System can't find namespace, asks for valid options
**Check:** ✅ System lists valid namespaces and asks user

---

## When to Call Developers

If mention parsing doesn't work:
1. Check if pattern was detected correctly
2. Verify dot-notation parsing (first dot = namespace boundary)
3. Check error recovery message (is it helpful?)
4. Consider if Pattern 4 needs better clarification examples
5. Contact: See `docs/system-prompt-research.md` for context

---

## Related Documents

- **Full System Prompt:** `apps/api/prompts/system.ts` (lines 384-522)
- **Research & Background:** `docs/system-prompt-research.md`
- **Improvements Checklist:** `docs/system-prompt-improvements-checklist.md`
- **Tool Definitions:** `apps/api/domains/ai/tools/` directory

---

## TL;DR - The Golden Rule

**IF USER MENTIONS SOMETHING SPECIFIC:**
→ Parse it (Pattern 1-3)
→ Fetch data (1 call, batched if possible)
→ Propose translations
→ Done ✅

**IF USER IS VAGUE:**
→ Ask for clarification with examples
→ User responds with specific mention
→ Back to first case ✅

**IF SOMETHING BREAKS:**
→ Ask user "Which namespace?" with examples
→ Never silently fail
→ User can always guide you back on track ✅
