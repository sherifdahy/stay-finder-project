import { useTranslations } from "next-intl";
import { API_ERROR_CODE } from "@/src/domain/constants/api-error-code";
import type { Hotel } from "@/src/domain/types/hotel";
import { useErrorMessage } from "@/src/shared/hooks/use-error-message";
import { ErrorState } from "@/src/shared/ui/error-state";
import type { HotelSearchParams } from "../../utils/search-params";
import { HotelCard } from "./hotel-card";
import { HotelResultsSkeleton } from "./search-page-skeleton";

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
    const t = useTranslations("Search");
    const errorMessage = useErrorMessage();

    if (isLoading) {
        return <HotelResultsSkeleton />;
    }

    if (error) {
        return (
            <ErrorState
                title={t("loadError")}
                message={errorMessage(error)}
                // Retrying an invalid search cannot succeed.
                onRetry={error.code === API_ERROR_CODE.VALIDATION_ERROR ? undefined : onRetry}
            />
        );
    }

    if (hotels.length === 0) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border p-6 text-center">
                <p className="font-semibold">{t("noHotels")}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                    {t("noHotelsHint")}
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
