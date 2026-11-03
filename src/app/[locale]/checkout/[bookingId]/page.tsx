import { Suspense } from "react";
import CheckoutPage from "@/src/features/booking/components/checkout-page";
import { CheckoutSkeleton } from "@/src/features/booking/components/checkout-skeleton";

export default function CheckoutRoute() {
    return (
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutPage />
        </Suspense>
    );
}
