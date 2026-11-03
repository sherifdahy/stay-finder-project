import type { BookingGuest } from "@/src/domain/types/booking";

export type ConfirmBookingRequest = {
    bookingId: string;
    guest: BookingGuest;
    idempotencyKey: string;
};
