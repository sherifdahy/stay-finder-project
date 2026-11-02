import { randomUUID } from "node:crypto";

import { Booking, BookingGuest } from "@/src/domain/types/booking";
import { getBookingById } from "../db/memory-db/bookings/get-booking-by-id";
import { getHotelById } from "../db/memory-db/hotels/get-hotel-by-id";
import { rateAdjustments } from "../db/memory-db/memoryDb";
import { getEffectiveBaseRate } from "../db/memory-db/rooms/get-effective-base-rate";
import { getRoomById } from "../db/memory-db/rooms/get-room-by-id";
import { getUnitsLeft } from "../db/memory-db/units/get-units-left";
import { buildQuote } from "@/src/domain/pricing";
import { Quote } from "@/src/domain/types/quote";
import { saveBooking } from "../db/memory-db/bookings/save-booking";
import { updateBooking } from "../db/memory-db/bookings/update-booking";
import { getBookings } from "../db/memory-db/bookings/get-bookings";
import { ServiceError } from "../errors/service-error";

const DEFAULT_HOLD_TTL_SECONDS = 300;

// Idempotency-Key -> Booking ID
const confirmedBookings = new Map<string, string>();

export interface CreateHoldInput {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    quotedTotal: number;
}

export type BookingView = Booking & {
    hotelName: string;
    roomName: string;
    refundable: boolean;
};

export interface CreateHoldResult {
    booking: Booking;
    serverTime: string;
}

export interface ConfirmBookingResult {
    booking: Booking;
    serverTime: string;
}

function getHoldTtlSeconds(): number {
    const configuredValue = Number(process.env.HOLD_TTL_SECONDS);

    if (
        !Number.isInteger(configuredValue) ||
        configuredValue <= 0
    ) {
        return DEFAULT_HOLD_TTL_SECONDS;
    }

    return configuredValue;
}

function getCurrentServerTime(): string {
    return new Date().toISOString();
}

function getBookingOrThrow(bookingId: string): Booking {
    const booking = getBookingById(bookingId);

    if (!booking) {
        throw new ServiceError(
            "NOT_FOUND",
            "Booking was not found.",
            404,
        );
    }

    return booking;
}

// Create a temporary hold.

export function createHold(
    input: CreateHoldInput,
    options: { changePrice?: boolean } = {},
): CreateHoldResult {
    if (
        !Number.isInteger(input.adults) ||
        input.adults < 1 ||
        input.adults > 4
    ) {
        throw new ServiceError(
            "VALIDATION_ERROR",
            "Adults must be between 1 and 4.",
            422,
        );
    }

    if (
        !Number.isSafeInteger(input.quotedTotal) ||
        input.quotedTotal < 0
    ) {
        throw new ServiceError(
            "VALIDATION_ERROR",
            "Quoted total must be a non-negative integer.",
            422,
        );
    }

    const room = getRoomById(input.roomId);

    if (!room || room.hotelId !== input.hotelId) {
        throw new ServiceError(
            "NOT_FOUND",
            "Room was not found for this hotel.",
            404,
        );
    }

    if (input.adults > room.maxGuests) {
        throw new ServiceError(
            "VALIDATION_ERROR",
            "The selected room cannot accommodate this number of adults.",
            422,
        );
    }

    const unitsLeft = getUnitsLeft(
        room,
        input.checkIn,
        input.checkOut,
    );

    if (unitsLeft <= 0) {
        throw new ServiceError(
            "ROOM_UNAVAILABLE",
            "This room is no longer available.",
            409,
        );
    }

    // Chaos: raise the room price 5-15% for good, so the new quote is the real one.
    if (options.changePrice) {
        const increase = 1.05 + Math.random() * 0.1;

        rateAdjustments.set(
            room.id,
            (rateAdjustments.get(room.id) ?? 1) * increase,
        );
    }

    // Always calculate the quote again on the server.
    const currentQuote: Quote = buildQuote(
        getEffectiveBaseRate(room),
        input.checkIn,
        input.checkOut,
    );

    if (currentQuote.total !== input.quotedTotal) {
        throw new ServiceError(
            "PRICE_CHANGED",
            "The price has changed. Please review the new quote.",
            409,
            {
                newQuote: currentQuote,
            },
        );
    }

    const now = new Date();

    const holdExpiresAt = new Date(
        now.getTime() + getHoldTtlSeconds() * 1000,
    ).toISOString();

    const booking: Booking = {
        id: randomUUID(),
        status: "held",
        hotelId: input.hotelId,
        roomId: input.roomId,
        adults: input.adults,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        quote: currentQuote,
        holdExpiresAt,
    };

    saveBooking(booking);

    return {
        booking,
        serverTime: now.toISOString(),
    };
}

