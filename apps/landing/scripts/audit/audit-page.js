/**
 * Per-page audit body for `aside repl`.
 *
 * Expects a global `BATCH` (array of absolute URLs) to be prepended by the
 * runner, and prints one `RESULT <json>` line at the end.
 *
 * Why aside and not curl: half of what we care about only exists after
 * hydration. Two bugs shipped this week were invisible to curl — the changelog
 * section and the blog list both rendered server-side and were then wiped by a
 * client fetch that returned an empty array. So every check below runs against
 * the live DOM, and the SEO checks read the head as the browser resolved it.
 *
 * One tab per URL (openTab/closeTab). `page.goto()` in a loop kills the CDP
 * execution context ("Cannot find context with specified id").
 */

// Humanised-key leakage: `useT` turns a missing key into Title Case, so these
// exact strings standing alone in a leaf element mean a key never reached the CDN.
const PLACEHOLDER_WORDS = [
  'Title', 'Subtitle', 'Description', 'Body', 'Label', 'Note', 'Eyebrow', 'Badge',
  'Question', 'Answer', 'Heading', 'Cta Secondary', 'Vs Label', 'Feature Label',
  'Model Label', 'Model Body', 'Included Label', 'Example Note', 'Respect Note',
  'Competitors Label', 'Benefits Label', 'Center Sublabel', 'Usage Label',
  'Cta Primary', 'Tagline', 'Summary', 'Caption', 'Placeholder', 'Legend',
];

/**
 * The vocabulary above only catches leaks we have already seen once. It missed
 * "Center Sublabel" and "Usage Label" on /integrations/{slug}/ — a real leak
 * that shipped to a human before the harness noticed.
 *
 * `useT` humanises a missing key by Title-Casing its LAST dot-segment, so the
 * leak always ends in the word the developer used for that slot. Matching that
 * suffix catches the whole family — `foo.heroSublabel`, `bar.legalNote` — while
 * staying narrow enough that real copy does not trip it: a short standalone
 * string ending in "Title"/"Label"/"Body" is not a sentence anyone writes.
 */
const PLACEHOLDER_SUFFIX_RE =
  /^(?:[A-Z][a-z0-9]*\s){0,2}(?:Title|Subtitle|Sublabel|Label|Body|Text|Eyebrow|Question|Answer|Description|Note|Heading|Caption)$/;

const results = [];

