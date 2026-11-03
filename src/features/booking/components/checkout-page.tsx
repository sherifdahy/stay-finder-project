"use client";

import { API_ERROR_CODE } from "@/src/domain/constants/api-error-code";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { hotelHref } from "@/src/features/hotels/search-params";
import { formatCountdown } from "../utils/format-countdown";
import { formatMoney } from "@/src/shared/lib/format-money";
import { Alert, AlertDescription } from "@/src/shared/ui/alert";
import { buttonVariants } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import { ErrorState } from "@/src/shared/ui/error-state";
import { Skeleton } from "@/src/shared/ui/skeleton";
import type { Guest } from "@/src/domain/validations/guest.schema";
import { isApiError } from "@/src/store/baseApi";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useConfirmBookingMutation, useGetBookingByIdQuery } from "../booking.api";
import { ensureIdempotencyKey, selectIdempotencyKey } from "../bookingSlice";
import { useHoldCountdown } from "../hooks/use-hold-countdown";
import { GuestForm } from "./guest-form";

export default function CheckoutPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const { data, error, isLoading, refetch, fulfilledTimeStamp } = useGetBookingByIdQuery(bookingId);
    const booking = data?.booking;
    const secondsLeft = useHoldCountdown(
        booking?.holdExpiresAt ?? null,
        data?.serverTime,
        fulfilledTimeStamp,
    );
    const isExpired = booking?.status === "expired" || secondsLeft === 0;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const idempotencyKey = useAppSelector((state) => selectIdempotencyKey(state, bookingId));
    const [confirmBooking, { isLoading: isConfirming }] = useConfirmBookingMutation();
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [holdExpired, setHoldExpired] = useState(false);

    // One key per booking; every retry sends the same Idempotency-Key.
    useEffect(() => {
        dispatch(ensureIdempotencyKey(bookingId));
    }, [dispatch, bookingId]);

    async function handleConfirm(guest: Guest) {
        if (!idempotencyKey) return;
        setConfirmError(null);

        try {
            await confirmBooking({ bookingId, guest, idempotencyKey }).unwrap();
            toast.success("Your booking is confirmed!");
            router.replace("/bookings");
        } catch (error) {
            if (isApiError(error) && error.code === API_ERROR_CODE.HOLD_EXPIRED) {
                setHoldExpired(true);
                return;
            }

            // The booking may have been confirmed and only the reply lost.
            // Trying again sends the same key, so no second booking is created.
            setConfirmError(
                `${isApiError(error) ? error.message : "Something went wrong."} Please try again.`,
            );
        }
    }

    if (isLoading) {
        return (
            <main className="container space-y-6 py-8">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-40 w-full" />
            </main>
        );
    }

    // A failed background refetch keeps the old data; only show the error when there is nothing to show.
    if (error && !data) {
        if (isApiError(error) && error.code === API_ERROR_CODE.NOT_FOUND) {
            return (
                <main className="container flex flex-1 flex-col py-8 items-center justify-center gap-4 text-center">
                    <p>Booking not found</p>
                    <Link href="/" className={buttonVariants()}>
                        Back to search
                    </Link>
                </main>
            );
        }

        return (
            <main className="container space-y-6 py-8">
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
            <main className="container flex flex-1 flex-col py-8 items-center justify-center gap-4 text-center">
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

    if (booking.status === "cancelled") {
        return (
            <main className="container flex flex-1 flex-col py-8 items-center justify-center gap-4 text-center">
                <p className="font-semibold">This booking was cancelled</p>
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
        <main className="container space-y-6 py-8">
            <h1 className="text-xl font-bold">Complete your booking</h1>

            {(isExpired || holdExpired) && (
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
                    <h2 className="mb-4 font-semibold">Guest details</h2>
                    <GuestForm
                        disabled={isExpired || holdExpired}
                        isSubmitting={isConfirming}
                        error={confirmError}
                        onSubmit={handleConfirm}
                    />
                </Card>

                <div className="order-first flex flex-col gap-4 md:order-none">
                    <Card className="gap-1 p-4">
                        <p className="text-xs text-muted-foreground">Time left</p>
                        <p
                            className={`text-3xl font-bold tabular-nums ${isExpired || holdExpired ? "text-destructive" : ""}`}
                        >
                            {formatCountdown(isExpired || holdExpired ? 0 : secondsLeft)}
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
