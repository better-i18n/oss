# System Prompt Architecture Research & Findings

**Date:** January 2026
**Research Source:** Claude Code, Cline, Bolt.new, Agentic AI Design Patterns
**Purpose:** Improve Better-i18n AI system prompt based on production best practices

---

## Executive Summary

Top AI agent systems (Claude Code, Cline, Bolt.new) follow a **modular, tool-centric, example-driven architecture** rather than monolithic prompts. The key to effective agentic prompts is **explicit tool documentation with "when to use" guidance, hierarchical agent structure, and clear examples over generic instructions.**

---

## Key Architectural Patterns from Leading Systems

### 1. MODULAR ARCHITECTURE (NOT MONOLITHIC)

**Claude Code Pattern:**
- Single main system prompt (2,852 tokens)
- 20+ individual tool descriptions (separate instruction sets)
- 3-4 sub-agent prompts (Explore, Plan, Task modes)
- Utility prompts (summarization, session management)
- **Total:** ~40+ distinct strings composed dynamically

**Benefit:**
- Easy to maintain and version-control each component
- Can activate/deactivate sections based on context
- Tool changes don't require updating entire prompt

**Better-i18n Application:**
Currently we have one monolithic system.ts. We could refactor to:
- `system-core.ts` - Main behavioral directives (1500-2000 tokens)
- `system-tools.ts` - Tool descriptions (one per tool, ~100-200 tokens each)
- `system-mention-parsing.ts` - Mention detection patterns
- `system-workflows.ts` - Task-specific workflows (DIRECT_TRANSLATE, etc.)

### 2. TOOL-CENTRIC DESIGN

**Industry Standard:**
Each tool needs:
1. **Clear description of what it does** (1-2 sentences)
2. **Explicit "WHEN TO USE" guidance** (concrete examples)
3. **"WHEN NOT TO USE" constraints** (prevent misuse)
4. **Usage examples** (show exact format and parameters)
5. **Common patterns** (batch operations, error handling)

**Current Better-i18n Status:**
✅ We improved this in the latest refactor - each tool now has WHEN/DO NOT USE
✅ Added usage examples for each tool
❌ Could add more complex pattern examples (batch fetching, error recovery)

**What to add:**
- Multi-tool workflows (e.g., "getTranslations THEN proposeTranslations")
- Error recovery patterns
- Performance considerations (why batch > loop)

### 3. HIERARCHICAL AGENT STRUCTURE

**Claude Code Model:**
```
Main Agent (decision-maker)
├── Explore Sub-Agent (516 tokens)
│   └── Focus: Find and understand code patterns
├── Plan Sub-Agent (633 tokens)
│   └── Focus: Design implementation approach
├── Task Sub-Agent
│   └── Focus: Execute specific implementation
```

**Better-i18n Current State:**
Currently single-mode (translate/fill/improve)
Could benefit from:
- **Mode Detection Agent:** Analyzes user intent (plan vs. act mode)
- **Mention Parsing Agent:** Specialized in extracting namespace/key mentions
- **Translation Agent:** Focuses on generation and quality
- **Review Agent:** Checks for quality issues

**Implementation Approach:**
Different system prompts per intent level, not just one prompt handling everything.

### 4. EXPLICIT "WHEN TO USE" MATRICES

**Pattern from Cline/Claude Code:**
```
Tool: getTranslations
WHEN TO USE:
- User asks "show translations" + namespace is mentioned
- User wants to review before proposing edits
- You need current values before proposing changes
- User says "translations are broken in [namespace]"

WHEN NOT TO USE:
- Just for getting statistics → use getProjectStats
- User wants missing keys → use getUntranslatedKeys
- Single key details → already have from context
- No mention in message → ask for clarification first
```

**Our Implementation:**
We added this in the mention parsing section - good pattern, but could expand with more examples.

### 5. CONDITIONAL CONTEXT LOADING

**Claude Code Approach:**
- Git status embedded conditionally (only if repo context exists)
- Environment variables activate different behavior paths
- User preferences control sub-agent availability
- CLAUDE.md file auto-detected and included when present

**Better-i18n Application:**
Could conditionally include:
- **PROJECT INFO** section (namespace list, languages) - vary based on project size
- **BRAND CONTEXT** section - only if configured
- **GLOSSARY** - only if project has one
- **AI CONTEXT** - only if user configured brand voice

Benefits:
- Smaller token usage for simpler projects
- More relevant guidance for complex projects
- Faster response times (less prompt to parse)

---

## Key Success Factors

### 1. Specificity Over Generality

**Bad:** "Generate translations"
**Good:** "Translate affordableEnglishLearning.comparison.columns.carna.title to Turkish. Parse the full key name from the mention format. If the full sourceText is missing, first call getTranslations to fetch it. Then immediately call proposeTranslations in compact format."

**Why:** Specific instructions reduce ambiguity and token usage.

### 2. Examples Over Description

**Bad:** "Parse mentions in dot-notation format"
**Good:** "Parse mentions like affordableEnglishLearning.comparison.columns.carna.title'i çevirsene → namespace='affordableEnglishLearning' key='comparison.columns.carna.title'"

**Why:** Examples stick better than descriptions, reduce interpretation.

### 3. Prevention > Detection

**Bad:** "Don't call the tool incorrectly"
**Good:** "NEVER call getKeyDetails - use getKeyDetailsBatch even for single keys. Why: Batching handles edge cases automatically."

