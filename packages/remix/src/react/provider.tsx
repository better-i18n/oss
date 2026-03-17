"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { IntlProvider } from "use-intl";
import type { LanguageOption, Messages } from "@better-i18n/core";

interface RemixI18nContextValue {
  locale: string;
  languages: LanguageOption[];
}

const RemixI18nContext = createContext<RemixI18nContextValue | null>(null);

export interface RemixI18nProviderProps {
  locale: string;
  messages: Messages;
  languages?: LanguageOption[];
  timeZone?: string;
  now?: Date;
  onError?: (error: Error) => void;
  children: ReactNode;
}

export function RemixI18nProvider({
  locale,
  messages,
  languages = [],
  timeZone,
  now,
  onError,
  children,
}: RemixI18nProviderProps) {
  const ctx = useMemo(() => ({ locale, languages }), [locale, languages]);
  return (
    <RemixI18nContext.Provider value={ctx}>
      <IntlProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
        now={now}
        onError={onError ?? (() => {})}
      >
        {children as any}
      </IntlProvider>
    </RemixI18nContext.Provider>
  );
}

export function useRemixI18n(): RemixI18nContextValue {
  const ctx = useContext(RemixI18nContext);
  if (!ctx)
    throw new Error(
      "[better-i18n] useRemixI18n must be used within RemixI18nProvider",
    );
  return ctx;
}
