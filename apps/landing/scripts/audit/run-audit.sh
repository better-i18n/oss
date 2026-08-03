#!/usr/bin/env bash
# Whole-site audit driver: render + SEO + performance, in a real browser.
#
#   scripts/audit/run-audit.sh                    # marketing pages + 8 blog posts (en)
#   scripts/audit/run-audit.sh --blogs 40         # sample more blog posts
#   scripts/audit/run-audit.sh --locale tr        # audit another locale
#   scripts/audit/run-audit.sh --base https://better-i18n.com --blogs 0
#   scripts/audit/run-audit.sh --only /en/blog/   # audit one path
#
# The URL list is derived from the SEO source of truth (src/seo/pages.ts) and the
# build-time blog index, so a page added to the sitemap is audited automatically
# instead of being remembered by hand.
#
# Output: a table on stdout + the full JSON report at
# .audit/report-<timestamp>.json (gitignored).
set -uo pipefail

cd "$(dirname "$0")/../.." || exit 1

BASE="http://localhost:3001"
LOCALE="en"
BLOGS=8
BATCH_SIZE=8
ONLY=""

while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE="$2"; shift 2 ;;
    --locale) LOCALE="$2"; shift 2 ;;
    --blogs) BLOGS="$2"; shift 2 ;;
    --batch) BATCH_SIZE="$2"; shift 2 ;;
    --only) ONLY="$2"; shift 2 ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) echo "unknown flag: $1" >&2; exit 2 ;;
  esac
done

command -v aside >/dev/null || { echo "aside CLI not found" >&2; exit 127; }

OUT_DIR=".audit"
mkdir -p "$OUT_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
URL_FILE="$OUT_DIR/urls-$STAMP.txt"
REPORT="$OUT_DIR/report-$STAMP.json"

# ── 1. build the URL list ────────────────────────────────────────────────────
if [ -n "$ONLY" ]; then
  printf '%s%s\n' "$BASE" "$ONLY" > "$URL_FILE"
else
  BASE="$BASE" LOCALE="$LOCALE" BLOGS="$BLOGS" python3 - "$URL_FILE" <<'PY'
import json, os, re, sys, pathlib

base, locale, blogs = os.environ["BASE"], os.environ["LOCALE"], int(os.environ["BLOGS"])
urls = []

# Marketing routes: single source of truth for what ships in the sitemap.
pages = pathlib.Path("src/seo/pages.ts").read_text()
for path in re.findall(r'path:\s*"([^"]+)"', pages):
    p = "/" + path.strip("/")          # "pricing" and "/pricing" both -> "/pricing"
    p = "/" if p == "/" else p + "/"
    urls.append(f"{base}/{locale}{'' if p == '/' else p}")

# Blog posts: evenly sampled from the build-time index so the sample spans the
# whole set (old + new) instead of only the newest N.
if blogs:
    idx = json.loads(pathlib.Path(f"public/blog-index-{locale}.json").read_text())
    posts = idx.get("allPosts", [])
    if posts:
        step = max(1, len(posts) // blogs)
        for post in posts[::step][:blogs]:
            urls.append(f"{base}/{locale}/blog/{post['slug']}/")

# Always include the list/pagination surfaces — they broke twice this week.
for extra in ("/blog/", "/blog/page/2/", "/changelog/", "/compare/", "/i18n/", "/tools/"):
    urls.append(f"{base}/{locale}{extra}")

seen, out = set(), []
for u in urls:
    if u not in seen:
        seen.add(u)
        out.append(u)
pathlib.Path(sys.argv[1]).write_text("\n".join(out) + "\n")
print(f"{len(out)} urls")
PY
fi

TOTAL=$(wc -l < "$URL_FILE" | tr -d ' ')
echo "▸ auditing $TOTAL urls  (base=$BASE locale=$LOCALE blogs=$BLOGS)"
case "$BASE" in
  *localhost*|*127.0.0.1*)
    echo "  note: dev server — byte counts are unbundled ES modules, not shippable"
    echo "        weight. Run against a preview/prod URL for real CWV numbers." ;;
esac

# ── 2. run in batches: one aside session per batch, sessions in parallel ─────
SCRIPT_BODY="$(cat scripts/audit/audit-page.js)"
split -l "$BATCH_SIZE" "$URL_FILE" "$OUT_DIR/batch-$STAMP-"

MAX_PARALLEL=2
pids=()
for batch in "$OUT_DIR/batch-$STAMP-"*; do
  # Wait for a free slot: more than ~3 concurrent browsers starves the dev server
  # and pages come back blank, which reads as a site bug when it is a harness bug.
  while [ "$(jobs -rp | wc -l | tr -d ' ')" -ge "$MAX_PARALLEL" ]; do sleep 2; done
  urls_js="$(python3 -c '
import json,sys
print(json.dumps([l.strip() for l in open(sys.argv[1]) if l.strip()]))' "$batch")"
  aside repl "const BATCH=$urls_js;$SCRIPT_BODY" > "$batch.log" 2>&1 &
  pids+=($!)
done
echo "▸ ${#pids[@]} browser sessions running…"
for pid in "${pids[@]}"; do wait "$pid"; done

# ── 3. merge + report ────────────────────────────────────────────────────────
REPORT="$REPORT" URL_TOTAL="$TOTAL" python3 - "$OUT_DIR/batch-$STAMP-"*.log <<'PY'
import json, os, pathlib, re, sys

