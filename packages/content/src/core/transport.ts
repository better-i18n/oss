import { getSendBeacon } from './globals'
import type { TrackEvent, TransportOptions } from '../types'

const BEACON_BODY_LIMIT = 51_200 // 51.2KB — PostHog-documented fetch keepalive limit

export async function sendEvent(
  event: TrackEvent,
  options: TransportOptions,
): Promise<void> {
  const payload = JSON.stringify(event)
  const blob = new Blob([payload], { type: 'application/json' })

  const sent = trySendBeacon(options.endpoint, blob)
  if (sent) return

  if (payload.length < BEACON_BODY_LIMIT) {
    try {
      await fetch(options.endpoint, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      })
      return
    } catch {
      // fall through to regular fetch
    }
  }

  try {
    await fetch(options.endpoint, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    if (options.debug) {
      console.warn('[better-i18n/content] transport failed:', err)
    }
  }
}

function trySendBeacon(endpoint: string, blob: Blob): boolean {
  const beacon = getSendBeacon()
  if (!beacon) return false
  try {
    return beacon(endpoint, blob)
  } catch {
    return false
  }
}
