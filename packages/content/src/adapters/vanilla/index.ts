import { createTracker } from '../../core/track-core'
import type { ContentConfig, EventProperties, TrackOptions } from '../../types'

interface BetterContentGlobal {
  track: (
    eventName: string,
    properties?: EventProperties,
    options?: TrackOptions,
  ) => void
  reset: () => void
}

let instance: BetterContentGlobal | undefined

export function init(config: ContentConfig): BetterContentGlobal {
  const tracker = createTracker(config)
  instance = {
    track: tracker.track,
    reset: tracker.reset,
  }

  if (typeof window !== 'undefined') {
    ;(window as Window & { betterContent?: BetterContentGlobal }).betterContent = instance
  }

  return instance
}

export function track(
  eventName: string,
  properties?: EventProperties,
  options?: TrackOptions,
): void {
  if (!instance) {
    console.warn('[better-i18n/content] call init() before track()')
    return
  }
  instance.track(eventName, properties, options)
}

export function reset(): void {
  if (!instance) return
  instance.reset()
}
