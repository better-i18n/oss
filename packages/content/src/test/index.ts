import type { ContentConfig, EventProperties, TrackEvent, TrackOptions } from '../types'

export interface CollectedEvent {
  eventName: string
  properties?: EventProperties
  options?: TrackOptions
  timestamp: number
}

export function createMockConfig(
  overrides?: Partial<ContentConfig>,
): ContentConfig {
  return {
    projectId: 'test-project',
    apiKey: 'test-api-key',
    analytics: {
      enabled: true,
      endpoint: 'https://localhost/test/track',
      debug: false,
      ...overrides?.analytics,
    },
    ...overrides,
  }
}

export function createFakeCollector() {
  const events: CollectedEvent[] = []

  function track(
    eventName: string,
    properties?: EventProperties,
    options?: TrackOptions,
  ) {
    events.push({
      eventName,
      properties,
      options,
      timestamp: Date.now(),
    })
  }

  function reset() {
    events.length = 0
  }

  function getEvents(): readonly CollectedEvent[] {
    return events
  }

  function getLastEvent(): CollectedEvent | undefined {
    return events[events.length - 1]
  }

  return { track, reset, getEvents, getLastEvent }
}

export function createMockTransport() {
  const sent: TrackEvent[] = []

  async function send(event: TrackEvent): Promise<void> {
    sent.push(event)
  }

  function getSent(): readonly TrackEvent[] {
    return sent
  }

  function reset() {
    sent.length = 0
  }

  return { send, getSent, reset }
}