**Why:** Explains the WHY, prevents mistakes at source.

### 4. Decision Matrices > Paragraphs

**Bad:** Long paragraph explaining when to use getTranslations
**Good:** Table with clear yes/no rows

**Why:** Faster parsing, easier to scan, models pick up patterns faster.

### 5. Tool Chains > Individual Tools

**Bad:** Document each tool separately
**Good:** Show "Tool A → Tool B → Tool C" workflow

**Why:** Models understand the intended sequence, make better decisions about batching.

---

## Common Mistakes to Avoid

### 1. Too Much Context Per Tool
**Problem:** 10+ bullet points per tool → model skips sections
**Solution:** 3-4 key points max, elaborate only for complex tools

### 2. Vague "When to Use"
**Problem:** "Use when user asks about keys"
**Solution:** "Use when user mentions specific namespace + action (e.g., 'hero'yu çevir')"

### 3. Missing Negative Examples
**Problem:** Only showing what to do
**Solution:** Show what NOT to do (e.g., "NEVER loop getKeyDetails - use batch version")

### 4. Tool Descriptions Too Long
**Problem:** Single tool description > 500 tokens
**Solution:** Move complex examples to workflows section

### 5. No Performance Guidance
**Problem:** Model doesn't know which approach is better
**Solution:** Explicitly state "Batching is 3x faster: getTranslations(namespaces: [...]) NOT loop of getTranslations calls"

---

## Recommended Refactoring for Better-i18n

### Phase 1: Immediate Improvements (Quick wins)
✅ **Already Done:**
- Tool descriptions with WHEN/DO NOT USE sections
- Decision matrix for mention types
- Workflow examples

⏳ **Next:**
1. Add performance notes to each tool ("Batch before loop")
2. Add error recovery patterns ("If tool returns empty, ask user for clarification")
3. Add tool chain examples ("getTranslations → proposeTranslations workflow")

### Phase 2: Structural Refactoring (Modular architecture)
Separate system.ts into:
- `system-core.ts` - Identity, rules, critical guidance
- `system-tools.ts` - All tool definitions (could auto-generate)
- `system-mention-parsing.ts` - Detection patterns + decision matrix
- `system-workflows.ts` - Task workflows (DIRECT_TRANSLATE, IMPROVE, STATUS)
- `system-guardrails.ts` - Safety rules, error handling

Benefits:
- Tool changes isolated from core logic
- Easier to add new tools (just create new file)
- Sub-prompts can reference each other
- Easier to version and test

### Phase 3: Sub-Agent Specialization (Optional, if needed)
Create separate prompts for:
- Intent detection ("What does user want?")
- Mention parsing ("Extract namespace/key from message")
- Translation generation ("Generate translations")
- Quality review ("Check for issues")

Only implement if mention-based system needs fallback logic.

---

## Implementation Priority

### 1. HIGH PRIORITY (Do Now)
- ✅ Mention parsing matrix (done)
- ✅ Tool WHEN/DO NOT USE (done)
- Add batch performance guidance to tools
- Add error recovery patterns

### 2. MEDIUM PRIORITY (Week 1)
- Tool chain documentation ("fetch → propose" workflows)
- Conditional context loading (PROJECT INFO varies by size)
- Add more complex usage examples

### 3. LOW PRIORITY (Future)
- Modular architecture refactoring (system.ts → multiple files)
- Sub-agent specialization (if mention-based approach has issues)
- Automated tool description generation

---

## Lessons Applied to Better-i18n

### ✅ What We Got Right
1. **Tool-centric design** - Each tool has explicit guidance
2. **Mention-based context** - Uses message parsing, not UI state
3. **Decision matrices** - Clear yes/no examples for mention types
4. **Workflow documentation** - Shows DIRECT_TRANSLATE steps
5. **Prevention over correction** - "NEVER call getKeyDetails" preventive guidance

### 🔄 What to Improve
1. **More examples** - Add concrete input/output pairs for each tool
2. **Batch patterns** - Emphasize "getTranslations(namespaces: [...])" over loops
3. **Error recovery** - "If empty result, ask user for clarification with examples"
4. **Tool chains** - "Always fetch before propose" pattern documented
5. **Conditional sections** - Vary prompt based on project complexity

### 🚀 What to Consider Later
1. **Sub-agent prompts** - Separate prompt for mention detection if needed
2. **Modular architecture** - Split system.ts into multiple files
3. **Performance telemetry** - Track which patterns work best
4. **User feedback loop** - A/B test different prompt versions

---

## Research Sources

- [Claude Code System Prompts Repository](https://github.com/Piebald-AI/claude-code-system-prompts)
- [Anthropic: Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Agentic AI Design Patterns 2025](https://valanor.co/design-patterns-for-ai-agents/)
- [OpenAI Prompt Engineering Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [Awesome AI System Prompts (Cline, Claude Code, v0)](https://github.com/dontriskit/awesome-ai-system-prompts)

---

## Next Steps

1. **Review this analysis** with team
2. **Implement Phase 1 improvements** (batch patterns, error recovery)
3. **Test mention-based system** with sample: "affordableEnglishLearning.comparison.columns.carna.title'i çevirsene"
4. **Monitor performance** - track which patterns work best
5. **Decide on sub-agents** - implement if mention parsing needs fallback
