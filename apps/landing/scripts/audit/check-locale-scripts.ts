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
 * `wrong-language` is the defect this script exists for: a string published
 * under a locale it is not written in. `orthography` is a real but softer
 * finding — right language, wrong code point. `untranslated` is a coverage
 * signal that rides along for free; it never fails the run, because 25% of
 * every locale is legitimately awaiting translation.
 */
type Severity = "wrong-language" | "orthography" | "untranslated";

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

/** A value that is a path, a command or an identifier rather than a sentence. */
const CODE_SHAPED = /^[\w@./:{}$#\\[\]()\s|>-]+$/u;

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
    if (!value.trim() || CODE_SHAPED.test(value) || URL_SAMPLE.test(value)) continue;

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
  await Promise.all(
    namespaces.map(async (ns) => {
      const res = await fetch(`${CDN}/en/${ns}.json`);
      if (!res.ok) return;
      try {
        for (const [k, v] of walk(await res.json())) english.set(`${ns}.${k}`, v);
      } catch {
        /* a namespace with no English file cannot be a yardstick; skip it */
      }
    }),
  );

  const findings: Finding[] = [];
  for (const locale of locales) {
    const files = await Promise.all(
      namespaces.map(async (ns) => {
        const res = await fetch(`${CDN}/${locale}/${ns}.json`);
        if (!res.ok) return [ns, null] as const;
        try {
          return [ns, (await res.json()) as unknown] as const;
        } catch {
          return [ns, null] as const;
        }
      }),
    );
    for (const [ns, data] of files) {
      if (!data) continue;
      findings.push(...inspect(locale, ns, walk(data), english));
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
  const orthography = report("orthography", "ORTHOGRAPHY");
  const untranslated = report("untranslated", "UNTRANSLATED (coverage, not a failure)");

  if (wrong === 0 && orthography === 0) {
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
