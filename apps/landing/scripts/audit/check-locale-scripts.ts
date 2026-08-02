/**
 * Locale script audit — finds strings published under the wrong language.
 *
 *   bun scripts/audit/check-locale-scripts.ts
 *   bun scripts/audit/check-locale-scripts.ts --limit 20   # more paths per locale
 *
 * ── Why a separate script and not part of run-audit.sh ──────────────
 * The page audit renders URLs in a real browser: it needs a dev server, it is
 * slow, and it only sees the strings a page happens to render. This defect
 * lives in the data, not in a page — Italian meta titles were Turkish, and no
 * rendered page would have told us, because the Italian page rendered exactly
 * what the CDN gave it. Reading the published JSON covers every key in every
 * locale, needs no browser, and finishes in seconds, so it belongs on its own.
 *
 * ── What it looks for ───────────────────────────────────────────────
 * Two signals, both deterministic:
 *
 * 1. **Foreign alphabet markers.** Letters that belong to exactly one language
 *    in our set. Turkish ı/İ/ğ/Ğ in an Italian file is not a judgement call: no
 *    Italian word contains them. This is the signal that caught the bug — 32
 *    strings across it/de/es/fr/ru/pl/ro, including customer quotes on five
 *    home pages and Italian meta titles.
 *
 * 2. **Wrong script.** A locale written in Cyrillic, Greek, Han, Kana, Hangul,
 *    Arabic, Hebrew, Devanagari or Thai must actually use it — but only for
 *    strings that were actually translated. A value identical to the English
 *    source is the CDN's untranslated fallback, which is a coverage number
 *    (~25% of every locale today), not a wrong-language bug: reporting those
 *    buried the real findings under 6,107 lines the first time this ran. Short
 *    strings are exempt too, because "API", "CDN" and "Better I18N" are correct
 *    in every locale.
 *
 * ── False positives, and why each exclusion exists ──────────────────
 * Whoever reads this next will be tempted to "fix" the excluded entries. Do not.
 *
 *  - **Person names** (`*.name`, `*.author`, `authors.*`): our team is Turkish.
 *    "Eray Gündoğmuş" is spelled that way in the Italian file because that is
 *    how the person's name is spelled.
 *  - **`features.ai.glossaryMatch` / `features.ai.targetLabel`**: the homepage AI
 *    demo shows a translation being produced INTO Turkish. The Turkish text is
 *    the demo's payload, not a mistranslation.
 *  - **Brand and product nouns** (Better I18N, GitHub, Next.js, …): stripped
 *    before the script check so a Japanese string that names a framework is not
 *    reported for containing Latin letters.
 *  - **Code-shaped values** (a path, a command, an identifier): same reason.
 *
 * Exit code is 1 when anything is found, so this can gate a deploy later; today
 * it is run by hand. Zero findings prints one line and nothing else.
 */

const CDN = "https://cdn.better-i18n.com/better-i18n/landing";

/**
 * Locales to probe beyond the manifest.
 *
 * Keep this list short and justified, because the CDN cannot tell you a locale
 * is missing: every path under the project answers 200 with `{}`, including
 * codes we have never shipped (`sv`, `da`, `zh-hant` all return an empty object).
 * So "the file exists" proves nothing and an empty result only means something
 * for a locale we know is configured in the project.
 *
 * `pt` is here because it is exactly that case: a project language with 1,681
 * translations in the platform whose CDN files are empty and which the manifest
 * does not list, so the site serves no Portuguese at all. Confirming this class
 * of bug needs the platform's language list; this probe is the cheap half.
 */
const EXTRA_LOCALE_PROBES = ["pt"];

/**
 * `fragment-h1` is the second defect class we hit: a heading that is a
 * sentence in English and half a sentence in twenty other languages.
 * `wrong-language` is the defect this script exists for: a string published
 * under a locale it is not written in. `orthography` is a real but softer
 * finding — right language, wrong code point. `coverage` is a locale with
 * almost nothing in it, which would otherwise pass this audit by having no
 * strings to be wrong about. `untranslated` is a coverage signal that rides
 * along for free; it never fails the run, because 25% of every locale is
 * legitimately awaiting translation.
 */
type Severity =
  | "wrong-language"
  | "fragment-h1"
  | "orthography"
  | "coverage"
  | "untranslated";

interface Finding {
  readonly locale: string;
  readonly path: string;
  readonly severity: Severity;
  readonly reason: string;
  readonly sample: string;
}

