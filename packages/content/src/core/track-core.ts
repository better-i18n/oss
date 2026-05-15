import { isBrowser, isBuildTime } from './environment'
import { sendEvent } from './transport'
import type {
  ContentConfig,
  EventProperties,
  TrackEvent,
  TrackOptions,
} from '../types'

declare const process: { env: Record<string, string | undefined> } | undefined

const DEFAULT_ENDPOINT = 'https://content.better-i18n.com/v1/track'

const ALLOWED_TYPES = new Set(['string', 'number', 'boolean'])

function isProduction(): boolean {
  try {
    return typeof process !== 'undefined' && process?.env?.NODE_ENV === 'production'
  } catch {
    return true
  }
}

function validateProperties(
  properties: EventProperties | undefined,
  debug: boolean,
): EventProperties | undefined {
  if (!properties) return undefined

  const cleaned: EventProperties = {}
  for (const [key, value] of Object.entries(properties)) {
    if (value === null || value === undefined) {
      cleaned[key] = value
      continue
    }
    if (!ALLOWED_TYPES.has(typeof value)) {
      const msg = `[better-i18n/content] Invalid property "${key}": expected string | number | boolean | null, got ${typeof value}`
      if (!isProduction()) throw new Error(msg)
      if (debug) console.warn(msg)
      continue
    }
    cleaned[key] = value
  }
  return cleaned
}

export function createTracker(config: ContentConfig) {
  const endpoint = config.analytics?.endpoint ?? DEFAULT_ENDPOINT
  const debug = config.analytics?.debug ?? false
  const enabled = config.analytics?.enabled ?? true

  function track(
    eventName: string,
    properties?: EventProperties,
    options?: TrackOptions,
  ): void {
    if (!enabled) return

    if (isBuildTime()) {
      console.warn(
        '[better-i18n/content] track() called at build time, skipped.',
      )
      return
    }

    if (!isBrowser() && !options?.allowServer) return

    const validatedProps = validateProperties(properties, debug)

    const event: TrackEvent = {
      event: eventName,
      properties: validatedProps,
      identity: options?.identity ?? undefined,
      timestamp: new Date().toISOString(),
      projectId: config.projectId,
      apiKey: config.apiKey,
    }

    sendEvent(event, { endpoint, debug }).catch(() => {
      // silent drop — no retry queue in Phase 1
    })
  }

  function reset(): void {
    if (debug) {
      console.debug('[better-i18n/content] reset() called')
    }
  }

  return { track, reset }
}
