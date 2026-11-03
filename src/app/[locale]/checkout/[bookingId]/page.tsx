import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import CheckoutPage from "@/src/features/booking/components/checkout-page";

export default async function CheckoutRoute() {
    const t = await getTranslations("Common");

    return (
        <Suspense fallback={<main className="p-8">{t("loading")}</main>}>
            <CheckoutPage />
        </Suspense>
    );
}
