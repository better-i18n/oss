export interface ContentConfig {
  projectId: string
  apiKey: string
  analytics?: AnalyticsConfig
}

export interface AnalyticsConfig {
  enabled?: boolean
  endpoint?: string
  debug?: boolean
  flushInterval?: number
  maxBatchSize?: number
}

export interface TrackOptions {
  identity?: IdentityOptions
  allowServer?: boolean
}

export interface IdentityOptions {
  userId?: string
  email?: string
  anonymousId?: string
}

export interface TrackEvent {
  event: string
  properties?: EventProperties
  identity?: IdentityOptions
  timestamp: string
  projectId: string
}

export type EventProperties = Record<string, string | number | boolean | null>

export interface TransportOptions {
  endpoint: string
  debug?: boolean
}

export interface ContentProviderProps {
  config: ContentConfig
  children: React.ReactNode
}
