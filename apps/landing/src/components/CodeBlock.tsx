import type { ReactNode } from "react";

/**
 * Code highlighting for the marketing site — synchronous, zero-dependency, ~1 KB.
 *
 * WHY NOT SHIKI / PRISM
 * TanStack hit this exact wall on tanstack.com, which runs the same stack we do
 * (TanStack Start, SSG, CWV budget): a docs page was transferring ~1.1 MiB of
 * script, "with roughly 358 KiB tied to syntax highlighting alone. Shiki, its
 * WASM and runtime pieces, themes, language chunks, and our Markdown pipeline
 * had quietly turned reading a page into downloading a small publishing system."
 * Their answer was to build a narrow highlighter instead of shipping a general
 * one: `@tanstack/highlight`, whose core is 1.7 KB gzipped, 3.9 KB with TSX,
 * ~8 KB with all 25 languages, synchronous, shared between SSR and the browser,
 * with "tokens [that] carry stable semantic classes instead of theme colors" and
 * unknown languages falling back to escaped plaintext.
 *   Source: TanStack/tanstack.com — src/blog/introducing-tanstack-markdown-and-highlight.md,
 *   src/components/landing/HighlightLanding.tsx:28,101,157, package.json
 *   ("@tanstack/highlight": "^0.0.9").
 *
 * We follow that contract but do not add the dependency (installing one would
 * mutate the lockfile that concurrent sessions share). The scope here is far
 * smaller than a docs site's: a few dozen hand-authored snippets in four
 * languages, all rendered at build time by SSG. A ~90-line tokenizer covers it,
 * ships nothing extra to the browser, and cannot desync from a grammar package.
 * If the snippet set ever grows into real docs, `@tanstack/highlight` is the
 * upgrade path and this file's `Token` shape matches its idea of the job.
 *
 * COLOUR
 * Three hues, taken from the pillar palette, plus grey for everything else:
 * keyword violet-700 (PILLAR_META.ai), string green-700 (sync), number
 * orange-700 (content), comment mist-400, punctuation mist-300, plain mist-700.
 *
 * This is a deliberate exception to rule/neutral-ink-accent-is-identity-only, and
 * it fits the rule's own reasoning. That rule exists because colour was being used
 * as decoration — "carrying no information". In a code block the opposite is true:
 * hue IS the information, it is what separates a string from an identifier at a
 * glance. An all-grey snippet is not restrained, it is unhighlighted — measured on
 * /en/i18n/nextjs/, 56 of 72 tokens in one block rendered mist-300, which reads as
 * plain text with noise.
 *
 * Constraints that keep it from becoming a rainbow theme: only three hues, all
 * already in the design system (no new tokens), the 700 step so 12px text stays
 * AA on white, and comments/punctuation/plain stay grey so the colour marks
 * meaning rather than every second character.
 *
 * An unknown language renders as plain escaped text rather than guessing, so a
 * wrong `lang` can never mangle a customer-facing snippet.
 */

type TokenKind = "keyword" | "string" | "comment" | "number" | "punctuation" | "plain";

type Token = { kind: TokenKind; value: string };

export type CodeLang = "tsx" | "ts" | "js" | "json" | "bash" | "text";

const TOKEN_INK: Record<TokenKind, string> = {
  keyword: "text-violet-700",
  string: "text-green-700",
  number: "text-orange-700",
  comment: "text-mist-400",
  punctuation: "text-mist-300",
  plain: "text-mist-700",
};

/* Keywords per family. Kept deliberately short: these are marketing snippets,
   not an editor, so a missed keyword costs nothing and a wrong one is noise. */
const JS_KEYWORDS = new Set([
  "import", "from", "export", "default", "const", "let", "var", "function",
  "return", "await", "async", "new", "class", "extends", "if", "else", "for",
  "of", "in", "while", "try", "catch", "finally", "throw", "typeof", "as",
  "type", "interface", "satisfies", "true", "false", "null", "undefined",
  "void", "this", "super", "yield", "delete", "instanceof",
]);

const SHELL_KEYWORDS = new Set([
  "npm", "npx", "bun", "bunx", "pnpm", "yarn", "cd", "git", "curl", "echo",
  "export", "sudo", "run", "add", "install", "dev", "build", "better-i18n",
]);

/**
 * One regex per family, alternation ordered so the greediest, least ambiguous
 * rule wins first (comment → string → number → word → punctuation). Every
 * branch is capture-free so `match[0]` is always the whole token.
 */
