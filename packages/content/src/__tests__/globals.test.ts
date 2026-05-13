import { describe, it, expect } from 'vitest'
import { win, nav, doc, getSendBeacon } from '../core/globals'

describe('globals', () => {
  it('win is defined in browser-like environment', () => {
    expect(win).toBeDefined()
  })

  it('nav is defined in browser-like environment', () => {
    expect(nav).toBeDefined()
  })

  it('doc is defined in browser-like environment', () => {
    expect(doc).toBeDefined()
  })

  it('getSendBeacon returns undefined when sendBeacon is unavailable', () => {
    // jsdom does not implement sendBeacon
    const beacon = getSendBeacon()
    expect(beacon).toBeUndefined()
  })
})
