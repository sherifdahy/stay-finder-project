import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import StoreProvider from "../store/store-provider";
import { Toaster } from "../shared/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayFinder",
  description: "Find and book hotels in Riyadh, Jeddah and Dubai.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* makeStore() uses Math.random, which Next 16 only allows inside Suspense. */}
        <Suspense fallback={null}>
          <StoreProvider>
            {children}
            <Toaster />
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
