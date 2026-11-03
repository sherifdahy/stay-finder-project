"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { hotelHref } from "@/src/features/hotels/search-params";
import { formatMoney } from "@/src/shared/lib/format-money";
import { Alert, AlertDescription } from "@/src/shared/ui/alert";
import { buttonVariants } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import { ErrorState } from "@/src/shared/ui/error-state";
import { Skeleton } from "@/src/shared/ui/skeleton";
import { isApiError } from "@/src/store/baseApi";
import { useGetBookingByIdQuery } from "../booking.api";
import { useHoldCountdown } from "../hooks/use-hold-countdown";

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
            <main className="container mx-auto space-y-6 px-4 py-8">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-40 w-full" />
            </main>
        );
    }

    if (error) {
        if (isApiError(error) && error.code === "NOT_FOUND") {
            return (
                <main className="container mx-auto flex flex-1 flex-col px-4 py-8 items-center justify-center gap-4 text-center">
                    <p>Booking not found</p>
                    <Link href="/" className={buttonVariants()}>
                        Back to search
                    </Link>
                </main>
            );
        }

        return (
            <main className="container mx-auto space-y-6 px-4 py-8">
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
            <main className="container mx-auto flex flex-1 flex-col px-4 py-8 items-center justify-center gap-4 text-center">
                <p className="font-semibold">This booking is already confirmed</p>
                <p className="text-sm text-muted-foreground">
                    You can find it in your bookings.
                </p>
                <Link href="/bookings" className={buttonVariants()}>
                    Go to my bookings
                </Link>
            </main>
        );
    }

    return (
        <main className="container mx-auto space-y-6 px-4 py-8">
            <h1 className="text-xl font-bold">Complete your booking</h1>

            {isExpired && (
                <Alert variant="destructive">
                    <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                        <span>Your hold has expired. The room was released.</span>
                        <Link
                            href={hotelHref(booking.hotelId, booking)}
                            className={buttonVariants({ variant: "outline" })}
                        >
                            Back to hotel
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
                <Card className="p-4">
                    <h2 className="font-semibold">Guest details</h2>
                </Card>

                <div className="order-first flex flex-col gap-4 md:order-none">
                    <Card className="gap-1 p-4">
                        <p className="text-xs text-muted-foreground">Time left</p>
                        <p
                            className={`text-3xl font-bold tabular-nums ${isExpired ? "text-destructive" : ""}`}
                        >
                            {formatCountdown(isExpired ? 0 : secondsLeft)}
                        </p>
                    </Card>

                    <Card className="gap-2 p-4">
                        <h2 className="font-semibold">Your stay</h2>
                        <p className="text-sm text-muted-foreground">
                            {booking.checkIn} → {booking.checkOut}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {booking.adults} {booking.adults === 1 ? "adult" : "adults"}
                        </p>
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{formatMoney(booking.quote.total)}</span>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
