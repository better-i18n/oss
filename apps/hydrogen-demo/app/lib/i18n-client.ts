import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import type { Messages } from "@better-i18n/remix";

export function createI18nextInstance(locale: string, messages: Messages) {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    lng: locale,
    resources: { [locale]: messages },
    initImmediate: false,
    lowerCaseLng: true,
    defaultNS: "common",
    fallbackNS: "common",
    interpolation: { escapeValue: false },
  });
  return instance;
}