/* ── 1. Letters that pin a string to one language ──────────────────
   Only letters unique within OUR locale set are listed. `ş`/`Ş` are deliberately
   absent: Romanian's legacy cedilla forms use the same code points, so they
   cannot separate Turkish from Romanian. `ç`, `ö`, `ü` are absent for the same
   reason — French, German and Turkish all use them. */
const ALPHABET_MARKERS: ReadonlyArray<{ lang: string; chars: RegExp; label: string }> = [
  { lang: "tr", chars: /[ıİğĞ]/u, label: "Turkish" },
  { lang: "pl", chars: /[łŁ]/u, label: "Polish" },
  { lang: "cs", chars: /[řŘůŮ]/u, label: "Czech" },
  { lang: "ro", chars: /[țȚșȘ]/u, label: "Romanian" },
  { lang: "vi", chars: /[ơƠưƯđĐ]/u, label: "Vietnamese" },
];

/* ── 2. The script each locale is written in ───────────────────────── */
const SCRIPTS: Readonly<Record<string, RegExp>> = {
  ru: /\p{Script=Cyrillic}/u,
  uk: /\p{Script=Cyrillic}/u,
  ja: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
  ko: /\p{Script=Hangul}/u,
  "zh-hans": /\p{Script=Han}/u,
  zh: /\p{Script=Han}/u,
  ar: /\p{Script=Arabic}/u,
  fa: /\p{Script=Arabic}/u,
  he: /\p{Script=Hebrew}/u,
  hi: /\p{Script=Devanagari}/u,
  th: /\p{Script=Thai}/u,
  el: /\p{Script=Greek}/u,
};

/** Scripts that must not appear in a Latin-written locale at all. */
const NON_LATIN = /[\p{Script=Cyrillic}\p{Script=Greek}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Devanagari}\p{Script=Thai}]/u;

const LATIN_LOCALES = new Set([
  "en", "tr", "de", "es", "fr", "it", "nl", "pl", "cs", "ro", "vi", "ms", "id", "pt",
]);

/* ── Exclusions ───────────────────────────────────────────────────── */

/** Key paths whose value is a person's name, not prose. */
const NAME_PATH = /(^|\.)(name|author|authors|fullName)(\.|$)/i;

/** The homepage AI demo translates INTO Turkish on purpose. */
const INTENTIONAL_TURKISH = new Set([
  "features.ai.glossaryMatch",
  "features.ai.targetLabel",
]);

/** Product nouns that are spelled the same in every language. */
const BRAND_TOKENS = [
  "Better I18N", "Better i18n", "better-i18n", "GitHub", "Next.js", "React", "Vue",
  "Angular", "Svelte", "Nuxt", "Astro", "Remix", "Vite", "Expo", "TanStack",
  "Cloudflare", "DeepL", "OpenAI", "Claude", "Gemini", "Crowdin", "Lokalise",
  "Phrase", "Transifex", "Smartling", "XTM", "Locize", "MCP", "CDN", "API",
  "SDK", "CLI", "JSON", "YAML", "SEO", "AI", "CI", "npm", "npx",
];

/**
 * Romanian is written with comma-below (ș U+0219, ț U+021B). The cedilla forms
 * (ş U+015F, ţ U+0163) are Turkish code points that legacy fonts and old
 * keyboard layouts leak into Romanian text — `cookies.whatAreCookies.description`
 * shipped "fişiere" for exactly this reason. The word is Romanian and the
 * translation is fine; only two characters are wrong, so this is reported apart
 * from a genuinely mislabelled string.
 */
const RO_CEDILLA = /[şŞţŢ]/u;

/* ── Fragment headings ─────────────────────────────────────────────
   A page's h1 is its strongest on-page signal, and /integrations/ shipped one
   that stopped mid-clause in twenty locales: "Integriert sich in Ihren",
   "Se integra con tu", "Tích hợp với". The cause was a key called
   `hero.titleHighlight` that this page rendered as a separate paragraph, so
   every translator read the name and split the sentence across the two.

   Thresholds come from scanning all 23 locales before they were written down,
   not from a guess:

     en  52 chars, ends "."     tr  52 chars, ends "."   ← intact
     de  24  es 17  fr 17  it 21  pl 21  ru 21  nl 17  cs 20
     ro  16  uk 20  id 19  ms 19  vi 12  th 10  hi 26  he 8
     ja   4  zh-hans 5  fa 25                             ← every one a fragment
     ko  10, ends ":"                                     ← deliberate lead-in

   Two things follow. A short heading is not by itself a defect — Japanese and
   Chinese headings are legitimately a third the length of English — so the rule
   is comparative: the English source ends a sentence and the translation does
   not, AND the translation is far shorter than its own script's norm. And the
   Korean colon is excluded by name, because a lead-in that ends in ":" is a
   choice, not a truncation. */

