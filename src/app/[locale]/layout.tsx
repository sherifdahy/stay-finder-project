import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import "../globals.css";
import { getDirection, LOCALES } from "@/src/domain/constants/locale";
import StoreProvider from "@/src/store/store-provider";
import { LanguageList, LanguageSwitcher } from "@/src/shared/ui/language-switcher";
import { SiteHeader } from "@/src/shared/ui/site-header";
import { Toaster } from "@/src/shared/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("title"), description: t("description") };
}

// Cache Components needs at least one value for the root param.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Layout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const t = await getTranslations("Nav");
  const navLinks = [
    { href: "/", label: t("hotels") },
    { href: "/bookings", label: t("bookings") },
  ];

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-clip">
        <NextIntlClientProvider>
          <SiteHeader brand={t("brand")} links={navLinks} actions={<LanguageSwitcher />} menuActions={<LanguageList />} />
          {/* makeStore() uses Math.random (RTK Query's nanoid), which Next 16 only allows inside Suspense. */}
          <Suspense fallback={null}>
            <StoreProvider>
              {children}
              <Toaster />
            </StoreProvider>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
