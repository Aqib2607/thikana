import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { bn } from "./bn";
import { en } from "./en";

export const SUPPORTED_LANGUAGES = ["bn", "en"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = "thikana.language";

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      bn: { translation: bn },
      en: { translation: en },
    },
    // Bangla is always the SSR/default language; a stored preference is
    // applied after hydration to avoid markup mismatches.
    lng: "bn",
    fallbackLng: "bn",
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: { escapeValue: false },
  });
}

export function readStoredLanguage(): AppLanguage | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === "bn" || stored === "en" ? stored : null;
}

export default i18n;
