import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { isLocale } from "@/src/domain/constants/locale";
import { loadMessages } from "./load-messages";

export default getRequestConfig(async () => {
    const locale = await rootLocale();

    // dynamicParams = false doesn't work with Cache Components, so validate here.
    if (!isLocale(locale)) notFound();

    return { locale, messages: await loadMessages(locale) };
});
