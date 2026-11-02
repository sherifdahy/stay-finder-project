import { Booking } from "@/src/domain/types/booking";
import { bookings } from "../memoryDb";
import { expireOldHolds } from "./expire-old-holds";

export function getBookingById(
    bookingId: string
): Booking | undefined {
    expireOldHolds();

    return bookings.get(bookingId);
}