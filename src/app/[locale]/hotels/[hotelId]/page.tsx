import HotelDetailsPage from "@/src/features/hotels/components/details/hotel-details-page";
import { Suspense } from "react";

export default function HotelPage() {
    return (
        <Suspense fallback={<main className="p-8">Loading Hotel...</main>}>
            <HotelDetailsPage />
        </Suspense>
    );
}