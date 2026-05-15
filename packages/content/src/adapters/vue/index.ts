import { inject, provide, type InjectionKey } from 'vue'
import { createTracker } from '../../core/track-core'
import type { ContentConfig, EventProperties, TrackOptions } from '../../types'

interface ContentTrackerValue {
  track: (
    eventName: string,
    properties?: EventProperties,
    options?: TrackOptions,
  ) => void
  reset: () => void
}

const NO_OP_TRACKER: ContentTrackerValue = {
  track: () => {},
  reset: () => {},
}

const CONTENT_KEY: InjectionKey<ContentTrackerValue> = Symbol('better-content')

let warnedNoProvider = false

export function provideContent(config: ContentConfig) {
  const tracker = createTracker(config)
  const value: ContentTrackerValue = {
    track: tracker.track,
    reset: tracker.reset,
  }
  provide(CONTENT_KEY, value)
  return value
}

export function useTrack() {
  return useContent().track
}

export function useContent() {
  const ctx = inject(CONTENT_KEY)
  if (!ctx) {
    if (!warnedNoProvider && typeof console !== 'undefined') {
      warnedNoProvider = true
      console.warn(
        '[better-i18n/content] useContent called without provideContent(). Tracking will be disabled.',
      )
    }
    return NO_OP_TRACKER
  }
  return ctx
}