for (const url of BATCH) {
  const consoleErrors = [];
  const failedRequests = [];
  let tab;

  // openTab sometimes hands back a tab that never navigated (page.url() === ':').
  // It happened on ~20 of 78 pages in the first full run and looked exactly like a
  // site bug: blank body, no h1, no head tags. So confirm navigation actually
  // landed before auditing, and retry on a fresh tab if it did not — otherwise the
  // report blames the site for a harness failure.
  const t0 = Date.now();
  let navigated = false;
  for (let attempt = 1; attempt <= 3 && !navigated; attempt++) {
    try {
      tab = await openTab(url);
    } catch (e) {
      if (attempt === 3) {
        results.push({ url, fatal: `openTab: ${String(e).slice(0, 90)}` });
      }
      await sleep(1200);
      continue;
    }
    for (let waited = 0; waited < 12000; waited += 800) {
      let current = '';
      try { current = page.url(); } catch {}
      if (current && current !== ':' && current.startsWith('http')) { navigated = true; break; }
      await sleep(800);
    }
    if (!navigated) {
      try { await closeTab(tab); } catch {}
      await sleep(600);
    }
  }
  if (!navigated) {
    results.push({ url, fatal: 'navigation never landed after 3 attempts' });
    continue;
  }
  const openMs = Date.now() - t0;

  const onConsole = (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160));
  };
  const onPageError = (e) => consoleErrors.push(`pageerror: ${String(e).slice(0, 160)}`);
  const onFailed = (req) => {
    try { failedRequests.push(`${req.failure()?.errorText ?? 'failed'} ${req.url().slice(0, 90)}`); } catch {}
  };
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('requestfailed', onFailed);

  // LCP is only exposed through a buffered PerformanceObserver — reading
  // getEntriesByType() cold returns an empty list. Register it first, then let
  // the page settle: lazy sections hydrate and any client-side refetch resolves,
  // which is where this week's two regressions lived.
  try {
    await page.evaluate(() => {
      window.__lcpMs = null;
      new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        if (last) window.__lcpMs = Math.round(last.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  } catch {}

  // Wait for a SIGNAL, not a stopwatch. A fixed 3.5s settle produced ghost
  // findings whenever the dev server was busy (three agents editing + HMR):
  // pages whose SSR HTML carries 12-15k characters were measured at ~500 and
  // reported as "thin body / no description". Poll until the page has actually
  // rendered — an h1 plus real body text — then give lazy sections one more beat.
  // A length THRESHOLD is not enough: a page whose shell alone is ~490 characters
  // passes `> 400` while its lazy sections are still mounting, and gets reported
  // as "thin body / no description". Wait for the text to stop GROWING instead —
  // two consecutive equal readings, with an h1 present.
  let lastLen = -1;
  let stable = 0;
  for (let waited = 0; waited < 16000; waited += 600) {
    let len = 0;
    let hasH1 = false;
    try {
      const probe = await page.evaluate(() => ({
        len: document.querySelector('main')?.innerText?.length ?? 0,
        h1: Boolean(document.querySelector('h1')),
      }));
      len = probe.len;
      hasH1 = probe.h1;
    } catch {}
    stable = len > 0 && len === lastLen ? stable + 1 : 0;
    lastLen = len;
    if (hasH1 && stable >= 2) break;
    await sleep(600);
  }
  await sleep(800);

  /* ---- head settle -------------------------------------------------------
     The loop above watches the BODY. The head is populated on a different beat:
     TanStack swaps <head> when the route resolves, and on a busy dev server a
     route can render its error component first and recover a moment later. The
     body loop sees that error page - it has an h1 and steady text - and stops.

     That is how pages carrying a correct canonical, a 164-character description
     and four JSON-LD blocks were reported as having none of them: 17 of 77 in
     one run, a different 14 in the next. Three separate ghost-finding waves in
     this harness have come from measuring before the page finished (thin body,
     then the fixed sleep, now this), and each one cost someone a day chasing a
     defect that did not exist.

     So: wait for the head to stop changing, and never accept the error head.
     Do not "simplify" this away - a check that reports phantom failures is worse
     than no check, because people stop trusting the real findings too. */
  /* Ceiling kept low on purpose: a healthy head settles in two readings (~0.8s),
     and the shards run inside an `aside repl` session that dies if it overruns.
     A 12s ceiling here killed 6 of 8 shards on the first attempt — the audit
     reported 35 pages instead of 77. Slow-but-correct is still a broken check
     when it never finishes. */
  let headKey = '';
  let headStable = 0;
  for (let waited = 0; waited < 4000; waited += 400) {
    let snap = { key: '', failed: true };
    try {
      snap = await page.evaluate(() => {
        const title = document.title || '';
        return {
          key: [
            title,
            document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
            document.querySelector('meta[name="description"]')?.getAttribute('content')?.length ?? 0,
            document.querySelectorAll('script[type="application/ld+json"]').length,
          ].join('|'),
          // The app's error boundary sets this title; it is never a real page.
          failed: /failed to load/i.test(title),
        };
      });
    } catch {}
    headStable = snap.key && snap.key === headKey && !snap.failed ? headStable + 1 : 0;
    headKey = snap.key;
    if (headStable >= 2) break;
    await sleep(400);
  }

  let audit;
  try {
    audit = await page.evaluate(([words, suffixSource]) => {
      const set = new Set(words);
      const txt = (el) => (el?.textContent ?? '').trim();
      const attr = (sel, name) => document.querySelector(sel)?.getAttribute(name) ?? null;

      // ---- content / render -------------------------------------------------
      const h1s = [...document.querySelectorAll('h1')];
      const main = document.querySelector('main') ?? document.body;
      const visibleText = (main.innerText || '').replace(/\s+/g, ' ').trim();

      const placeholders = {};
      const suffixRe = new RegExp(suffixSource);
      document.querySelectorAll('body *').forEach((el) => {
        if (el.children.length) return;
        const t = txt(el);
        if (!t || t.length > 40) return;
        // Either a leak we have seen before, or anything shaped like a
        // humanised key: both are a missing key, never intentional copy.
        if (set.has(t) || suffixRe.test(t)) placeholders[t] = (placeholders[t] || 0) + 1;
      });

      // ---- layout -----------------------------------------------------------
      const docEl = document.documentElement;
      const hScroll = docEl.scrollWidth > docEl.clientWidth + 2;
      const overflowing = [...main.querySelectorAll('*')]
        .filter((el) => el.getBoundingClientRect().width > docEl.clientWidth + 2)
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className || '').split(' ').slice(0, 2).join('.')}`);

      // ---- SEO head ---------------------------------------------------------
      const title = document.title || '';
      const desc = attr('meta[name="description"]', 'content') || '';
      const canonical = attr('link[rel="canonical"]', 'href');
      const alternates = [...document.querySelectorAll('link[rel="alternate"][hreflang]')]
        .map((l) => l.getAttribute('hreflang'));
      const robots = attr('meta[name="robots"]', 'content');
      const og = {
        title: attr('meta[property="og:title"]', 'content'),
        description: attr('meta[property="og:description"]', 'content'),
        image: attr('meta[property="og:image"]', 'content'),
        url: attr('meta[property="og:url"]', 'content'),
        type: attr('meta[property="og:type"]', 'content'),
      };
      const twitter = {
        card: attr('meta[name="twitter:card"]', 'content'),
        title: attr('meta[name="twitter:title"]', 'content'),
      };

      // JSON-LD: parse every block so a syntax error is a finding, not a silent no-op.
      const ldTypes = [];
      const ldErrors = [];
      document.querySelectorAll('script[type="application/ld+json"]').forEach((s, i) => {
        try {
          const parsed = JSON.parse(s.textContent || '');
          const walk = (node) => {
            if (Array.isArray(node)) return node.forEach(walk);
            if (node && typeof node === 'object') {
              if (node['@type']) ldTypes.push(String(node['@type']));
              if (node['@graph']) walk(node['@graph']);
            }
          };
          walk(parsed);
        } catch (e) {
          ldErrors.push(`block ${i}: ${String(e).slice(0, 60)}`);
        }
      });

      // ---- headings + a11y --------------------------------------------------
      const headings = [...document.querySelectorAll('main h1, main h2, main h3, main h4')]
        .map((h) => Number(h.tagName[1]));
      let headingJumps = 0;
      for (let i = 1; i < headings.length; i++) {
        if (headings[i] - headings[i - 1] > 1) headingJumps++;
      }
      const imgs = [...document.querySelectorAll('main img')];
      const imgsNoAlt = imgs.filter((i) => i.getAttribute('alt') === null).length;
      const imgsBroken = imgs.filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.getAttribute('src')).slice(0, 3);
      const linksEmpty = [...document.querySelectorAll('main a')]
        .filter((a) => !txt(a) && !a.getAttribute('aria-label') && !a.querySelector('img,svg')).length;

      // ---- performance ------------------------------------------------------
      const nav = performance.getEntriesByType('navigation')[0];
      const res = performance.getEntriesByType('resource');
      const bytes = res.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0);
      const byType = {};
      for (const r of res) {
        const kind = r.initiatorType || 'other';
        byType[kind] = (byType[kind] || 0) + 1;
      }
      const paint = performance.getEntriesByName('first-contentful-paint')[0];

      return {
        // render
        h1Count: h1s.length,
        h1: txt(h1s[0]).slice(0, 60),
        textChars: visibleText.length,
        sections: main.querySelectorAll('section').length,
        placeholders,
        placeholderTotal: Object.values(placeholders).reduce((a, b) => a + b, 0),
        // layout
        hScroll,
        overflowing,
        // seo
        title,
        titleLen: title.length,
        descLen: desc.length,
        canonical,
        alternates: alternates.length,
        hasXDefault: alternates.includes('x-default'),
        robots,
        og,
        twitter,
        ldTypes: [...new Set(ldTypes)],
        ldErrors,
        // a11y / quality
        lang: document.documentElement.getAttribute('lang'),
        headingJumps,
        imgs: imgs.length,
        imgsNoAlt,
        imgsBroken,
        linksEmpty,
        internalLinks: [...document.querySelectorAll('main a[href^="/"]')].length,
        // perf
        ttfbMs: nav ? Math.round(nav.responseStart) : null,
        domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
        loadMs: nav ? Math.round(nav.loadEventEnd || nav.duration) : null,
        fcpMs: paint ? Math.round(paint.startTime) : null,
        lcpMs: window.__lcpMs ?? null,
        requests: res.length,
        transferKb: Math.round(bytes / 1024),
        requestsByType: byType,
      };
    }, [PLACEHOLDER_WORDS, PLACEHOLDER_SUFFIX_RE.source]);
  } catch (e) {
    audit = { fatal: `evaluate: ${String(e).slice(0, 100)}` };
  }

  page.off('console', onConsole);
  page.off('pageerror', onPageError);
  page.off('requestfailed', onFailed);

  results.push({
    url,
    openMs,
    consoleErrors: consoleErrors.slice(0, 4),
    failedRequests: failedRequests.slice(0, 4),
    ...audit,
  });

  try { await closeTab(tab); } catch {}
}

console.log('RESULT ' + JSON.stringify(results));
