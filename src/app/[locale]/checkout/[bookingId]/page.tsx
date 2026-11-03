import { Suspense } from "react";
import CheckoutPage from "@/src/features/booking/components/checkout-page";

export default function CheckoutRoute() {
    return (
        <Suspense fallback={<main className="p-8">Loading checkout...</main>}>
            <CheckoutPage />
        </Suspense>
    );
}
