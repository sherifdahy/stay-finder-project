"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import type { BookingView } from "@/src/domain/types/booking";
import { Link } from "@/src/i18n/navigation";
import { useErrorMessage } from "@/src/shared/hooks/use-error-message";
import { buttonVariants } from "@/src/shared/ui/button";
import { ErrorState } from "@/src/shared/ui/error-state";
import { Skeleton } from "@/src/shared/ui/skeleton";
import { useCancelBookingMutation, useGetBookingsQuery } from "../booking.api";
import { BookingCard } from "./booking-card";
import { CancelBookingDialog } from "./cancel-booking-dialog";

export default function BookingsPage() {
    const t = useTranslations();
    const errorMessage = useErrorMessage();
    const { data, error, refetch } = useGetBookingsQuery();
    const [cancelBooking] = useCancelBookingMutation();
    const [bookingToCancel, setBookingToCancel] = useState<BookingView | null>(null);

    async function handleCancel(booking: BookingView) {
        // The card shows "Cancelled" at once (optimistic update in cancelBooking).
        setBookingToCancel(null);

        try {
            await cancelBooking(booking.id).unwrap();
            toast.success(t("Bookings.cancelled"));
        } catch (error) {
            // cancelBooking already rolled the card back; tell the guest why.
            toast.error(t("Bookings.cancelFailed", { reason: errorMessage(error) }));
        }
    }

    // A failed background refetch keeps the old data; only show the error when there is nothing to show.
    if (error && !data) {
        return (
            <main className="container space-y-6 py-8">
                <h1 className="text-page-title">{t("Nav.bookings")}</h1>
                <ErrorState
                    title={t("Bookings.loadError")}
                    message={errorMessage(error)}
                    onRetry={refetch}
                />
            </main>
        );
    }

    if (!data) {
        return (
            <main className="container space-y-6 py-8">
                <h1 className="text-page-title">{t("Nav.bookings")}</h1>
                {[1, 2, 3].map((item) => (
                    <Skeleton key={item} className="h-36 w-full" />
                ))}
            </main>
        );
    }

    if (data.length === 0) {
        return (
            <main className="container flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
                <p className="font-semibold">{t("Bookings.empty")}</p>
                <p className="text-sm text-muted-foreground">
                    {t("Bookings.emptyHint")}
                </p>
                <Link href="/" className={buttonVariants()}>
                    {t("Bookings.searchHotels")}
                </Link>
            </main>
        );
    }

    // The server returns the oldest first; show the newest booking on top.
    const bookings = [...data].reverse();

    return (
        <main className="container space-y-6 py-8">
            <h1 className="text-page-title">{t("Nav.bookings")}</h1>

            <section className="space-y-4">
                {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} onCancel={() => setBookingToCancel(booking)} />
                ))}
            </section>

            <CancelBookingDialog
                booking={bookingToCancel}
                onConfirm={handleCancel}
                onClose={() => setBookingToCancel(null)}
            />
        </main>
    );
}
