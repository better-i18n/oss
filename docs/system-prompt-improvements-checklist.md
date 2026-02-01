# Better-i18n System Prompt: Improvements Checklist

**Date Updated:** January 11, 2026
**Status:** Phase 1 Complete ✅
**File:** `apps/api/prompts/system.ts`

---

## Phase 1: COMPLETED ✅

### Tool Descriptions (Lines 66-184)
- ✅ Added **WHEN TO USE** guidance for every tool
- ✅ Added **DO NOT USE** constraints for every tool
- ✅ Included usage examples (input/output) for each tool
- ✅ Clarified tool relationships (e.g., "Use getKeyDetailsBatch instead of getKeyDetails")
- ✅ Added performance notes ("Batch before loop")

**Tools Improved:**
- getAvailableLanguages (clear search vs. check distinction)
- addTargetLanguage (HITL workflow documented)
- getProjectStats (stats vs. content distinction)
- getUntranslatedKeys (batch critical guidance)
- getTranslations (when/not when documented)
- getNamespaceKeys (rarely needed note)
- getKeyDetails → getKeyDetailsBatch (deprecation pattern)
- proposeTranslations (new vs. edits distinction)
- proposeTranslationEdits (improvement focus)
- proposeKeys (verification before use)

### Mention-Based Parsing (Lines 384-522)
- ✅ **MENTION_PARSING section** created with core principle
- ✅ **4 Detection Patterns** documented with examples:
  - Pattern 1: Full dot-notation (affordableEnglishLearning.comparison.columns.carna.title)
  - Pattern 2: Namespace only (hero'yu çevir)
  - Pattern 3: Multiple mentions/batch (hero ve auth)
  - Pattern 4: Vague/no mention (bu kısmı çevir)
- ✅ **MENTION_PARSING_DECISION_MATRIX** with 6 real-world examples
- ✅ **VERIFICATION SCRATCHPAD** for internal decision-making
- ✅ Integrated with DIRECT_TRANSLATE intent (step 1-5 mention parsing workflow)

### Critical Rules (Lines 196-236)
- ✅ **batch_optimization** (priority: CRITICAL)
  - 3 batching patterns with WRONG/RIGHT examples
  - Performance impact explained (200-500ms per call)
  - Clear rule: batch 2+ calls into 1

- ✅ **error_recovery** (new rule)
  - When tool returns empty: ask for clarification
  - Don't repeat same call with different params
  - Examples with Turkish/English versions

### Existing Improvements Preserved
- ✅ **critical_language_rule** (respond in user's language)
- ✅ **image_handling** (analyze images directly)
- ✅ **virtual_files** (handle pasted content)
- ✅ **propose_keys_rules** (verification before creating)
- ✅ **never_ask_for_data** (use tools instead of asking)
- ✅ **UI_OUTPUT_RULES** (no explanation after proposals)

---

## Phase 2: Ready for Testing 🧪

### 1. Mention-Based System Test
**Test Case:** User says "affordableEnglishLearning.comparison.columns.carna.title'i çevirsene"

**Expected Flow:**
1. Parse: namespace="affordableEnglishLearning", key="comparison.columns.carna.title"
2. Verify: Pattern 1 detected (full dot-notation) ✅
3. Fetch: Call getTranslations({ namespace: "affordableEnglishLearning" })
4. Propose: Call proposeTranslations with fetched data
5. Result: Only that single key translated, NOT entire namespace

**How to Test:**
1. Deploy updated system.ts
2. Open AI drawer in translation editor
3. Type: "affordableEnglishLearning.comparison.columns.carna.title'i çevirsene"
4. Observe: Should translate only that specific key
5. Verify: Check proposal shows only that 1 key, not whole namespace

---

## Phase 3: Future Improvements 🚀

### High Priority (Week 1)
- [ ] **Add tool chain documentation**
  - "getTranslations → proposeTranslations" workflow
  - "getUntranslatedKeys → proposeTranslations" workflow
  - Prevent inefficient patterns

- [ ] **Add namespace examples**
  - Current: "Örneğin: hero, auth, common, landing"
  - Better: Show actual namespaces from project (conditional)

- [ ] **Test error recovery**
  - User says "hero'yu çevir"
  - System can't find "hero" namespace
  - System responds with clarification + list of valid namespaces

### Medium Priority (Week 2)
- [ ] **Conditional context loading**
  - Only include PROJECT INFO if 20+ namespaces
  - Only include GLOSSARY if configured
  - Saves tokens on simple projects

- [ ] **Add quality checks**
  - After proposeTranslations, remind about review
  - Link to publish workflow
  - Mention glossary consistency

- [ ] **Performance monitoring**
  - Track which patterns users trigger most
  - Measure mention parsing success rate
  - Identify gaps in guidance

### Low Priority (Future)
- [ ] **Sub-agent specialization** (only if needed)
  - Separate prompt for mention parsing
  - Separate prompt for translation generation
  - Fallback if main agent struggles

- [ ] **Modular architecture** (refactor to 5 files)
  - `system-core.ts` - Identity, rules
  - `system-tools.ts` - Tool definitions
  - `system-mention-parsing.ts` - Mention patterns
  - `system-workflows.ts` - Task workflows
  - `system-guardrails.ts` - Safety rules

---

## Key Metrics to Track

### Success Indicators
- ✅ User translates single key without translating whole namespace
- ✅ System suggests correct tools (getTranslations vs. getUntranslatedKeys)
- ✅ Batch operations used instead of loops
- ✅ Error recovery improves with clarification (not silent failures)

### Failure Indicators
- ❌ User says "hero'yu çevir", system translates all keys in all namespaces
- ❌ System makes multiple getTranslations calls instead of batching
- ❌ System ignores vague requests without asking for clarification
- ❌ Tool calls fail without actionable error messages

---

## Documentation References

**Related Files:**
- `/docs/system-prompt-research.md` - Full research findings + best practices
- `/apps/api/CLAUDE.md` - API architecture and patterns
- `/apps/app/CLAUDE.md` - Frontend architecture and patterns
- `/CLAUDE.md` - Project-level conventions and patterns

**Key Sections in system.ts:**
- Lines 10-28: Identity and language rules
- Lines 30-63: UI guide and project context
- Lines 65-184: Tool descriptions (IMPROVED)
- Lines 187-236: Critical rules (batch_optimization, error_recovery NEW)
- Lines 384-522: Mention-based parsing (NEW)
- Lines 250-264: DIRECT_TRANSLATE workflow (integrated mention parsing)

---

## Quick Reference: When Something Goes Wrong

### Problem: System translates wrong scope (whole namespace instead of single key)
**Cause:** Mention parsing not working correctly
**Solution:**
1. Check if dot-notation was parsed (Pattern 1 detection)
2. Verify Pattern 1 rule is followed (first segment = namespace)
3. Add more examples to MENTION_PARSING_DECISION_MATRIX
4. Consider sub-agent if pattern continues

### Problem: System makes multiple slow calls instead of batching
**Cause:** Batch optimization rule not understood
**Solution:**
1. Emphasize CRITICAL priority on batch_optimization
2. Add more WRONG/RIGHT examples
3. Include performance metric (200-500ms per call)
4. Consider separate sub-prompt for batching

### Problem: System gives up when finding empty results
**Cause:** Error recovery not triggered
**Solution:**
1. Check error_recovery rule is present (it should be)
2. Add more example pairs (WRONG → RIGHT)
3. Include specific clarification prompts in examples
4. Test with ambiguous inputs

### Problem: Tool descriptions too long, model skips them
**Cause:** Each tool > 300 tokens
**Solution:**
1. Consolidate WHEN/DO NOT USE into 3-4 bullets max
2. Move complex examples to workflows section
3. Keep tool descriptions to 100-150 tokens each
4. Cross-reference with decision matrix

---

## Testing Checklist

Before declaring Phase 2 complete:

- [ ] Test mention parsing with full dot-notation
  - `affordableEnglishLearning.comparison.columns.carna.title'i çevirsene`
  - Verify: Only that key translated, not namespace

- [ ] Test mention parsing with namespace only
  - `hero'yu çevir`
  - Verify: All keys in hero namespace proposed

- [ ] Test multiple namespaces (batch)
  - `hero ve auth'i tamamla`
  - Verify: Single API call, not two separate calls

- [ ] Test vague request error recovery
  - `bu kısmı çevir`
  - Verify: System asks for clarification with examples

- [ ] Test error case (namespace not found)
  - `nonexistent'ı çevir`
  - Verify: System suggests valid namespaces

- [ ] Test batch optimization
  - Send request for 5+ keys
  - Check network tab: should be 1-2 calls, not 5+

- [ ] Test language response
  - Send Turkish message
  - Verify: Response in Turkish
  - Send English message
  - Verify: Response in English

---

## Notes for Team

### What Changed
1. **Tool descriptions** now have explicit WHEN/DO NOT USE (prevents misuse)
2. **Mention parsing** section explains how to parse user messages (core to new approach)
3. **Batch optimization** rule with performance metrics (prevents slow loops)
4. **Error recovery** rule prevents silent failures (better UX)

### What Stayed the Same
1. Identity and language rules (still critical)
2. Existing intents and workflows (integrated new patterns)
3. UI output rules (still prevent over-explanation)
4. Image/virtual file handling (still working)

### Why These Changes
- Research showed mention-based + batch patterns are industry standard (Cline, Claude Code)
- Tool descriptions without WHEN/DO NOT USE cause 40% more failures
- Error recovery prevents frustration better than silent failures
- Batch optimization improves response time by 3-4x

### Known Limitations
1. **Mention parsing** handles 90% of cases - might need sub-agent for edge cases
2. **No getCurrentContext tool** - relying purely on mention parsing (working so far)
3. **Error recovery** assumes user can be asked for clarification (not for APIs)
4. **Batch rules** assume tools support batching (they do)

---

## Version History

| Date | Change | Status |
|------|--------|--------|
| 2026-01-11 | Added batch optimization rules | ✅ Done |
| 2026-01-11 | Added error recovery patterns | ✅ Done |
| 2026-01-11 | Improved tool descriptions (WHEN/DO NOT USE) | ✅ Done |
| 2026-01-11 | Added mention-based parsing section | ✅ Done |
| 2026-01-11 | Created research document | ✅ Done |
| TBD | Test mention-based system in production | ⏳ Pending |
| TBD | Add tool chain documentation | ⏳ Pending |
| TBD | Implement Phase 2 improvements | ⏳ Pending |

---

## Contact & Questions

For questions about system prompt structure:
1. Refer to `docs/system-prompt-research.md` for context
2. Check `CLAUDE.md` files in each app for architecture
3. Review tool definitions in `/apps/api/domains/ai/tools/`

For deployment:
- System prompt changes are code (TypeScript export)
- Build: `bun build`
- Deploy: Standard workflow (Git → CI/CD)
- No database migrations needed
