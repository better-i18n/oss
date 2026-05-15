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

const NO_OP_CONTEXT: ContentContextValue = {
  track: () => {},
  reset: () => {},
  config: { projectId: '', apiKey: '' },
}

const ContentContext = createContext<ContentContextValue | null>(null)

export interface ExpoContentProviderProps {
  config: ContentConfig
  children: ReactNode
}

export function ContentProvider({ config, children }: ExpoContentProviderProps) {
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

  useEffect(() => {
    let subscription: { remove: () => void } | undefined

    async function setupFlush() {
      try {
        const { AppState } = await import('react-native')
        subscription = AppState.addEventListener('change', (state) => {
          if (state === 'background' || state === 'inactive') {
            // Future: flush pending events queue
          }
        })
      } catch {
        // react-native not available
      }
    }

    setupFlush()
    return () => subscription?.remove()
  }, [])

  const value: ContentContextValue = {
    track: tracker.track,
    reset: tracker.reset,
    config,
  }

  return <ContentContext value={value}>{children}</ContentContext>
}

let warnedNoProvider = false

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    if (!warnedNoProvider && typeof console !== 'undefined') {
      warnedNoProvider = true
      console.warn(
        '[better-i18n/content] useContent called outside ContentProvider. Tracking will be disabled.',
      )
    }
    return NO_OP_CONTEXT
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
