import type { Booking } from "@/src/domain/types/booking";

export type BookingResponse = {
    booking: Booking;
    serverTime: string;
};
