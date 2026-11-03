import type { RoomRecord } from "../../records";
import { rooms } from "../memoryDb";

export function getRoomsByHotelId(
    hotelId: string
): RoomRecord[] {
    return rooms.filter((room) => room.hotelId === hotelId);
}