/** Sentence-ending punctuation, by script family. */
const SENTENCE_END = /[.!?。！？؟।]$/u;

/**
 * Languages that end a sentence with a space, not a mark.
 *
 * Thai, Lao, Khmer and Burmese have no full stop in ordinary prose: the sentence
 * boundary is whitespace. Requiring terminal punctuation there would report a
 * correct translation forever — it did once already, on the Thai h1
 * "การผสานรวมที่เข้ากับวิธีทำงานของทีมผลิตภัณฑ์", which is a complete sentence.
 * For these locales the length ratio carries the signal on its own.
 */
const NO_TERMINAL_PUNCTUATION = new Set(["th", "lo", "km", "my"]);

/** A colon or dash ends a deliberate lead-in, not a truncated sentence. */
const LEAD_IN_END = /[:：—-]$/u;

/** Scripts that pack a sentence into far fewer characters than Latin does. */
const DENSE_SCRIPT = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Thai}]/u;

/** Key paths whose value is rendered as an h1. */
const HEADING_KEY = /(^|\.)hero\.title$/;

/**
 * A value that is a path, a command or an identifier rather than a sentence.
 *
 * The first version was `/^[\w@./:{}$#\\[\]()\s|>-]+$/`, which matched any string
 * made of ASCII letters and spaces — so "Integriert sich in Ihren" and
 * "Se integra con tu" were classified as code and skipped, and seven of the
 * nineteen broken headings went unreported by the very check written to find
 * them. A sentence is now only treated as code when it carries a symbol that
 * prose does not: a slash, an @, a brace, a colon-slash, or no spaces at all.
 */
const CODE_SHAPED = (value: string): boolean => {
  const hasSymbol = /[@/{}$#\\[\]|=<>]/u.test(value);
  const hasSpace = /\s/u.test(value);
  /* A run of CJK or Thai has no spaces either — "あなたの" is a sentence
     fragment, not an identifier — so a space-free string only counts as code
     when it is ASCII or carries a symbol. */
  const asciiOnly = /^[\x20-\x7E]*$/u.test(value);
  return hasSymbol || (!hasSpace && asciiOnly);
};

/**
 * A list of example URLs. `example.com/en/, example.com/fr/` is the same string
 * in every locale by design — the SEO pages use it to show URL shapes — so it is
 * not evidence that anything was left untranslated.
 */
const URL_SAMPLE = /^(?:[\w.-]+\.(?:com|org|net|io|de|fr|co\.uk)[\w/-]*[\s,、，·|]*)+$/u;

function stripBrands(value: string): string {
  let out = value;
  for (const token of BRAND_TOKENS) out = out.split(token).join(" ");
  return out;
}

/**
 * Fetch with a retry and a concurrency cap.
 *
 * The first version fired every locale's namespaces through Promise.all: ~3,200
 * requests at once, of which a handful always failed on the socket. A failed
 * fetch was silently skipped, which undercounted the locale — Spanish came back
 * as 2,523 strings against a 6,694 median and would have been reported as a
 * coverage gap that does not exist. A check that invents findings under load is
 * worse than no check, so failures are retried and, if they still fail, counted
 * and reported rather than folded into the totals.
 */
const CONCURRENCY = 8;

async function fetchJson(url: string): Promise<{ data: unknown | null; failed: boolean }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 404) return { data: null, failed: false };
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { data: await res.json(), failed: false };
    } catch {
      if (attempt === 2) return { data: null, failed: true };
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }
  }
  return { data: null, failed: true };
}

/** Map with a bounded number of in-flight requests. */
async function mapLimit<T, R>(items: readonly T[], fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

function walk(obj: unknown, prefix = ""): Array<[string, string]> {
  if (typeof obj === "string") return [[prefix, obj]];
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    walk(v, prefix ? `${prefix}.${k}` : k),
  );
}

