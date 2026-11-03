import { DEFAULT_LOCALE, type Locale } from "@/src/domain/constants/locale";
import type { LocalizedText } from "@/src/domain/types/localized-text";

export function localize(text: LocalizedText, locale: Locale): string {
    return text[locale] || text[DEFAULT_LOCALE];
}
