import "intl-pluralrules";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { BetterI18nBackend, getDeviceLocale } from "@better-i18n/expo";

i18n
  .use(BetterI18nBackend)
  .use(initReactI18next)
  .init({
    backend: {
      project: "aliosman-co/personal",
      debug: true,
      cacheExpiration: 5 * 60 * 1000, // 5 min for testing
    },
    lng: getDeviceLocale({ fallback: "en" }),
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });

export default i18n;