// Confirm a temporary hold.

export function confirmBooking(
    bookingId: string,
    guest: BookingGuest,
    idempotencyKey: string,
): ConfirmBookingResult {
    if (!idempotencyKey.trim()) {
        throw new ServiceError(
            "VALIDATION_ERROR",
            "Idempotency-Key header is required.",
            422,
        );
    }

    // A previously used key must return the same confirmed booking.
    const existingBookingId = confirmedBookings.get(idempotencyKey);

    if (existingBookingId) {
        const existingBooking = getBookingOrThrow(existingBookingId);

        return {
            booking: existingBooking,
            serverTime: getCurrentServerTime(),
        };
    }

    const booking = getBookingOrThrow(bookingId);

    if (booking.status === "expired") {
        throw new ServiceError(
            "HOLD_EXPIRED",
            "The temporary hold has expired.",
            410,
        );
    }

    if (
        booking.status === "held" &&
        booking.holdExpiresAt !== null &&
        new Date(booking.holdExpiresAt).getTime() <= Date.now()
    ) {
        updateBooking(bookingId, {
            status: "expired",
        });

        throw new ServiceError(
            "HOLD_EXPIRED",
            "The temporary hold has expired.",
            410,
        );
    }

    // Also support retrying the same booking after successful confirmation.
    if (booking.status === "confirmed") {
        confirmedBookings.set(idempotencyKey, booking.id);

        return {
            booking,
            serverTime: getCurrentServerTime(),
        };
    }

    if (booking.status !== "held") {
        throw new ServiceError(
            "VALIDATION_ERROR",
            "Only active held bookings can be confirmed.",
            422,
        );
    }

    const confirmedBooking = updateBooking(bookingId, {
        status: "confirmed",
        guest,
        holdExpiresAt: null,
    });

    if (!confirmedBooking) {
        throw new ServiceError(
            "NOT_FOUND",
            "Booking was not found.",
            404,
        );
    }

    confirmedBookings.set(idempotencyKey, bookingId);

    return {
        booking: confirmedBooking,
        serverTime: getCurrentServerTime(),
    };
}

// Cancel a confirmed booking.

export function cancelBooking(bookingId: string): Booking {
    const booking = getBookingOrThrow(bookingId);

    if (booking.status !== "confirmed") {
        throw new ServiceError(
            "VALIDATION_ERROR",
            "Only confirmed bookings can be cancelled.",
            422,
        );
    }

    const room = getRoomById(booking.roomId);

    if (!room) {
        throw new ServiceError(
            "NOT_FOUND",
            "Room was not found.",
            404,
        );
    }

    if (!room.refundable) {
        throw new ServiceError(
            "NOT_REFUNDABLE",
            "This booking is not refundable.",
            409,
        );
    }

    const cancelledBooking = updateBooking(bookingId, {
        status: "cancelled",
    });

    if (!cancelledBooking) {
        throw new ServiceError(
            "NOT_FOUND",
            "Booking was not found.",
            404,
        );
    }

    return cancelledBooking;
}

// Get all bookings.

export function getAllBookings(): BookingView[] {
    return getBookings().map((booking) => {
        const room = getRoomById(booking.roomId);
        const hotel = getHotelById(booking.hotelId);

        return {
            ...booking,
            hotelName: hotel?.name ?? "",
            roomName: room?.name ?? "",
            refundable: room?.refundable ?? false,
        };
    });
}

// Get one booking.

export function getBooking(bookingId: string): Booking {
    return getBookingOrThrow(bookingId);
}