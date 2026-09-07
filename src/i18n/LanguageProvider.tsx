import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

import i18n, { LANGUAGE_STORAGE_KEY, readStoredLanguage, type AppLanguage } from "./index";

export function useLanguage() {
  const { t, i18n: instance } = useTranslation();
  const language = (instance.language === "en" ? "en" : "bn") as AppLanguage;

  const setLanguage = (next: AppLanguage) => {
    void instance.changeLanguage(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      document.documentElement.lang = next;
    }
  };

  return { language, setLanguage, t };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stored = readStoredLanguage();
    if (stored && stored !== i18n.language) {
      void i18n.changeLanguage(stored);
    }
    document.documentElement.lang = stored ?? i18n.language ?? "bn";
  }, []);

  return <>{children}</>;
}
