"use client";

import { useLocale } from "next-intl";
import { LOCALES, type Locale } from "@/src/domain/constants/locale";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { Button } from "@/src/shared/ui/button";

// Each language is named in itself, whatever the page language is.
const LOCALE_NAMES: Record<Locale, string> = { en: "English", ar: "العربية" };

export function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    function switchTo(next: Locale) {
        // Read the query at click time: useSearchParams would force a Suspense boundary around the header.
        router.replace(`${pathname}${window.location.search}`, { locale: next });
    }

    return (
        <div className="flex items-center gap-1">
            {LOCALES.map((item) => (
                <Button
                    key={item}
                    type="button"
                    variant={item === locale ? "secondary" : "ghost"}
                    size="sm"
                    lang={item}
                    aria-current={item === locale ? "true" : undefined}
                    onClick={() => switchTo(item)}
                >
                    {LOCALE_NAMES[item]}
                </Button>
            ))}
        </div>
    );
}
