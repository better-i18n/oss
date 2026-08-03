/**
 * Static i18n key gate — the check that turns "Title" / "Description" on screen
 * from something we *notice* into something CI *refuses*.
 *
 * Why static and not a browser run: CI has no Playwright/Puppeteer, and adding a
 * headless browser to every pull request buys a slower gate that fails for
 * reasons unrelated to i18n. Every failure class we actually shipped this year
 * is visible in source + CDN alone:
 *
 *   A. the key does not exist on the CDN at all  → `useT` humanises it and the
 *      raw last segment ("Title", "Answer") is what the user reads.
 *   B. the key exists, but the page never loads its namespace → same screen,
 *      different cause. `getNamespacesForPage()` decides that, so this script
 *      imports the app's own resolver instead of restating it.
 *
 * Two deliberate non-goals:
 *   - Translation COVERAGE is not checked. A key present in `en` but missing in
 *     `tr` renders the English source, not a placeholder — gating on it would
 *     fail every pull request that adds a string, which is how a gate gets
 *     switched off. Source language is the placeholder boundary.
 *   - Punctuation, casing and sentence shape are not checked. The previous H1
 *     rule fired on Thai, Lao, Khmer and Burmese, which do not end sentences
 *     with a full stop; a check that cries wolf on four languages is worse than
 *     no check. (Kept in NO_TERMINAL_PUNCTUATION below so the next person who
 *     reaches for punctuation inherits the exception rather than the bug.)
 *
 * Anything this script cannot resolve is REPORTED as uncovered, never skipped
 * silently — an unreadable call site is a hole in the gate and has to be named.
 *
 * Usage:  bun run audit:keys        (exit 1 on any missing key)
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { getCdnNamespacesForPage } from "../../src/lib/page-namespaces";

const ROOT = resolve(new URL(".", import.meta.url).pathname, "../..");
const SRC = join(ROOT, "src");
const ROUTES = join(SRC, "routes/$locale");
const PROJECT = "better-i18n/landing";
const CDN = "https://cdn.better-i18n.com";

/**
 * Scripts with no sentence-final punctuation. Any future rule that inspects the
 * end of a string must exempt these, or it reports every healthy Thai string as
 * broken — that is exactly what happened to the H1 check.
 */
export const NO_TERMINAL_PUNCTUATION = new Set(["th", "lo", "km", "my"]);

