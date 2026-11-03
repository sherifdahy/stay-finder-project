import { DEFAULT_LOCALE, isLocale, type Locale } from "@/src/domain/constants/locale";

// Picks the first supported language of an Accept-Language header, highest `q` first.
export function resolveLocale(header: string | null): Locale {
    if (!header) return DEFAULT_LOCALE;

    const candidates = header
        .split(",")
        .map((part) => {
            const [tag, ...params] = part.trim().split(";");
            const quality = params.map((param) => param.trim()).find((param) => param.startsWith("q="));

            return { language: tag.toLowerCase().split("-")[0], q: quality ? Number(quality.slice(2)) : 1 };
        })
        .filter((candidate) => Number.isFinite(candidate.q) && candidate.q > 0)
        .sort((a, b) => b.q - a.q);

    const match = candidates.find((candidate) => isLocale(candidate.language));

    return (match?.language as Locale | undefined) ?? DEFAULT_LOCALE;
}
