import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link } from "@/src/i18n/navigation";
import { MobileMenu } from "./mobile-menu";

interface SiteHeaderLink {
    href: string;
    label: string;
}

interface SiteHeaderProps {
    brand: string;
    links: SiteHeaderLink[];
    actions?: ReactNode;
    menuActions?: ReactNode;
}

export function SiteHeader({ brand, links, actions, menuActions }: SiteHeaderProps) {
    const t = useTranslations("Nav");

    return (
        // White (card) over the tinted page background, so the bar stands apart.
        <header className="sticky top-0 z-40 border-b bg-card sm:static">
            <div className="container flex items-center justify-between gap-4 py-4 sm:py-3">
                <Link href="/" className="text-lg font-bold text-primary">
                    {brand}
                </Link>

                <nav aria-label={t("main")} className="hidden items-center gap-4 text-sm sm:ms-auto sm:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden sm:block">{actions}</div>

                <MobileMenu brand={brand} links={links}>
                    {menuActions}
                </MobileMenu>
            </div>
        </header>
    );
}
