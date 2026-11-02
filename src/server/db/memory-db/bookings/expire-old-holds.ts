import { bookings } from "../memoryDb";

export function expireOldHolds(now: Date = new Date()): void {
    for (const booking of bookings.values()) {
        if (
            booking.status === "held" &&
            booking.holdExpiresAt !== null &&
            new Date(booking.holdExpiresAt).getTime() <= now.getTime()
        ) {
            booking.status = "expired";
        }
    }
}