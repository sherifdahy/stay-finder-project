import { Booking } from "@/src/domain/types/booking";
import { bookings } from "../memoryDb";

export function saveBooking(booking: Booking): Booking {
    bookings.set(booking.id, booking);

    return booking;
}