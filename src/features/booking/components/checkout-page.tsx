"use client";

import { API_ERROR_CODE } from "@/src/domain/constants/api-error-code";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { hotelHref } from "@/src/features/hotels";
import { Link, useRouter } from "@/src/i18n/navigation";
import { formatCountdown } from "../utils/format-countdown";
import { formatMoney } from "@/src/shared/lib/format-money";
import { Alert, AlertDescription } from "@/src/shared/ui/alert";
import { buttonVariants } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import { ErrorState } from "@/src/shared/ui/error-state";
import type { Guest } from "@/src/domain/validations/guest.schema";
import { useErrorMessage } from "@/src/shared/hooks/use-error-message";
import { isApiError } from "@/src/store/baseApi";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useConfirmBookingMutation, useGetBookingByIdQuery } from "../booking.api";
import { ensureIdempotencyKey, selectIdempotencyKey } from "../bookingSlice";
import { useHoldCountdown } from "../hooks/use-hold-countdown";
import { CheckoutSkeleton } from "./checkout-skeleton";
import { GuestForm } from "./guest-form";

export default function CheckoutPage() {
    const t = useTranslations();
    const errorMessage = useErrorMessage();
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
    const [holdExpired, setHoldExpired] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const redirected = useRef(false);

    const finishBooking = useCallback(() => {
        // The success path and the effect below can both get here; only the first one counts.
        if (redirected.current) return;
        redirected.current = true;

        toast.success(t("Checkout.confirmed"));
        router.replace("/bookings");
    }, [router, t]);

    // A 500 on confirm can mean the booking went through and only the reply was lost.
    useEffect(() => {
        if (hasSubmitted && booking?.status === "confirmed") {
            finishBooking();
        }
    }, [hasSubmitted, booking?.status, finishBooking]);

    // One key per booking; every retry sends the same Idempotency-Key.
    useEffect(() => {
        dispatch(ensureIdempotencyKey(bookingId));
    }, [dispatch, bookingId]);

    async function handleConfirm(guest: Guest) {
        if (!idempotencyKey) return;
        setHasSubmitted(true);

        try {
            await confirmBooking({ bookingId, guest, idempotencyKey }).unwrap();
            finishBooking();
        } catch (error) {
            if (isApiError(error) && error.code === API_ERROR_CODE.HOLD_EXPIRED) {
                setHoldExpired(true);
                return;
            }

            // The booking may have been confirmed and only the reply lost.
            // Trying again sends the same key, so no second booking is created.
            toast.error(t("Checkout.retryMessage", { message: errorMessage(error) }));
        }
    }

    if (isLoading) {
        return <CheckoutSkeleton />;
    }

    // A failed background refetch keeps the old data; only show the error when there is nothing to show.
    if (error && !data) {
        if (isApiError(error) && error.code === API_ERROR_CODE.NOT_FOUND) {
            return (
                <main className="container flex flex-1 flex-col py-8 items-center justify-center gap-4 text-center">
                    <p>{t("Checkout.notFound")}</p>
                    <Link href="/" className={buttonVariants()}>
                        {t("Common.backToSearch")}
                    </Link>
                </main>
            );
        }

        return (
            <main className="container space-y-6 py-8">
                <ErrorState
                    message={errorMessage(error)}
                    onRetry={refetch}
                />
            </main>
        );
    }

    if (!booking) return null;

    if (booking.status === "confirmed") {
        return (
            <main className="container flex flex-1 flex-col py-8 items-center justify-center gap-4 text-center">
                <p className="font-semibold">{t("Checkout.alreadyConfirmed")}</p>
                <p className="text-sm text-muted-foreground">
                    {t("Checkout.findInBookings")}
                </p>
                <Link href="/bookings" className={buttonVariants()}>
                    {t("Checkout.goToBookings")}
                </Link>
            </main>
        );
    }

    if (booking.status === "cancelled") {
        return (
            <main className="container flex flex-1 flex-col py-8 items-center justify-center gap-4 text-center">
                <p className="font-semibold">{t("Checkout.wasCancelled")}</p>
                <p className="text-sm text-muted-foreground">
                    {t("Checkout.findInBookings")}
                </p>
                <Link href="/bookings" className={buttonVariants()}>
                    {t("Checkout.goToBookings")}
                </Link>
            </main>
        );
    }

    return (
        <main className="container space-y-6 py-8">
            <h1 className="text-xl font-bold">{t("Checkout.title")}</h1>

            {(isExpired || holdExpired) && (
                <Alert variant="destructive">
                    <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                        <span>{t("Checkout.holdExpired")}</span>
                        <Link
                            href={hotelHref(booking.hotelId, booking)}
                            className={buttonVariants({ variant: "outline" })}
                        >
                            {t("Checkout.backToHotel")}
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
                <Card className="p-4">
                    <h2 className="mb-4 font-semibold">{t("Checkout.guestDetails")}</h2>
                    <GuestForm
                        disabled={isExpired || holdExpired}
                        isSubmitting={isConfirming}
                        onSubmit={handleConfirm}
                    />
                </Card>

                <div className="order-first flex flex-col gap-4 md:order-none">
                    <Card className="gap-1 p-4">
                        <p className="text-xs text-muted-foreground">{t("Checkout.timeLeft")}</p>
                        <p
                            className={`text-3xl font-bold tabular-nums ${isExpired || holdExpired ? "text-destructive" : ""}`}
                        >
                            {formatCountdown(isExpired || holdExpired ? 0 : secondsLeft)}
                        </p>
                    </Card>

                    <Card className="gap-2 p-4">
                        <h2 className="font-semibold">{t("Checkout.yourStay")}</h2>
                        <p className="text-sm text-muted-foreground">
                            {booking.checkIn} → {booking.checkOut}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t("Common.adults", { count: booking.adults })}
                        </p>
                        <div className="flex justify-between font-semibold">
                            <span>{t("Common.total")}</span>
                            <span>{formatMoney(booking.quote.total)}</span>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
