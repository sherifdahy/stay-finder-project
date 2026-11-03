export const LOCALES = ["en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

const RTL_LOCALES: readonly Locale[] = ["ar"];

export function isLocale(value: unknown): value is Locale {
    return LOCALES.includes(value as Locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
    return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}