import type { AppLanguage } from "@/i18n";

const localeOf = (language: AppLanguage) => (language === "bn" ? "bn-BD" : "en-US");

export function formatNumber(value: number, language: AppLanguage): string {
  return new Intl.NumberFormat(localeOf(language)).format(value);
}

export function formatMoney(value: number, language: AppLanguage): string {
  const amount = new Intl.NumberFormat(localeOf(language), {
    maximumFractionDigits: 0,
  }).format(value);
  return language === "bn" ? `৳${amount}` : `BDT ${amount}`;
}

export function formatDate(iso: string, language: AppLanguage): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(localeOf(language), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
