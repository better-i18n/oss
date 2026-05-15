export interface ContentConfig {
  /**
   * Project identifier in `org/project` slug format (e.g. `"acme/web-app"`).
   *
   * Find it in the dashboard under Settings → General → Project ID, or read
   * it off the dashboard URL: `dash.better-i18n.com/{org}/{project}`.
   *
   * The value is a stable identifier — even when you rename the project's
   * display name in the dashboard, this slug stays the same.
   */
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
  apiKey: string
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
