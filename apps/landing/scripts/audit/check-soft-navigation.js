/**
 * Soft-navigation audit — the path the harness never tested.
 *
 * Run inside `aside repl` (same runner as audit-page.js):
 *   BATCH = [["/en/", "/en/content/"], ...]
 *
 * ── Why this exists ─────────────────────────────────────────────────
 * Every check we had opened a URL with `openTab`, which is a fresh document:
 * server render, hydrate, measure. It reported "0 placeholders" for months while
 * a user clicking a link in the nav saw "Title / Subtitle / Eyebrow" on the page
 * they landed on. Both were true. The audit was measuring the one path that
 * worked.
 *
 * The bug: the root route fetches a page-specific slice of namespaces and
 * serializes it into the HTML. Its beforeLoad and loader run once per document,
 * so a client navigation reused the FIRST page's namespaces forever, and every
 * key the new page introduced rendered as its humanised name. A refresh "fixed"
 * it because a refresh is a new document — which is exactly what the harness was
 * doing every time.
 *
 * So: open a page, CLICK a link, and measure what the user is now looking at.
 * A path a check does not exercise is a path nobody is checking.
 */

const PLACEHOLDER_RE =
  /^(?:[A-Z][a-z0-9]*\s){0,2}(?:Title|Subtitle|Sublabel|Label|Body|Text|Eyebrow|Question|Answer|Description|Note|Heading|Caption)$/;

/** Leaf elements whose whole text is a humanised key. */
function countPlaceholders(re) {
  const hits = [...document.querySelectorAll('body *')]
    .filter((el) => el.children.length === 0)
    .map((el) => (el.textContent || '').trim())
    .filter((text) => text.length > 0 && text.length <= 40 && re.test(text));
  return { count: hits.length, sample: [...new Set(hits)].slice(0, 6) };
}

const results = [];

for (const [from, to] of BATCH) {
  let tab;
  try {
    tab = await openTab(`${BASE}${from}`);
  } catch (e) {
    results.push({ from, to, fatal: `openTab: ${String(e).slice(0, 80)}` });
    continue;
  }

  // Same navigation-landed guard as audit-page.js: openTab sometimes returns a
  // tab that never navigated.
  let navigated = false;
  for (let waited = 0; waited < 15000; waited += 800) {
    let current = '';
    try { current = page.url(); } catch {}
    if (current && current !== ':' && current.startsWith('http')) { navigated = true; break; }
    await sleep(800);
  }
  if (!navigated) {
    results.push({ from, to, fatal: 'navigation never landed' });
    try { await closeTab(tab); } catch {}
    continue;
  }

  // These pages are heavy; 6s reports a half-built DOM as a blank page.
  await sleep(9000);
  const before = await page.evaluate(
    `(${countPlaceholders.toString()})(${PLACEHOLDER_RE.toString()})`,
  );

  const clicked = await page.evaluate(`(() => {
    const link = [...document.querySelectorAll('a[href]')]
      .find((a) => (a.getAttribute('href') || '') === ${JSON.stringify(to)});
    if (!link) return false;
    link.click();
    return true;
  })()`);

  if (!clicked) {
    results.push({ from, to, fatal: `no link to ${to} on ${from}` });
    try { await closeTab(tab); } catch {}
    continue;
  }

  await sleep(9000);
  const after = await page.evaluate(`(() => {
    const counted = (${countPlaceholders.toString()})(${PLACEHOLDER_RE.toString()});
    return { ...counted, url: location.pathname };
  })()`);

  /* Back and forward too: history navigation restores a match without a
     document load, so it can regress separately from a click. */
  await page.evaluate('history.back()');
  await sleep(6000);
  const back = await page.evaluate(`(() => {
    const counted = (${countPlaceholders.toString()})(${PLACEHOLDER_RE.toString()});
    return { ...counted, url: location.pathname };
  })()`);

  await page.evaluate('history.forward()');
  await sleep(6000);
  const forward = await page.evaluate(`(() => {
    const counted = (${countPlaceholders.toString()})(${PLACEHOLDER_RE.toString()});
    return { ...counted, url: location.pathname };
  })()`);

  results.push({
    from,
    to,
    landed: after.url,
    beforeClick: before.count,
    afterClick: after.count,
    afterBack: back.count,
    afterForward: forward.count,
    sample: after.sample.length ? after.sample : forward.sample,
  });

  try { await closeTab(tab); } catch {}
  await sleep(400);
}

console.log(`RESULT ${JSON.stringify(results)}`);
