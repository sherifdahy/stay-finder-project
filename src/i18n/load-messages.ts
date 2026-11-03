import type { Locale } from "@/src/domain/constants/locale";

export async function loadMessages(locale: Locale) {
    return (await import(`@/messages/${locale}.json`)).default;
}
