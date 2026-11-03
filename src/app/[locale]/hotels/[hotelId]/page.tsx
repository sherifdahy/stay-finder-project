import HotelDetailsPage from "@/src/features/hotels/components/details/hotel-details-page";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function HotelPage() {
    const t = await getTranslations("Common");

    return (
        <Suspense fallback={<main className="p-8">{t("loading")}</main>}>
            <HotelDetailsPage />
        </Suspense>
    );
}