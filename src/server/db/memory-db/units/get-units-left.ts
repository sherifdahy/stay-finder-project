import { Room } from "@/src/domain/types/room";
import { bookings } from "../memoryDb";
import { expireOldHolds } from "../bookings/expire-old-holds";

export function getUnitsLeft(
    room: Room,
    checkIn: ISODate,
    checkOut: ISODate
): number {
    expireOldHolds();

    const occupiedUnits = Array.from(bookings.values()).filter(
        (booking) => {
            const isActive =
                booking.status === "confirmed" ||
                booking.status === "held";

            const overlaps =
                booking.checkIn < checkOut &&
                booking.checkOut > checkIn;

            return (
                booking.roomId === room.id &&
                isActive &&
                overlaps
            );
        }
    ).length;

    return Math.max(0, room.units - occupiedUnits);
}