"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { isApiError } from "@/src/store/baseApi";
import { Badge } from "@/src/shared/ui/badge";
import { buttonVariants } from "@/src/shared/ui/button";
import { ErrorState } from "@/src/shared/ui/error-state";
import { Skeleton } from "@/src/shared/ui/skeleton";
import { useGetHotelDetailsQuery } from "../../hotel.api";
import { parseSearchParams } from "../../search-params";
import { RoomCard } from "./room-card";

export default function HotelDetailsPage() {

    const { hotelId } = useParams<{ hotelId: string }>();
    const searchParams = useSearchParams();
    const stay = parseSearchParams(new URLSearchParams(searchParams.toString()));
    const hasDates = Boolean(stay.checkIn && stay.checkOut);

    const { data, error, isLoading, refetch } = useGetHotelDetailsQuery(
        hasDates
            ? { hotelId, checkIn: stay.checkIn, checkOut: stay.checkOut, adults: stay.adults }
            : skipToken,
    );

    if (!hasDates) {
        return (
            <main className="mx-auto flex h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 p-8 text-center">
                <p>Select your dates first</p>
                <Link href="/" className={buttonVariants()}>
                    Back to search
                </Link>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="mx-auto w-full max-w-4xl space-y-4 p-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-40 w-full" />
            </main>
        );
    }

    if (error) {
        if (isApiError(error) && error.code === "NOT_FOUND") {
            return (
                <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                    <p>Hotel not found</p>
                    <Link href="/" className={buttonVariants()}>
                        Back to search
                    </Link>
                </main>
            );
        }

        return (
            <main className="mx-auto w-full max-w-4xl p-8">
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
        <main className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-8">
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

            <section className="space-y-4">
                {rooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        adults={stay.adults}
                        isReserving={false}
                        disabled={false}
                        onReserve={() => {}}
                    />
                ))}
            </section>
        </main>
    );
}
