import { API_ERROR_CODE } from "@/src/domain/constants/api-error-code";
import type { Hotel } from "@/src/domain/types/hotel";
import { ErrorState } from "@/src/shared/ui/error-state";
import { Skeleton } from "@/src/shared/ui/skeleton";
import type { HotelSearchParams } from "../../search-params";
import { HotelCard } from "./hotel-card";

interface HotelResultsProps {
    hotels: (Hotel & { fromTotal: number })[];
    stay: Pick<HotelSearchParams, "checkIn" | "checkOut" | "adults">;
    isLoading: boolean;
    error?: { code: string; message: string };
    onRetry: () => void;
}

export function HotelResults({
    hotels,
    stay,
    isLoading,
    error,
    onRetry,
}: HotelResultsProps) {
    if (isLoading) {
        return (
            <div className="space-y-4" aria-busy="true">
                {[1, 2, 3].map((item) => (
                    <Skeleton key={item} className="h-48 w-full" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <ErrorState
                title="Could not load hotels"
                message={error.message}
                // Retrying an invalid search cannot succeed.
                onRetry={error.code === API_ERROR_CODE.VALIDATION_ERROR ? undefined : onRetry}
            />
        );
    }

    if (hotels.length === 0) {
        return (
            <div className="rounded-xl border p-6 text-center">
                <p className="font-semibold">No hotels found.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Try changing your dates or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} stay={stay} />
            ))}
        </div>
    );
}
