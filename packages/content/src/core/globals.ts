export const win: (Window & typeof globalThis) | undefined =
  typeof window !== 'undefined' ? window : undefined

export const nav: Navigator | undefined =
  typeof navigator !== 'undefined' ? navigator : undefined

export const doc: Document | undefined =
  typeof document !== 'undefined' ? document : undefined

export function getSendBeacon(): Navigator['sendBeacon'] | undefined {
  return nav?.sendBeacon?.bind(nav)
}
