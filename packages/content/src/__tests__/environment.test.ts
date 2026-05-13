import { describe, it, expect, vi, afterEach } from 'vitest'
import { isBrowser, isBuildTime, isServer, isReactNative } from '../core/environment'

describe('environment', () => {
  describe('isBrowser', () => {
    it('returns true when window is defined', () => {
      expect(isBrowser()).toBe(true)
    })
  })

  describe('isServer', () => {
    it('is inverse of isBrowser', () => {
      expect(isServer()).toBe(!isBrowser())
    })
  })

  describe('isBuildTime', () => {
    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('returns false by default', () => {
      expect(isBuildTime()).toBe(false)
    })

    it('returns true when NEXT_PHASE is phase-production-build', () => {
      vi.stubEnv('NEXT_PHASE', 'phase-production-build')
      expect(isBuildTime()).toBe(true)
    })

    it('returns true when GATSBY_BUILD_STAGE is set', () => {
      vi.stubEnv('GATSBY_BUILD_STAGE', 'build-javascript')
      expect(isBuildTime()).toBe(true)
    })

    it('returns true when ASTRO_BUILD is set', () => {
      vi.stubEnv('ASTRO_BUILD', 'true')
      expect(isBuildTime()).toBe(true)
    })
  })

  describe('isReactNative', () => {
    it('returns false in non-RN environment', () => {
      expect(isReactNative()).toBe(false)
    })
  })
})
