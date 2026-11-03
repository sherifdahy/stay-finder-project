"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { isApiError } from "@/src/store/baseApi";
import { Alert, AlertDescription } from "@/src/shared/ui/alert";
import { Badge } from "@/src/shared/ui/badge";
import { buttonVariants } from "@/src/shared/ui/button";
import { ErrorState } from "@/src/shared/ui/error-state";
import { Skeleton } from "@/src/shared/ui/skeleton";
import { useGetHotelDetailsQuery } from "../../hotel.api";
import { parseSearchParams } from "../../search-params";
import { PriceChangedDialog } from "./price-changed-dialog";
import { RoomCard } from "./room-card";
import { HotelRoom } from "../../dtos/details/hotel-room.dto";
import { useCreateHoldMutation } from "@/src/features/booking/booking.api";
import { useState } from "react";
import { Quote } from "@/src/domain/types/quote";

export default function HotelDetailsPage() {

    const { hotelId } = useParams<{ hotelId: string }>();
    const searchParams = useSearchParams();
    const stay = parseSearchParams(new URLSearchParams(searchParams.toString()));
    const hasDates = Boolean(stay.checkIn && stay.checkOut);

    const router = useRouter();
    const [createHold, { isLoading: isReserving }] = useCreateHoldMutation();
    const [reservingRoomId, setReservingRoomId] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [priceChange, setPriceChange] = useState<{
        room: HotelRoom;
        oldTotal: number;
        newTotal: number;
    } | null>(null);

    async function reserve(room: HotelRoom, quotedTotal: number) {
        setMessage(null);
        setReservingRoomId(room.id);

        try {
            const { booking } = await createHold({
                hotelId,
                roomId: room.id,
                checkIn: stay.checkIn,
                checkOut: stay.checkOut,
                adults: stay.adults,
                quotedTotal,
            }).unwrap();

            router.push(`/checkout/${booking.id}`);
        } catch (error) {
            if (isApiError(error) && error.code === "PRICE_CHANGED") {
                const { newQuote } = error.details as { newQuote: Quote };
                setPriceChange({ room, oldTotal: quotedTotal, newTotal: newQuote.total });
                return;
            }

            setPriceChange(null);
            setMessage(isApiError(error) ? error.message : "Something went wrong.");
        } finally {
            setReservingRoomId(null);
        }
    }

    const { data, error, isLoading, refetch } = useGetHotelDetailsQuery(
        hasDates
            ? { hotelId, checkIn: stay.checkIn, checkOut: stay.checkOut, adults: stay.adults }
            : skipToken,
    );

    if (!hasDates) {
        return (
            <main className="container flex flex-1 flex-col py-8 items-center justify-center gap-4 text-center">
                <p>Select your dates first</p>
                <Link href="/" className={buttonVariants()}>
                    Back to search
                </Link>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="container space-y-6 py-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-40 w-full" />
            </main>
        );
    }

    // A failed background refetch keeps the old data; only show the error when there is nothing to show.
    if (error && !data) {
        if (isApiError(error) && error.code === "NOT_FOUND") {
            return (
                <main className="container flex flex-1 flex-col py-8 items-center justify-center gap-4 text-center">
                    <p>Hotel not found</p>
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

    if (!data) return null;

    const { hotel, rooms } = data;

    return (
        <main className="container space-y-6 py-8">
            <img
                src={hotel.image}
                alt={hotel.name}
                className="h-64 w-full rounded-xl object-cover"
            />

            <section className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-2xl font-bold">{hotel.name}</h1>
                    <span aria-label={`${hotel.stars} stars`}>
                        {"★".repeat(hotel.stars)}
                    </span>
                </div>

                <p className="text-sm capitalize text-muted-foreground">
                    {hotel.city} · Rating {hotel.rating}
                </p>

                <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">
                            {amenity}
                        </Badge>
                    ))}
                </div>
            </section>

            {message && (
                <Alert variant="destructive">
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            <section className="space-y-4">
                {rooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        adults={stay.adults}
                        isReserving={reservingRoomId === room.id}
                        disabled={isReserving}
                        onReserve={() => reserve(room, room.quote.total)}
                    />
                ))}
            </section>

            <PriceChangedDialog
                open={priceChange !== null}
                oldTotal={priceChange?.oldTotal ?? 0}
                newTotal={priceChange?.newTotal ?? 0}
                isSubmitting={isReserving}
                onAccept={() => priceChange && reserve(priceChange.room, priceChange.newTotal)}
                onCancel={() => setPriceChange(null)}
            />
        </main>
    );
}
