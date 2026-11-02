import { Booking } from "@/src/domain/types/booking";
import { getBookingById } from "./get-booking-by-id";

export function updateBooking(
    bookingId: string,
    updates: Partial<Booking>
): Booking | undefined {
    const booking = getBookingById(bookingId);

    if (!booking) {
        return undefined;
    }

    Object.assign(booking, updates);

    return booking;
}