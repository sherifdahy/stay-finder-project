import { createTranslator } from "next-intl";
import type { Locale } from "@/src/domain/constants/locale";
import { loadMessages } from "@/src/i18n/load-messages";

// createTranslator needs no request context, so route handlers can use it.
export async function getApiTranslator(locale: Locale) {
    return createTranslator({ locale, messages: await loadMessages(locale), namespace: "ApiErrors" });
}

export type ApiTranslator = Awaited<ReturnType<typeof getApiTranslator>>;
