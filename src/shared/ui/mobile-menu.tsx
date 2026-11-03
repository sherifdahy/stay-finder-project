"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronRight, Menu, X } from "lucide-react";
import { useLocale } from "next-intl";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, usePathname } from "@/src/i18n/navigation";
import { Button } from "@/src/shared/ui/button";

const CloseMenuContext = createContext<() => void>(() => {});

// Lets content inside the menu (the language switcher) close it before a navigation that
// replaces the whole document, which would otherwise leave the menu overlay behind.
export function useCloseMobileMenu() {
    return useContext(CloseMenuContext);
}

interface MobileMenuProps {
    brand: string;
    links: { href: string; label: string }[];
    children?: ReactNode;
}

// Full-page navigation for phones. Hidden from `sm` up, where the header shows the links itself.
export function MobileMenu({ brand, links, children }: MobileMenuProps) {
    const locale = useLocale();
    const pathname = usePathname();

    // The menu is open only for the page and language it was opened on, so navigating or
    // switching language closes it without an effect.
    const pageKey = `${locale}${pathname}`;
    const [openKey, setOpenKey] = useState<string | null>(null);

    function close() {
        setOpenKey(null);
    }

    return (
        <DialogPrimitive.Root
            open={openKey === pageKey}
            onOpenChange={(open) => setOpenKey(open ? pageKey : null)}
        >
            <DialogPrimitive.Trigger
                render={<Button variant="ghost" size="icon" className="sm:hidden" />}
            >
                <Menu />
                <span className="sr-only">Open menu</span>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Popup className="fixed inset-0 z-50 flex flex-col bg-background outline-none duration-100 data-open:animate-in data-open:fade-in-0">
                    <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>

                    <div className="container flex items-center justify-between gap-4 border-b py-2">
                        <Link href="/" onClick={close} className="text-lg font-semibold">
                            {brand}
                        </Link>
                        <DialogPrimitive.Close render={<Button variant="ghost" size="icon" />}>
                            <X />
                            <span className="sr-only">Close menu</span>
                        </DialogPrimitive.Close>
                    </div>

                    <div className="container flex flex-1 flex-col overflow-y-auto py-2">
                        <nav aria-label="Main" className="flex flex-col">
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

                        <CloseMenuContext.Provider value={close}>{children}</CloseMenuContext.Provider>
                    </div>
                </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
