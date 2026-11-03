"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { hotelHref } from "@/src/features/hotels/search-params";
import { formatMoney } from "@/src/shared/lib/format-money";
import { Alert, AlertDescription, AlertTitle } from "@/src/shared/ui/alert";
import { buttonVariants } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import { ErrorState } from "@/src/shared/ui/error-state";
import { Skeleton } from "@/src/shared/ui/skeleton";
import { isApiError } from "@/src/store/baseApi";
import { useGetBookingByIdQuery } from "../booking.api";
import { useHoldCountdown } from "../hooks/use-hold-countdown";

const MAIN_CLASS = "mx-auto w-full max-w-2xl space-y-6 p-4 sm:p-8";
const CENTERED_CLASS =
    "mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 p-8 text-center";

function formatCountdown(seconds: number | null): string {
    if (seconds === null) return "--:--";

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    return `${mm}:${ss}`;
}

export default function CheckoutPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const { data, error, isLoading, refetch } = useGetBookingByIdQuery(bookingId);
    const booking = data?.booking;
    const secondsLeft = useHoldCountdown(booking?.holdExpiresAt ?? null);
    const isExpired = booking?.status === "expired" || secondsLeft === 0;

    if (isLoading) {
        return (
            <main className={MAIN_CLASS}>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-40 w-full" />
            </main>
        );
    }

    if (error) {
        if (isApiError(error) && error.code === "NOT_FOUND") {
            return (
                <main className={CENTERED_CLASS}>
                    <p>Booking not found</p>
                    <Link href="/" className={buttonVariants()}>
                        Back to search
                    </Link>
                </main>
            );
        }

        return (
            <main className={MAIN_CLASS}>
                <ErrorState
                    message={isApiError(error) ? error.message : "Something went wrong."}
                    onRetry={refetch}
                />
            </main>
        );
    }

    if (!booking) return null;

    if (booking.status === "confirmed") {
        return (
            <main className={CENTERED_CLASS}>
                <p>This booking is already confirmed</p>
                <Link href="/bookings" className={buttonVariants()}>
                    View my bookings
                </Link>
            </main>
        );
    }

    return (
        <main className={MAIN_CLASS}>
            <h1 className="text-2xl font-bold">Checkout</h1>

            <Card className="gap-3 p-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span>{booking.checkIn}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span>{booking.checkOut}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span>{booking.adults}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Total</span>
                    <span>{formatMoney(booking.quote.total)}</span>
                </div>
            </Card>

            {isExpired ? (
                <Alert variant="destructive">
                    <AlertTitle>Your hold has expired</AlertTitle>
                    <AlertDescription>
                        <Link
                            href={hotelHref(booking.hotelId, booking)}
                            className={buttonVariants({ variant: "outline" })}
                        >
                            Back to hotel
                        </Link>
                    </AlertDescription>
                </Alert>
            ) : (
                <p className="text-lg font-semibold">
                    Time left: {formatCountdown(secondsLeft)}
                </p>
            )}
        </main>
    );
}