const PATTERNS: Record<Exclude<CodeLang, "text">, RegExp> = {
  tsx: /\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d[\d_.]*\b|[A-Za-z_$][\w$]*|[^\sA-Za-z0-9_$]/g,
  ts: /\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d[\d_.]*\b|[A-Za-z_$][\w$]*|[^\sA-Za-z0-9_$]/g,
  js: /\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d[\d_.]*\b|[A-Za-z_$][\w$]*|[^\sA-Za-z0-9_$]/g,
  json: /"(?:\\.|[^"\\])*"|\b-?\d[\d.eE+-]*\b|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g,
  bash: /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d[\d_.]*\b|[A-Za-z_][\w.-]*|[^\sA-Za-z0-9_]/g,
};

function classify(lang: Exclude<CodeLang, "text">, raw: string): TokenKind {
  const first = raw[0] ?? "";
  if (lang === "json") {
    if (first === '"') return "string";
    if (raw === "true" || raw === "false" || raw === "null") return "keyword";
    if (/^-?\d/.test(raw)) return "number";
    return "punctuation";
  }
  if (lang === "bash") {
    if (first === "#") return "comment";
    if (first === '"' || first === "'") return "string";
    if (/^\d/.test(raw)) return "number";
    if (SHELL_KEYWORDS.has(raw)) return "keyword";
    if (first === "-") return "punctuation";
    return /^[A-Za-z_]/.test(raw) ? "plain" : "punctuation";
  }
  if (raw.startsWith("//") || raw.startsWith("/*")) return "comment";
  if (first === "`" || first === '"' || first === "'") return "string";
  if (/^\d/.test(raw)) return "number";
  if (JS_KEYWORDS.has(raw)) return "keyword";
  return /^[A-Za-z_$]/.test(raw) ? "plain" : "punctuation";
}

/** Split source into tokens. Unmatched spans (whitespace, unknown) stay plain. */
export function tokenize(code: string, lang: CodeLang): Token[] {
  if (lang === "text") return [{ kind: "plain", value: code }];
  const pattern = PATTERNS[lang];
  pattern.lastIndex = 0;
  const tokens: Token[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(code)) !== null) {
    if (match.index > cursor) {
      tokens.push({ kind: "plain", value: code.slice(cursor, match.index) });
    }
    tokens.push({ kind: classify(lang, match[0]), value: match[0] });
    cursor = match.index + match[0].length;
  }
  if (cursor < code.length) {
    tokens.push({ kind: "plain", value: code.slice(cursor) });
  }
  return tokens;
}

/**
 * The highlighted source only — no shell. Use this inside a figure that already
 * has its own frame (a bespoke visual with a filename header and a result
 * footer, for instance).
 */
export function HighlightedCode({
  code,
  lang = "tsx",
  className,
}: {
  code: string;
  lang?: CodeLang;
  className?: string;
}) {
  const tokens = tokenize(code, lang);
  return (
    <pre
      className={
        className ??
        "overflow-x-auto px-4 py-3 font-mono text-[12px] leading-[1.7] text-mist-700"
      }
    >
      <code>
        {tokens.map((token, i) => {
          if (token.kind === "plain") {
            // Whitespace and identifiers inherit the block's ink — one <span>
            // fewer per token keeps the SSG payload small on long snippets.
            return token.value;
          }
          return (
            // Index is a legitimate key here: the token list is derived from an
            // immutable string, so it never reorders, filters or receives input.
            <span key={`${token.kind}-${i}`} className={TOKEN_INK[token.kind]}>
              {token.value}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

/**
 * Full code figure: the standard hairline shell, an optional filename header,
 * the highlighted source, and an optional footer (a result line, a note).
 * A figure is a single object, so it keeps its own border and radius —
 * rule/interior-hairlines-only, figure exception.
 */
export function CodeBlock({
  code,
  lang = "tsx",
  filename,
  meta,
  footer,
}: {
  code: string;
  lang?: CodeLang;
  /** Shown left in the header, in mono — a path, not prose. */
  filename?: string;
  /** Shown right in the header, e.g. a language or a size. */
  meta?: string;
  footer?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      {(filename || meta) && (
        <div className="flex items-center gap-2 border-b border-black/[0.05] px-4 py-2.5">
          {filename && (
            <span className="min-w-0 truncate font-mono text-[11px] text-mist-500">
              {filename}
            </span>
          )}
          {meta && <span className="ml-auto text-[11px] text-mist-400">{meta}</span>}
        </div>
      )}
      <HighlightedCode code={code} lang={lang} />
      {footer && (
        <div className="border-t border-black/[0.05] bg-black/[0.015] px-4 py-3">{footer}</div>
      )}
    </div>
  );
}
