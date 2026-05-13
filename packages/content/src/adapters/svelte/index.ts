import { createTracker } from '../../core/track-core'
import type { ContentConfig, EventProperties, TrackOptions } from '../../types'

let tracker: ReturnType<typeof createTracker> | undefined

export function initContent(config: ContentConfig) {
  tracker = createTracker(config)
  return tracker
}

export function track(
  eventName: string,
  properties?: EventProperties,
  options?: TrackOptions,
): void {
  if (!tracker) {
    console.warn('[better-i18n/content] call initContent() before track()')
    return
  }
  tracker.track(eventName, properties, options)
}

export function reset(): void {
  tracker?.reset()
}

export function getTracker() {
  return tracker
}
