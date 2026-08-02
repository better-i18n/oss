/**
 * Messages picked up during client-side navigation.
 *
 * ── The bug ─────────────────────────────────────────────────────────
 * The root route fetches only the namespaces a page needs (~23 of 103) and
 * serializes them into `<script id="__i18n_messages__">`. Correct, and a real
 * saving. What was missing is what happens on the second page.
 *
 * `beforeLoad` DOES re-run on a soft navigation — measured, after first
 * assuming otherwise — so the right namespaces for the new path are fetched
 * every time. The root `loader` does not re-run, and it is the loader that
 * carries messages to the component. So `loaderData.messages` stayed
 * `undefined`, the provider fell back to the hydration script tag, and the app
 * rendered the FIRST page's namespaces for the rest of the session: every key
 * the new page introduced came out as its humanised name.
 *
 * Measured on /en/ → click → /en/content/: 23 namespaces, no `contentPage`,
 * 45 humanised keys. A refresh "fixed" it because a refresh is a new document —
 * which is exactly what the audit harness did on every check, which is why it
 * reported zero placeholders for months.
 *
 * ── The fix ─────────────────────────────────────────────────────────
 * `beforeLoad` already has the messages; it just had nowhere to put them on the
 * client. It now writes them here, and the provider reads this store through
 * `useSyncExternalStore` and merges it under the document's own set. Because
 * `beforeLoad` is awaited before the route renders, the messages are in place
 * for the first paint: no frame of "Title / Eyebrow", and no blank screen.
 *
 * This sits in the root, not in `createPageLoader`, on purpose: routes with
 * their own loader (pricing, the persona pages) never call the shared one, and
 * hooking it there fixed /content/ while leaving /pricing/ broken — measured, 7
 * humanised keys from the `pricingPage` namespace.
 *
 * Merge, never replace. The document's namespaces stay authoritative: they were
 * fetched for this locale, and a namespace we already hold is the same file.
 */

type NamespaceMap = Record<string, unknown>;

/** Namespaces gathered per locale during this session. */
const store = new Map<string, NamespaceMap>();
const listeners = new Set<() => void>();

/** Bumped on every merge — `useSyncExternalStore` compares this, not the map. */
let version = 0;
let snapshot: { version: number; messages: NamespaceMap } = { version: 0, messages: {} };

function emit(locale: string) {
  version += 1;
  snapshot = { version, messages: store.get(locale) ?? {} };
  for (const listener of listeners) listener();
}

export function subscribeClientMessages(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getClientMessagesSnapshot() {
  return snapshot;
}

/** The server render has nothing to add: the root loader already has it all. */
export function getServerMessagesSnapshot() {
  return snapshot;
}

/**
 * Record the namespaces `beforeLoad` fetched for the page being navigated to.
 *
 * No-op on the server. Cheap to call on every navigation: it only touches the
 * store when the set actually grew, so a repeat visit does not re-render the
 * provider.
 */
export function mergeClientMessages(locale: string, messages: NamespaceMap | undefined): void {
  if (typeof document === "undefined" || !messages) return;

  const current = store.get(locale) ?? {};
  const added: NamespaceMap = {};
  for (const [namespace, value] of Object.entries(messages)) {
    if (current[namespace] === undefined) added[namespace] = value;
  }
  if (Object.keys(added).length === 0) return;

  store.set(locale, { ...current, ...added });
  emit(locale);
}