rows = []
for path in sys.argv[1:]:
    raw = re.sub(r"\x1b\[[0-9;]*m", "", pathlib.Path(path).read_text())
    line = next((l for l in raw.splitlines() if l.startswith("RESULT ")), None)
    if line:
        rows.extend(json.loads(line[len("RESULT "):]))
    else:
        rows.append({"url": f"(batch {os.path.basename(path)})", "fatal": "no RESULT line"})

pathlib.Path(os.environ["REPORT"]).write_text(json.dumps(rows, indent=1))

# Findings are ordered by how much they cost: a page that does not render, then
# missing indexable metadata, then speed, then hygiene.
def findings(r):
    f = []
    if r.get("fatal"):                       f.append(f"FATAL {r['fatal']}")
    if r.get("h1Count") == 0:                f.append("no h1")
    if (r.get("h1Count") or 0) > 1:          f.append(f"h1×{r['h1Count']}")
    if (r.get("textChars") or 0) < 400:      f.append(f"thin body ({r.get('textChars')}c)")
    if r.get("placeholderTotal"):            f.append("PLACEHOLDER " + ",".join(f"{k}×{v}" for k, v in r["placeholders"].items()))
    if r.get("consoleErrors"):               f.append(f"console×{len(r['consoleErrors'])}")
    if r.get("failedRequests"):              f.append(f"reqfail×{len(r['failedRequests'])}")
    # Head-derived checks are only meaningful if the head settled. When it did
    # not, say so once instead of reporting five invented defects: a page whose
    # <head> we never finished reading is unmeasured, not broken.
    if r.get("headSettled") is False:
        f.append("HEAD NOT SETTLED (head checks skipped)")
    else:
        if not r.get("canonical"):               f.append("no canonical")
        if not (r.get("descLen") or 0):          f.append("no description")
        elif not 50 <= r["descLen"] <= 165:      f.append(f"desc {r['descLen']}c")
        if not (r.get("titleLen") or 0):         f.append("no title")
        elif not 15 <= r["titleLen"] <= 65:      f.append(f"title {r['titleLen']}c")
        if not (r.get("og") or {}).get("image"): f.append("no og:image")
        if not r.get("ldTypes"):                 f.append("no JSON-LD")
        if r.get("ldErrors"):                    f.append("JSON-LD parse error")
        if (r.get("alternates") or 0) == 0:      f.append("no hreflang")
    if r.get("hScroll"):                     f.append("H-SCROLL " + ",".join(r.get("overflowing") or []))
    if (r.get("lcpMs") or 0) > 2500:         f.append(f"LCP {r['lcpMs']}ms")
    if (r.get("transferKb") or 0) > 1500:    f.append(f"{r['transferKb']}KB")
    if r.get("imgsBroken"):                  f.append(f"broken img×{len(r['imgsBroken'])}")
    if r.get("imgsNoAlt"):                   f.append(f"img no-alt×{r['imgsNoAlt']}")
    if r.get("headingJumps"):                f.append(f"heading jump×{r['headingJumps']}")
    if r.get("linksEmpty"):                  f.append(f"empty link×{r['linksEmpty']}")
    return f

clean = 0
print(f"\n{'page':46} {'lcp':>5} {'kb':>5} {'txt':>6}  findings")
print("─" * 118)
for r in sorted(rows, key=lambda r: len(findings(r)), reverse=True):
    f = findings(r)
    if not f:
        clean += 1
        continue
    path = re.sub(r"^https?://[^/]+", "", r["url"])
    print(f"{path:46} {str(r.get('lcpMs') or '-'):>5} {str(r.get('transferKb') or '-'):>5} "
          f"{str(r.get('textChars') or '-'):>6}  {' | '.join(f)[:150]}")

lcps = [r["lcpMs"] for r in rows if r.get("lcpMs")]
kbs = [r["transferKb"] for r in rows if r.get("transferKb")]
print("─" * 118)

# Coverage before quality. A batch that dies takes its whole slice of URLs with
# it, and the run then reports a smaller, cleaner-looking site: "56 pages · 0
# with findings" hid three dead batches and the ~24 pages they were carrying.
# A number that shrinks silently is the same failure as a locale whose file is
# too small to scan — nothing to look at is not the same as nothing wrong.
intended = int(os.environ.get("URL_TOTAL") or 0)
measured = len([r for r in rows if not r.get("fatal")])
dead = [r for r in rows if str(r.get("fatal") or "").startswith("no RESULT")]
if intended and measured < intended:
    print(f"⚠ COVERAGE {measured}/{intended} urls measured — "
          f"{intended - measured} never ran ({len(dead)} batch(es) died). "
          f"Findings below describe the pages that DID run.")

print(f"{len(rows)} pages · {clean} clean · {len(rows)-clean} with findings")
if lcps:
    lcps.sort()
    print(f"LCP  median {lcps[len(lcps)//2]}ms · p90 {lcps[int(len(lcps)*0.9)]}ms · worst {lcps[-1]}ms")
if kbs:
    kbs.sort()
    print(f"bytes median {kbs[len(kbs)//2]}KB · worst {kbs[-1]}KB")
print(f"\nfull report: {os.environ['REPORT']}")
PY

rm -f "$OUT_DIR/batch-$STAMP-"*
