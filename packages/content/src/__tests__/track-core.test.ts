import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTracker } from '../core/track-core'
import type { ContentConfig } from '../types'

const mockSendEvent = vi.fn().mockResolvedValue(undefined)

vi.mock('../core/transport', () => ({
  sendEvent: (...args: unknown[]) => mockSendEvent(...args),
}))

function createConfig(overrides?: Partial<ContentConfig>): ContentConfig {
  return {
    projectId: 'test-project',
    apiKey: 'test-key',
    analytics: {
      enabled: true,
      endpoint: 'https://test.example.com/track',
      debug: false,
      ...overrides?.analytics,
    },
    ...overrides,
  }
}

describe('createTracker', () => {
  beforeEach(() => {
    mockSendEvent.mockClear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('creates a tracker with track and reset functions', () => {
    const tracker = createTracker(createConfig())
    expect(typeof tracker.track).toBe('function')
    expect(typeof tracker.reset).toBe('function')
  })

  it('sends event with correct payload structure', () => {
    const tracker = createTracker(createConfig())
    tracker.track('content.view', { slug: 'hello-world' })

    expect(mockSendEvent).toHaveBeenCalledOnce()
    const [event, options] = mockSendEvent.mock.calls[0]!

    expect(event.event).toBe('content.view')
    expect(event.properties).toEqual({ slug: 'hello-world' })
    expect(event.projectId).toBe('test-project')
    expect(event.timestamp).toBeDefined()
    expect(options.endpoint).toBe('https://test.example.com/track')
  })

  it('does not send when analytics is disabled', () => {
    const tracker = createTracker(
      createConfig({ analytics: { enabled: false } }),
    )
    tracker.track('content.view')
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  it('includes identity when provided', () => {
    const tracker = createTracker(createConfig())
    tracker.track('content.view', undefined, {
      identity: { userId: 'user-123', email: 'test@example.com' },
    })

    const [event] = mockSendEvent.mock.calls[0]!
    expect(event.identity).toEqual({
      userId: 'user-123',
      email: 'test@example.com',
    })
  })

  it('skips tracking during build time', () => {
    vi.stubEnv('NEXT_PHASE', 'phase-production-build')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const tracker = createTracker(createConfig())
    tracker.track('content.view')

    expect(mockSendEvent).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('build time'),
    )
    warnSpy.mockRestore()
  })

  it('uses default endpoint when none provided', () => {
    const tracker = createTracker({
      projectId: 'test',
      apiKey: 'key',
    })
    tracker.track('content.view')

    const [, options] = mockSendEvent.mock.calls[0]!
    expect(options.endpoint).toBe('https://content.better-i18n.com/v1/track')
  })

  it('reset does not throw', () => {
    const tracker = createTracker(createConfig())
    expect(() => tracker.reset()).not.toThrow()
  })

  describe('property validation', () => {
    it('accepts string, number, boolean, null properties', () => {
      const tracker = createTracker(createConfig())
      tracker.track('test', {
        name: 'hello',
        count: 42,
        active: true,
        removed: null,
      })

      const [event] = mockSendEvent.mock.calls[0]!
      expect(event.properties).toEqual({
        name: 'hello',
        count: 42,
        active: true,
        removed: null,
      })
    })

    it('throws on nested object in non-production', () => {
      vi.stubEnv('NODE_ENV', 'development')
      const tracker = createTracker(createConfig())

      expect(() =>
        tracker.track('test', {
          nested: { key: 'value' } as unknown as string,
        }),
      ).toThrow('Invalid property "nested"')
    })

    it('strips invalid properties in production with debug warning', () => {
      vi.stubEnv('NODE_ENV', 'production')
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const tracker = createTracker(
        createConfig({ analytics: { enabled: true, debug: true } }),
      )

      tracker.track('test', {
        valid: 'yes',
        invalid: [1, 2, 3] as unknown as string,
      })

      const [event] = mockSendEvent.mock.calls[0]!
      expect(event.properties).toEqual({ valid: 'yes' })
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid property "invalid"'),
      )
      warnSpy.mockRestore()
    })
  })
})