function inspect(
  locale: string,
  namespace: string,
  entries: Array<[string, string]>,
  english: ReadonlyMap<string, string>,
): Finding[]  {
  const findings: Finding[] = [];

  for (const [key, value] of entries) {
    const path = `${namespace}.${key}`;
    if (NAME_PATH.test(key) || INTENTIONAL_TURKISH.has(path)) continue;
    if (!value.trim() || CODE_SHAPED(value) || URL_SAMPLE.test(value)) continue;

    // 1. a letter that belongs to another language in our set
    for (const marker of ALPHABET_MARKERS) {
      if (marker.lang === locale) continue;
      if (marker.chars.test(value)) {
        findings.push({
          locale,
          path,
          severity: "wrong-language",
          reason: `${marker.label} letters in a ${locale} string`,
          sample: value.slice(0, 70),
        });
        break;
      }
    }

    if (locale === "ro" && RO_CEDILLA.test(value)) {
      findings.push({
        locale,
        path,
        severity: "orthography",
        reason: "Turkish cedilla instead of Romanian comma-below",
        sample: value.slice(0, 70),
      });
    }

    /* A heading that trails off. Comparative, because "short" alone is not a
       defect in every writing system. */
    if (HEADING_KEY.test(key)) {
      const source = english.get(`${namespace}.${key}`) ?? "";
      const trimmed = value.trim();
      /* 0.55, not 0.5: Hindi came in at exactly half the English length
         (26 of 52) and a strict `<` let it through. */
      const ratioLimit = DENSE_SCRIPT.test(trimmed) ? 0.3 : 0.55;
      const tooShort = source.length > 0 && trimmed.length / source.length < ratioLimit;
      const unfinished = NO_TERMINAL_PUNCTUATION.has(locale)
        ? true
        : !SENTENCE_END.test(trimmed) && !LEAD_IN_END.test(trimmed);

      if (SENTENCE_END.test(source.trim()) && unfinished && tooShort) {
        findings.push({
          locale,
          path,
          severity: "fragment-h1",
          reason: NO_TERMINAL_PUNCTUATION.has(locale)
            ? `h1 is ${trimmed.length} chars against ${source.length} in English`
            : `h1 is ${trimmed.length} chars against ${source.length} in English and does not end a sentence`,
          sample: trimmed.slice(0, 70),
        });
      }
    }

    const expected = SCRIPTS[locale];
    const body = stripBrands(value);

    // 2a. a non-Latin locale with none of its own script left in a string that
    //      someone did translate (identical-to-English means "not translated
    //      yet", which this check is not about)
    if (expected && !expected.test(value) && english.get(`${namespace}.${key}`) !== value) {
      /* Six words, not three: "example.com/en/, example.com/fr/" is a URL
         sample that is identical in every locale, and three-word thresholds
         reported dozens of them. A six-word run is prose. */
      const latinWords = body.match(/\p{Script=Latin}{2,}/gu) ?? [];
      if (latinWords.length >= 6) {
        findings.push({
          locale,
          path,
          severity: "untranslated",
          reason: `no ${locale} script — English left in place`,
          sample: value.slice(0, 70),
        });
      }
    }

    /* 2b. a Latin locale carrying a foreign script — but only when that script
       carries the string. Pages about localization quote other writing systems
       on purpose: `culturalAdaptation.technical.dateTime.description` explains
       date formats and names 年月日 in every locale. One quoted example is not a
       defect; a value that is mostly Arabic in a German file is. */
    if (LATIN_LOCALES.has(locale)) {
      const letters = body.match(/\p{L}/gu)?.length ?? 0;
      const foreign = body.match(new RegExp(NON_LATIN.source, "gu"))?.length ?? 0;
      if (letters > 0 && foreign / letters >= 0.3) {
        findings.push({
          locale,
          path,
          severity: "wrong-language",
          reason: `mostly non-Latin script in a ${locale} string`,
          sample: value.slice(0, 70),
        });
      }
    }
  }

  return findings;
}

