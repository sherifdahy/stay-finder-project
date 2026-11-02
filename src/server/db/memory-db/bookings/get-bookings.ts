import { Booking } from "@/src/domain/types/booking";
import { bookings } from "../memoryDb";
import { expireOldHolds } from "./expire-old-holds";

export function getBookings(): Booking[] {
    expireOldHolds();

    return Array.from(bookings.values());
}