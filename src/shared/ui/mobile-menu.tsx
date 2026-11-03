"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/src/shared/ui/button";

interface MobileMenuProps {
    brand: string;
    links: { href: string; label: string }[];
    children?: ReactNode;
}

// Full-page navigation for phones. Hidden from `sm` up, where the header shows the links itself.
export function MobileMenu({ brand, links, children }: MobileMenuProps) {
    const t = useTranslations("Nav");
    const [open, setOpen] = useState(false);

    function close() {
        setOpen(false);
    }

    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger
                render={<Button variant="ghost" size="icon" className="sm:hidden" />}
            >
                <Menu />
                <span className="sr-only">{t("openMenu")}</span>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Popup className="fixed inset-0 z-50 flex flex-col bg-background outline-none duration-100 data-open:animate-in data-open:fade-in-0">
                    <DialogPrimitive.Title className="sr-only">{t("menu")}</DialogPrimitive.Title>

                    <div className="container flex items-center justify-between gap-4 border-b py-2">
                        <Link href="/" onClick={close} className="text-lg font-semibold">
                            {brand}
                        </Link>
                        <DialogPrimitive.Close render={<Button variant="ghost" size="icon" />}>
                            <X />
                            <span className="sr-only">{t("closeMenu")}</span>
                        </DialogPrimitive.Close>
                    </div>

                    <div className="container flex flex-1 flex-col overflow-y-auto py-2">
                        <nav aria-label={t("main")} className="flex flex-col">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={close}
                                    className="flex items-center justify-between gap-3 border-b py-4 text-lg font-medium"
                                >
                                    {link.label}
                                    <ChevronRight className="size-5 text-muted-foreground rtl:rotate-180" />
                                </Link>
                            ))}
                        </nav>

                        {children}
                    </div>
                </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
