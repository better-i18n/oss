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

export interface ExpoContentProviderProps {
  config: ContentConfig
  children: ReactNode
}

export function ContentProvider({ config, children }: ExpoContentProviderProps) {
  const initRef = useRef<{ apiKey: string; projectId: string } | null>(null)
  const [tracker, setTracker] = useState<ReturnType<typeof createTracker> | null>(null)

  useEffect(() => {
    const key = { apiKey: config.apiKey, projectId: config.projectId }
    if (
      initRef.current?.apiKey === key.apiKey &&
      initRef.current?.projectId === key.projectId
    ) return

    initRef.current = key
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

  const value: ContentContextValue | null = tracker
    ? { track: tracker.track, reset: tracker.reset, config }
    : null

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
