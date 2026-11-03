"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { LOCALES, type Locale } from "@/src/domain/constants/locale";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { cn } from "cn";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/shared/ui/collapsible";
import { useCloseMobileMenu } from "@/src/shared/ui/mobile-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/shared/ui/select";

// Each language is named in itself, whatever the page language is.
const LOCALE_NAMES: Record<Locale, string> = { en: "English", ar: "العربية" };

const ITEMS = LOCALES.map((value) => ({ value, label: LOCALE_NAMES[value] }));

function useSwitchLocale() {
    const pathname = usePathname();
    const router = useRouter();
    const closeMenu = useCloseMobileMenu();

    return function switchTo(next: Locale) {
        closeMenu();
        // Read the query at click time: useSearchParams would force a Suspense boundary around the header.
        router.replace(`${pathname}${window.location.search}`, { locale: next });
    };
}

// Dropdown for the desktop header.
export function LanguageSwitcher() {
    const locale = useLocale();
    const switchTo = useSwitchLocale();

    return (
        <Select
            modal={false}
            items={ITEMS}
            value={locale}
            onValueChange={(value) => value && switchTo(value as Locale)}
        >
            <SelectTrigger size="sm" aria-label="Language" className="w-32">
                <span className="flex items-center gap-2">
                    <Languages className="text-muted-foreground" />
                    <SelectValue />
                </span>
            </SelectTrigger>
            <SelectContent align="end">
                {ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value} lang={item.value}>
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

// Row that expands in place, for the mobile menu.
export function LanguageList() {
    const locale = useLocale();
    const switchTo = useSwitchLocale();

    return (
        <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 border-b py-4 text-lg font-medium">
                <span className="flex items-center gap-3">
                    <Languages className="size-5 text-muted-foreground" />
                    <span lang={locale}>{LOCALE_NAMES[locale]}</span>
                </span>
                <ChevronDown className="size-5 text-muted-foreground transition-transform group-data-panel-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <ul className="ms-2.5 border-s ps-4">
                    {ITEMS.map((item) => (
                        <li key={item.value}>
                            <button
                                type="button"
                                lang={item.value}
                                aria-current={item.value === locale ? "true" : undefined}
                                onClick={() => switchTo(item.value)}
                                className={cn(
                                    "flex w-full items-center justify-between py-3 text-base",
                                    item.value === locale
                                        ? "font-medium text-foreground"
                                        : "text-muted-foreground",
                                )}
                            >
                                {item.label}
                                {item.value === locale && <Check className="size-4" />}
                            </button>
                        </li>
                    ))}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    );
}
