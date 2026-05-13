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

const CONTENT_KEY: InjectionKey<ContentTrackerValue> = Symbol('better-content')

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
  const ctx = inject(CONTENT_KEY)
  if (!ctx) {
    throw new Error(
      '[better-i18n/content] useTrack must be used within a component that called provideContent()',
    )
  }
  return ctx.track
}

export function useContent() {
  const ctx = inject(CONTENT_KEY)
  if (!ctx) {
    throw new Error(
      '[better-i18n/content] useContent must be used within a component that called provideContent()',
    )
  }
  return ctx
}
