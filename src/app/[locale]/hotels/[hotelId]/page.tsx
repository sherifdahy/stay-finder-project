import { Suspense } from "react";
import HotelDetailsPage from "@/src/features/hotels/components/details/hotel-details-page";
import { HotelDetailsSkeleton } from "@/src/features/hotels/components/details/hotel-details-skeleton";

export default function HotelPage() {
    return (
        <Suspense fallback={<HotelDetailsSkeleton />}>
            <HotelDetailsPage />
        </Suspense>
    );
}
