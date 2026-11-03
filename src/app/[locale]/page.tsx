import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SearchPage } from "@/src/features/hotels/components/search/search-page";

export default async function HomePage() {
    const t = await getTranslations("Common");

    return (
        <Suspense fallback={<main className="p-8">{t("loading")}</main>}>
            <SearchPage />
        </Suspense>
    );
}
