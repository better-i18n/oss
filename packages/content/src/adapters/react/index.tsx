import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createTracker } from '../../core/track-core'
import type {
  ContentConfig,
  EventProperties,
  TrackOptions,
} from '../../types'

interface ContentContextValue {
  track: (
    eventName: string,
    properties?: EventProperties,
    options?: TrackOptions,
  ) => void
  reset: () => void
  config: ContentConfig
}

const ContentContext = createContext<ContentContextValue | null>(null)

export interface ContentProviderProps {
  config: ContentConfig
  children: ReactNode
}

export function ContentProvider({ config, children }: ContentProviderProps) {
  const configRef = useRef({ apiKey: config.apiKey, projectId: config.projectId })
  const [tracker, setTracker] = useState(() => createTracker(config))

  useEffect(() => {
    if (
      configRef.current.apiKey === config.apiKey &&
      configRef.current.projectId === config.projectId
    ) return

    configRef.current = { apiKey: config.apiKey, projectId: config.projectId }
    setTracker(createTracker(config))
  }, [config])

  const value: ContentContextValue = {
    track: tracker.track,
    reset: tracker.reset,
    config,
  }

  return <ContentContext value={value}>{children}</ContentContext>
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error(
      '[better-i18n/content] useContent must be used within a ContentProvider',
    )
  }
  return ctx
}

export function useTrack() {
  const { track } = useContent()
  return track
}

export function useTrackView(
  eventName = 'content.view',
  properties?: EventProperties,
) {
  const { track } = useContent()
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    track(eventName, properties)
  }, [eventName, properties, track])
}
