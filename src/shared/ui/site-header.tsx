import Link from "next/link";

interface SiteHeaderLink {
    href: string;
    label: string;
}

interface SiteHeaderProps {
    brand: string;
    links: SiteHeaderLink[];
}

export function SiteHeader({ brand, links }: SiteHeaderProps) {
    return (
        <header className="border-b">
            <div className="container flex items-center justify-between gap-4 py-3">
                <Link href="/" className="text-lg font-semibold">
                    {brand}
                </Link>

                <nav aria-label="Main" className="flex items-center gap-4 text-sm">
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
            </div>
        </header>
    );
}
