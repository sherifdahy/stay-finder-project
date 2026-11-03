"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "cn";
import { Button } from "@/src/shared/ui/button";
import { SearchForm, type SearchFormValues } from "./search-form";

interface MobileSearchSheetProps extends SearchFormValues {
    className?: string;
    onSearch: (values: SearchFormValues) => void;
}

// Full-page search form for phones; from `md` up the sidebar shows it instead.
export function MobileSearchSheet({ className, onSearch, ...values }: MobileSearchSheetProps) {
    const t = useTranslations("Search");
    const [open, setOpen] = useState(false);

    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            {/* Floats at the end of the line: left in Arabic, right in English. */}
            <DialogPrimitive.Trigger
                render={
                    <Button
                        size="icon"
                        className={cn("fixed end-6 bottom-6 z-40 size-14 rounded-full shadow-lg", className)}
                    />
                }
            >
                <SlidersHorizontal className="size-6" />
                <span className="sr-only">{t("editSearch")}</span>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Popup className="fixed inset-0 z-50 flex flex-col bg-background outline-none duration-100 data-open:animate-in data-open:fade-in-0">
                    <div className="container flex items-center justify-between gap-4 border-b py-2">
                        <DialogPrimitive.Title className="text-lg font-semibold">
                            {t("editSearch")}
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Close render={<Button variant="ghost" size="icon" />}>
                            <X />
                            <span className="sr-only">{t("closeSearch")}</span>
                        </DialogPrimitive.Close>
                    </div>

                    {/* Mounted on open, so it starts from the URL and drops edits that were never searched. */}
                    <SearchForm
                        {...values}
                        layout="page"
                        onSearch={(next) => {
                            setOpen(false);
                            onSearch(next);
                        }}
                    />
                </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
