"use client";

import { useEffect, useMemo, useState } from "react";
import { createI18nCore } from "@better-i18n/core";
import type { LanguageOption } from "@better-i18n/core";

import { normalizeConfig } from "./config";
import type { I18nConfig } from "./types";

export type UseManifestLanguagesResult = {
  languages: LanguageOption[];
  isLoading: boolean;
  error: Error | null;
};

type ClientCacheEntry = {
  data?: LanguageOption[];
  error?: Error;
  promise?: Promise<LanguageOption[]>;
};

// Client-side request deduplication cache
const clientCache = new Map<string, ClientCacheEntry>();

const getCacheKey = (project: string, cdnBaseUrl?: string) =>
  `${cdnBaseUrl || "https://cdn.better-i18n.com"}|${project}`;

/**
 * React hook to fetch manifest languages on the client
 *
 * Uses `createI18nCore` from `@better-i18n/core` internally with
 * request deduplication to prevent duplicate fetches.
 *
 * @example
 * ```tsx
 * const { languages, isLoading, error } = useManifestLanguages({
 *   project: 'acme/dashboard',
 *   defaultLocale: 'en',
 * })
 *
 * if (isLoading) return <Spinner />
 * if (error) return <Error message={error.message} />
 *
 * return (
 *   <select>
 *     {languages.map(lang => (
 *       <option key={lang.code} value={lang.code}>
 *         {lang.nativeName || lang.name || lang.code}
 *       </option>
 *     ))}
 *   </select>
 * )
 * ```
 */
export const useManifestLanguages = (config: I18nConfig): UseManifestLanguagesResult => {
  const normalized = useMemo(
    () => normalizeConfig(config),
    [
      config.project,
      config.defaultLocale,
      config.cdnBaseUrl,
      config.debug,
      config.logLevel,
    ],
  );

  const i18nCore = useMemo(
    () =>
      createI18nCore({
        project: normalized.project,
        defaultLocale: normalized.defaultLocale,
        cdnBaseUrl: normalized.cdnBaseUrl,
        debug: normalized.debug,
        logLevel: normalized.logLevel,
      }),
    [normalized],
  );

  const cacheKey = getCacheKey(normalized.project, normalized.cdnBaseUrl);
  const cached = clientCache.get(cacheKey);

  const [languages, setLanguages] = useState<LanguageOption[]>(cached?.data ?? []);
  const [isLoading, setIsLoading] = useState(!cached?.data);
  const [error, setError] = useState<Error | null>(cached?.error ?? null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      const entry = clientCache.get(cacheKey) ?? {};

      // Return cached data if available
      if (entry.data) {
        if (isMounted) {
          setLanguages(entry.data);
          setIsLoading(false);
        }
        return;
      }

      // Deduplicate in-flight requests
      if (!entry.promise) {
        entry.promise = i18nCore
          .getLanguages()
          .then((langs) => {
            clientCache.set(cacheKey, { data: langs });
            return langs;
          })
          .catch((err) => {
            const error = err instanceof Error ? err : new Error(String(err));
            clientCache.set(cacheKey, { error });
            throw error;
          });
        clientCache.set(cacheKey, entry);
      }

      try {
        const langs = await entry.promise;
        if (isMounted) {
          setLanguages(langs);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [cacheKey, i18nCore]);

  return { languages, isLoading, error };
};