/* ─── source scan ──────────────────────────────────────────────────── */

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name === "_archived") continue;
      walk(p, out);
    } else if (/\.(tsx|ts)$/.test(name) && !/\.(test|spec)\.tsx?$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

interface Usage {
  ns: string;
  key: string;
  file: string;
  line: number;
}
interface Dynamic {
  ns: string;
  /** Static head of a template literal, e.g. "detail.faq." */
  prefix: string;
  /** Static tail, e.g. ".question" */
  suffix: string;
  file: string;
  line: number;
}
interface Uncovered {
  file: string;
  line: number;
  reason: string;
  snippet: string;
}

const lineOf = (src: string, index: number) =>
  src.slice(0, index).split("\n").length;

/**
 * Bind translator variables to their namespace, then read the calls made on
 * them. Both hooks are handled: `useT` (our wrapper) and `useTranslations`
 * (use-intl directly) — PersonaFlows uses the second one, so a scanner that
 * only knew the first would have missed all 78 keys of the outage this gate
 * exists to prevent.
 */
/**
 * Blank out the inside of multi-line template literals, keeping every offset
 * and newline so reported line numbers stay true.
 *
 * These pages TEACH i18n, so they render example code — `for-developers.tsx`
 * ships a `<HighlightedCode>` block containing `const t = useT('common')` and
 * `t('welcome')`. That is documentation, not a call site, and scanning it
 * produced a whole page of phantom missing keys. Real key arguments are always
 * single-line, so "spans a newline" separates sample from code exactly.
 */
function maskCodeSamples(src: string): string {
  const out = src.split("");
  let i = 0;
  while (i < out.length) {
    if (src[i] === "`" && src[i - 1] !== "\\") {
      let j = i + 1;
      while (j < src.length && !(src[j] === "`" && src[j - 1] !== "\\")) j++;
      const body = src.slice(i + 1, j);
      if (body.includes("\n")) {
        for (let k = i + 1; k < j; k++) if (out[k] !== "\n") out[k] = " ";
      }
      i = j + 1;
      continue;
    }
    i++;
  }
  return out.join("");
}

function scanFile(file: string, usages: Usage[], dynamics: Dynamic[], uncovered: Uncovered[]) {
  const src = maskCodeSamples(readFileSync(file, "utf8"));
  const rel = relative(ROOT, file);

  /**
   * Bindings are collected WITH their source offset, because a file routinely
   * binds the same name in several components:
   *
   *     function Hero()  { const t = useTranslations("marketing.whatIsPage"); … }
   *     function Table() { const t = useTranslations("marketing");            … }
   *
   * A file-level `name → namespace` map lets the last binding win and resolves
   * `t("hero.title")` in the first component against the second component's
   * namespace — which reported 147 healthy keys as missing on the first run.
   * Each call is therefore matched to the NEAREST PRECEDING binding of its own
   * name, which is what lexical scope means for every call site in this repo.
   */
  interface Bind {
    name: string;
    /** null when the namespace is not a literal — unreadable from source. */
    ns: string | null;
    at: number;
  }
  const binds: Bind[] = [];
  const bindRe =
    /(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:useT|useTranslations)\s*\(\s*(?:(["'`])([^"'`]+)\2)?/g;
  for (const m of src.matchAll(bindRe)) {
    binds.push({ name: m[1], ns: m[3] ?? null, at: m.index! });
    if (!m[3]) {
      uncovered.push({
        file: rel,
        line: lineOf(src, m.index!),
        reason: "namespace is not a string literal",
        snippet: src.slice(m.index!, m.index! + 60).split("\n")[0],
      });
    }
  }

  if (binds.length === 0) return;
  const names = [...new Set(binds.map((b) => b.name))]
    .sort((a, b) => b.length - a.length)
    .join("|");

  /** Nearest preceding binding of `name`, or null when the call precedes all. */
  const nsAt = (name: string, at: number): string | null | undefined => {
    let best: Bind | undefined;
    for (const b of binds) {
      if (b.name === name && b.at < at && (!best || b.at > best.at)) best = b;
    }
    return best ? best.ns : undefined;
  };

  // t("key") / t.has("key") / t.rich("key")
  const callRe = new RegExp(
    `\\b(${names})(?:\\.(?:has|rich))?\\s*\\(\\s*(["'\`])([^"'\`$]+)\\2`,
    "g",
  );
  for (const m of src.matchAll(callRe)) {
    const ns = nsAt(m[1], m.index!);
    if (ns === undefined) continue; // not a translator call — a same-named local
    if (ns === null) continue; // dynamic namespace, already reported as uncovered
    usages.push({ ns, key: m[3], file: rel, line: lineOf(src, m.index!) });
  }

  // t(`a.${x}.b`) — a key FAMILY. The static parts still constrain it.
  const tplRe = new RegExp(`\\b(${names})(?:\\.(?:has|rich))?\\s*\\(\\s*\`([^\`]*\\$\\{[^\`]*)\``, "g");
  for (const m of src.matchAll(tplRe)) {
    const ns = nsAt(m[1], m.index!);
    if (ns === undefined || ns === null) continue;
    const tpl = m[2];
    const prefix = tpl.slice(0, tpl.indexOf("${"));
    const afterLast = tpl.slice(tpl.lastIndexOf("}") + 1);
    if (!prefix && !afterLast) {
      uncovered.push({
        file: rel,
        line: lineOf(src, m.index!),
        reason: "template key has no static part",
        snippet: "`" + tpl + "`",
      });
      continue;
    }
    dynamics.push({
      ns,
      prefix,
      suffix: afterLast,
      file: rel,
      line: lineOf(src, m.index!),
    });
  }

  // t(variable) / t(item.key) — the key lives in data we cannot follow.
  const varRe = new RegExp(`\\b(${names})(?:\\.(?:has|rich))?\\s*\\(\\s*([A-Za-z_$][\\w$.\\[\\]]*)\\s*[,)]`, "g");
  for (const m of src.matchAll(varRe)) {
    if (nsAt(m[1], m.index!) === undefined) continue;
    uncovered.push({
      file: rel,
      line: lineOf(src, m.index!),
      reason: "key is a variable, not a literal",
      snippet: `${m[1]}(${m[2]})`,
    });
  }
}

/* ─── CDN ──────────────────────────────────────────────────────────── */

/** CDN stores nested objects (`kf: "nested"`); flatten to dot paths. */
function flatten(obj: unknown, prefix = "", out = new Set<string>()): Set<string> {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, path, out);
      else out.add(path);
    }
  }
  return out;
}

const cache = new Map<string, Set<string>>();
async function cdnKeys(locale: string, ns: string): Promise<Set<string>> {
  const id = `${locale}/${ns}`;
  const hit = cache.get(id);
  if (hit) return hit;
  // "default" is served as translations.json (documented in getProject's cdn field).
  const file = ns === "default" ? "translations" : ns;
  const res = await fetch(`${CDN}/${PROJECT}/${locale}/${file}.json`);
  const json = res.ok ? await res.json() : {};
  const set = flatten(json);
  cache.set(id, set);
  return set;
}

/* ─── namespace-loading check ──────────────────────────────────────── */

/** Route file → the pathname it serves, so the app's own resolver can be asked. */
function routePagePath(file: string): string | null {
  let rel = relative(ROUTES, file).replace(/\.tsx?$/, "");
  if (rel.startsWith("..")) return null;
  if (rel === "index") return "";
  rel = rel.replace(/\/index$/, "");
  // A dynamic segment ($slug) resolves through the prefix rules, which only
  // read the static head of the path — a placeholder value is enough.
  return rel.replace(/\$(\w+)/g, "_$1");
}

/** Follow local `@/` imports so a route is judged on everything it renders. */
function importGraph(entry: string, seen = new Set<string>()): Set<string> {
  if (seen.has(entry)) return seen;
  seen.add(entry);
  let src: string;
  try {
    src = readFileSync(entry, "utf8");
  } catch {
    return seen;
  }
  for (const m of src.matchAll(/from\s+["']@\/([^"']+)["']/g)) {
    const base = join(SRC, m[1]);
    for (const cand of [`${base}.tsx`, `${base}.ts`, join(base, "index.tsx"), join(base, "index.ts")]) {
      try {
        if (statSync(cand).isFile()) {
          importGraph(cand, seen);
          break;
        }
      } catch {
        /* not this extension */
      }
    }
  }
  return seen;
}

/* ─── run ──────────────────────────────────────────────────────────── */

const files = walk(SRC);
const usages: Usage[] = [];
const dynamics: Dynamic[] = [];
const uncovered: Uncovered[] = [];
for (const f of files) scanFile(f, usages, dynamics, uncovered);

const namespaces = [...new Set([...usages, ...dynamics].map((u) => u.ns.split(".")[0]))];
await Promise.all(namespaces.map((ns) => cdnKeys("en", ns)));

/** A binding may be scoped ("marketing.whatIs"); the CDN file is its root. */
function resolveKey(ns: string, key: string) {
  const root = ns.split(".")[0];
  const scope = ns.slice(root.length + 1);
  return { root, full: scope ? `${scope}.${key}` : key };
}

const missing: Usage[] = [];
for (const u of usages) {
  const { root, full } = resolveKey(u.ns, u.key);
  if (!cache.get(`en/${root}`)!.has(full)) missing.push(u);
}

const emptyFamilies: Dynamic[] = [];
for (const d of dynamics) {
  const { root, full } = resolveKey(d.ns, d.prefix);
  const keys = cache.get(`en/${root}`)!;
  let found = false;
  for (const k of keys) {
    if (k.startsWith(full) && k.endsWith(d.suffix)) {
      found = true;
      break;
    }
  }
  if (!found) emptyFamilies.push(d);
}

/* Namespace actually reachable at runtime? */
interface NsGap {
  page: string;
  ns: string;
  usedIn: string;
}
const nsGaps: NsGap[] = [];
for (const file of files) {
  const pagePath = routePagePath(file);
  if (pagePath === null) continue;
  const loaded = getCdnNamespacesForPage(pagePath);
  if (!loaded) continue; // null = no filtering, every namespace is present
  const loadedSet = new Set(loaded);
  for (const dep of importGraph(file)) {
    const relDep = relative(ROOT, dep);
    for (const u of [...usages, ...dynamics]) {
      if (u.file !== relDep) continue;
      const root = u.ns.split(".")[0];
      if (!loadedSet.has(root)) {
        nsGaps.push({ page: `/${pagePath}`, ns: root, usedIn: relDep });
      }
    }
  }
}
const uniqGaps = [...new Map(nsGaps.map((g) => [`${g.page}|${g.ns}|${g.usedIn}`, g])).values()];

/* ─── report ───────────────────────────────────────────────────────── */

/**
 * Findings that already existed when the gate was introduced.
 *
 * They are REAL — each was confirmed absent from the CDN by hand — but a gate
 * that is red on the day it lands gets bypassed, and a bypassed gate protects
 * nothing. The baseline freezes today's debt and fails on anything NEW, which
 * is the behaviour that actually stops the next "Title" from shipping.
 *
 * Shrinking this file is the point; `bun run audit:keys --update-baseline`
 * rewrites it, so a fix removes its own entry and the count only goes down.
 */
const BASELINE_PATH = join(import.meta.dirname ?? ".", "check-keys.baseline.json");
const fingerprint = {
  missing: (m: Usage) => `key ${m.ns}.${m.key} (${m.file})`,
  family: (d: Dynamic) => `family ${d.ns}.${d.prefix}*${d.suffix} (${d.file})`,
  gap: (g: NsGap) => `ns ${g.ns} not loaded on ${g.page} (${g.usedIn})`,
};

const found = [
  ...missing.map(fingerprint.missing),
  ...emptyFamilies.map(fingerprint.family),
  ...uniqGaps.map(fingerprint.gap),
].sort();

if (process.argv.includes("--update-baseline")) {
  writeFileSync(BASELINE_PATH, `${JSON.stringify(found, null, 2)}\n`);
  console.log(`baseline updated: ${found.length} known finding(s)`);
  process.exit(0);
}

let baseline: string[] = [];
try {
  baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
} catch {
  /* no baseline yet — every finding is new */
}
const known = new Set(baseline);
const isNew = (f: string) => !known.has(f);
const fixed = baseline.filter((b) => !found.includes(b));

const p = console.log;
p(`i18n key gate — ${files.length} files, ${usages.length} literal keys, ` +
  `${dynamics.length} key families, ${namespaces.length} namespaces`);

const newMissing = missing.filter((m) => isNew(fingerprint.missing(m)));
const newFamilies = emptyFamilies.filter((d) => isNew(fingerprint.family(d)));
const newGaps = uniqGaps.filter((g) => isNew(fingerprint.gap(g)));

if (newMissing.length) {
  p(`\n✖ ${newMissing.length} NEW key(s) missing from the CDN (source language: en)`);
  for (const m of newMissing) p(`   ${m.file}:${m.line}  ${m.ns}.${m.key}`);
}
if (newFamilies.length) {
  p(`\n✖ ${newFamilies.length} NEW key family/families match nothing on the CDN`);
  for (const d of newFamilies) p(`   ${d.file}:${d.line}  ${d.ns}.${d.prefix}*${d.suffix}`);
}
if (newGaps.length) {
  p(`\n✖ ${newGaps.length} NEW namespace(s) used by a page that does not load them`);
  for (const g of newGaps) p(`   ${g.page}  needs "${g.ns}"  (used in ${g.usedIn})`);
}
if (known.size) {
  p(`\n· ${known.size} known finding(s) held in check-keys.baseline.json` +
    (fixed.length ? ` — ${fixed.length} now fixed, run with --update-baseline` : ""));
}
if (uncovered.length) {
  const byFile = new Map<string, number>();
  for (const u of uncovered) byFile.set(u.file, (byFile.get(u.file) ?? 0) + 1);
  p(`\n⚠ ${uncovered.length} call site(s) this gate cannot read (${byFile.size} files) —`);
  p(`  not failures, but not covered either. Listed so the hole is visible:`);
  for (const [f, n] of [...byFile].sort((a, b) => b[1] - a[1])) p(`   ${f}  ×${n}`);
}

const failures = newMissing.length + newFamilies.length + newGaps.length;
if (failures === 0) p(`\n✔ no new missing keys, no new unloaded namespaces`);
process.exit(failures === 0 ? 0 : 1);