async function main() {
  const limitArg = process.argv.indexOf("--limit");
  const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : 5;

  const manifest = (await (await fetch(`${CDN}/manifest.json`)).json()) as {
    languages: Array<{ code: string; isSource?: boolean }>;
    namespaces?: string[];
  };
  const namespaces = manifest.namespaces ?? [];
  const locales = manifest.languages.map((l) => l.code).filter((c) => c !== "en");

  if (namespaces.length === 0) {
    console.error("manifest has no namespace list — cannot enumerate files");
    process.exit(2);
  }

  /* The English file, flattened once: the yardstick for "was this ever
     translated". */
  const english = new Map<string, string>();
  await mapLimit(namespaces, async (ns) => {
    const { data } = await fetchJson(`${CDN}/en/${ns}.json`);
    if (data) for (const [k, v] of walk(data)) english.set(`${ns}.${k}`, v);
  });

  const findings: Finding[] = [];
  /** Strings actually scanned per locale — the evidence behind a coverage gap. */
  const scanned = new Map<string, number>();
  /** Namespaces that could not be read at all, so their absence proves nothing. */
  const fetchFailures = new Map<string, number>();
  /** Namespace files that answered 200 for this locale, empty or not. */
  const present = new Map<string, number>();

  for (const locale of [...locales, ...EXTRA_LOCALE_PROBES.filter((l) => !locales.includes(l))]) {
    const files = await mapLimit(namespaces, async (ns) => {
      const { data, failed } = await fetchJson(`${CDN}/${locale}/${ns}.json`);
      return [ns, data, failed] as const;
    });
    const unreachable = files.filter(([, , failed]) => failed).length;
    if (unreachable > 0) fetchFailures.set(locale, unreachable);
    /* A file that answers 200 exists; one that 404s never did. The difference
       matters: an empty file on the CDN is a locale that looks alive to anything
       reading URLs, while a 404 is simply a language we do not ship. */
    present.set(locale, files.filter(([, data]) => data !== null).length);
    let count = 0;
    for (const [ns, data] of files) {
      if (!data) continue;
      const entries = walk(data);
      count += entries.length;
      findings.push(...inspect(locale, ns, entries, english));
    }
    scanned.set(locale, count);
  }

  /* A locale is a coverage gap when it holds less than half the median locale.
     Half, not a fixed number, because the corpus grows: today the median is
     ~6,700 strings and `ar` has 12, which is not a borderline call. Anything
     genuinely near the line deserves a human look rather than a tighter
     threshold. */
  for (const [locale, count] of fetchFailures) {
    console.log(`  note: ${count} namespace file(s) unreadable for ${locale}; its count is a floor, not a total`);
  }

  const counts = [...scanned.values()].filter((n) => n > 0).sort((a, b) => a - b);
  const median = counts.length ? counts[Math.floor(counts.length / 2)] : 0;
  for (const [locale, count] of scanned) {
    const listed = locales.includes(locale);

    if (count === 0) {
      /* Empty is only evidence for a locale we expect to exist. For anything
         else the CDN's blanket 200 `{}` would make every typo look like a bug. */
      if (listed || EXTRA_LOCALE_PROBES.includes(locale)) {
        findings.push({
          locale,
          path: "(whole locale)",
          severity: "coverage",
          reason: listed
            ? "served by the manifest but every namespace file is empty"
            : "every namespace file is empty and the manifest does not list it — nothing is served",
          sample: "",
        });
      }
      continue;
    }

    if (median > 0 && count < median / 2) {
      findings.push({
        locale,
        path: "(whole locale)",
        severity: "coverage",
        reason: `${count} strings scanned, median ${median} — locale is far behind the rest`,
        sample: "",
      });
      continue;
    }

    if (!listed) {
      findings.push({
        locale,
        path: "(whole locale)",
        severity: "coverage",
        reason: `${count} strings on the CDN but the manifest does not list this locale — nothing is served`,
        sample: "",
      });
    }
  }

  const report = (severity: Severity, heading: string) => {
    const list = findings.filter((f) => f.severity === severity);
    if (list.length === 0) return 0;
    const byLocale = new Map<string, Finding[]>();
    for (const f of list) byLocale.set(f.locale, [...(byLocale.get(f.locale) ?? []), f]);
    console.log(`${heading}: ${list.length} in ${byLocale.size} locale(s)\n`);
    for (const [locale, items] of [...byLocale].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`  ${locale}  ${items.length}`);
      for (const f of items.slice(0, limit)) {
        console.log(`     ${f.path}  — ${f.reason}`);
        console.log(`        ${JSON.stringify(f.sample)}`);
      }
      if (items.length > limit) console.log(`     … ${items.length - limit} more (--limit)`);
    }
    console.log("");
    return list.length;
  };

  const wrong = report("wrong-language", "WRONG LANGUAGE");
  const fragments = report("fragment-h1", "FRAGMENT H1");
  const orthography = report("orthography", "ORTHOGRAPHY");
  const coverage = report("coverage", "COVERAGE GAP");
  const untranslated = report("untranslated", "UNTRANSLATED (information, not a failure)");

  /* Always print what was scanned. A check that stays silent because it had
     nothing to read looks exactly like a check that passed. */
  const scale = [...scanned.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`scanned (median ${median}):`);
  for (const [l, n] of scale) console.log(`  ${l.padEnd(9)} ${String(n).padStart(6)}`);
  console.log("");

  if (wrong === 0 && fragments === 0 && orthography === 0 && coverage === 0) {
    console.log(
      untranslated === 0
        ? "locale scripts: clean"
        : `locale scripts: clean — ${untranslated} untranslated string(s) noted above`,
    );
    return;
  }
  process.exit(1);
}

await main();

export {};
