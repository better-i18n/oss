import { nav, win } from './globals'

declare const process: { env: Record<string, string | undefined> } | undefined

export function isBrowser(): boolean {
  return typeof win !== 'undefined'
}

export function isServer(): boolean {
  return !isBrowser()
}

export function isBuildTime(): boolean {
  try {
    if (typeof process !== 'undefined' && process?.env) {
      if (process.env.NEXT_PHASE === 'phase-production-build') return true
      if (process.env.GATSBY_BUILD_STAGE) return true
      if (process.env.ASTRO_BUILD) return true
    }
  } catch {
    // process may throw in some bundler environments
  }
  return false
}

export function isReactNative(): boolean {
  return typeof nav !== 'undefined' && (nav as Navigator & { product?: string }).product === 'ReactNative'
}
