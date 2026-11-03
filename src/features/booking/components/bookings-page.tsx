"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { BookingView } from "@/src/domain/types/booking";
import { isApiError } from "@/src/store/baseApi";
import { buttonVariants } from "@/src/shared/ui/button";
import { ErrorState } from "@/src/shared/ui/error-state";
import { Skeleton } from "@/src/shared/ui/skeleton";
import { useCancelBookingMutation, useGetBookingsQuery } from "../booking.api";
import { BookingCard } from "./booking-card";
import { CancelBookingDialog } from "./cancel-booking-dialog";

export default function BookingsPage() {
    const { data, error, refetch } = useGetBookingsQuery();
    const [cancelBooking] = useCancelBookingMutation();
    const [bookingToCancel, setBookingToCancel] = useState<BookingView | null>(null);

    async function handleCancel(booking: BookingView) {
        // The card shows "Cancelled" at once (optimistic update in cancelBooking).
        setBookingToCancel(null);

        try {
            await cancelBooking(booking.id).unwrap();
            toast.success("Your booking was cancelled.");
        } catch (error) {
            // cancelBooking already rolled the card back; tell the guest why.
            const reason = isApiError(error) ? error.message : "Something went wrong.";
            toast.error(`Could not cancel the booking. ${reason}`);
        }
    }

    // A failed background refetch keeps the old data; only show the error when there is nothing to show.
    if (error && !data) {
        return (
            <main className="container space-y-6 py-8">
                <h1 className="text-2xl font-bold">My bookings</h1>
                <ErrorState
                    title="Could not load your bookings"
                    message={isApiError(error) ? error.message : "Something went wrong."}
                    onRetry={refetch}
                />
            </main>
        );
    }

    if (!data) {
        return (
            <main className="container space-y-6 py-8">
                <h1 className="text-2xl font-bold">My bookings</h1>
                {[1, 2, 3].map((item) => (
                    <Skeleton key={item} className="h-36 w-full" />
                ))}
            </main>
        );
    }

    if (data.length === 0) {
        return (
            <main className="container flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
                <p className="font-semibold">No bookings yet</p>
                <p className="text-sm text-muted-foreground">
                    Find a hotel and book your first stay.
                </p>
                <Link href="/" className={buttonVariants()}>
                    Search hotels
                </Link>
            </main>
        );
    }

    // The server returns the oldest first; show the newest booking on top.
    const bookings = [...data].reverse();

    return (
        <main className="container space-y-6 py-8">
            <h1 className="text-2xl font-bold">My bookings</h1>

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
