import type { Messages } from "@better-i18n/use-intl";

const store = new Map<string, Messages>();
const MAX_SIZE = 50;

export function storeMessages(requestId: string, messages: Messages): void {
  if (store.size >= MAX_SIZE) {
    const first = store.keys().next().value;
    if (first) store.delete(first);
  }
  store.set(requestId, messages);
}

export function readMessages(requestId: string): Messages | undefined {
  return store.get(requestId);
}

export function consumeMessages(requestId: string): Messages | undefined {
  const msgs = store.get(requestId);
  if (msgs) store.delete(requestId);
  return msgs;
}
