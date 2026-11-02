import { Room } from "@/src/domain/types/room";
import { rooms } from "../memoryDb";

export function getRoomsByHotelId(
    hotelId: string
): Room[] {
    return rooms.filter((room) => room.hotelId === hotelId);
}