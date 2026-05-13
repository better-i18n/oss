import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendEvent } from '../core/transport'
import type { TrackEvent } from '../types'

function createEvent(overrides?: Partial<TrackEvent>): TrackEvent {
  return {
    event: 'content.view',
    properties: { slug: 'test' },
    timestamp: new Date().toISOString(),
    projectId: 'test-project',
    ...overrides,
  }
}

function installSendBeacon() {
  const fn = vi.fn<Navigator['sendBeacon']>().mockReturnValue(true)
  Object.defineProperty(navigator, 'sendBeacon', {
    value: fn,
    writable: true,
    configurable: true,
  })
  return fn
}

describe('sendEvent', () => {
  let originalSendBeacon: Navigator['sendBeacon'] | undefined

  beforeEach(() => {
    originalSendBeacon = navigator.sendBeacon
    vi.restoreAllMocks()
  })

  afterEach(() => {
    if (originalSendBeacon === undefined) {
      // @ts-expect-error — cleanup mock
      delete navigator.sendBeacon
    } else {
      Object.defineProperty(navigator, 'sendBeacon', {
        value: originalSendBeacon,
        writable: true,
        configurable: true,
      })
    }
  })

  it('tries sendBeacon first', async () => {
    const beaconFn = installSendBeacon()

    await sendEvent(createEvent(), {
      endpoint: 'https://test.example.com/track',
    })

    expect(beaconFn).toHaveBeenCalledWith(
      'https://test.example.com/track',
      expect.any(Blob),
    )
  })

  it('falls back to fetch when sendBeacon returns false', async () => {
    const beaconFn = installSendBeacon()
    beaconFn.mockReturnValue(false)
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('ok'),
    )

    await sendEvent(createEvent(), {
      endpoint: 'https://test.example.com/track',
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://test.example.com/track',
      expect.objectContaining({
        method: 'POST',
        keepalive: true,
      }),
    )
  })

  it('falls back to regular fetch when keepalive fails', async () => {
    const beaconFn = installSendBeacon()
    beaconFn.mockReturnValue(false)
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('keepalive rejected'))
      .mockResolvedValueOnce(new Response('ok'))

    await sendEvent(createEvent(), {
      endpoint: 'https://test.example.com/track',
    })

    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(fetchSpy.mock.calls[1]![1]).not.toHaveProperty('keepalive')
  })

  it('falls back to fetch when sendBeacon is unavailable', async () => {
    // sendBeacon not installed — simulates server-like env
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('ok'),
    )

    await sendEvent(createEvent(), {
      endpoint: 'https://test.example.com/track',
    })

    expect(fetchSpy).toHaveBeenCalledOnce()
  })

  it('silently drops when all transports fail in non-debug mode', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network error'))
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await expect(
      sendEvent(createEvent(), {
        endpoint: 'https://test.example.com/track',
      }),
    ).resolves.toBeUndefined()

    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('warns in debug mode when all transports fail', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network error'))
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await sendEvent(createEvent(), {
      endpoint: 'https://test.example.com/track',
      debug: true,
    })

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('transport failed'),
      expect.any(Error),
    )
  })
})
