import type { RoomRecord } from "../../records";
import { rooms } from "../memoryDb";

export function getRoomById(
    roomId: string
): RoomRecord | undefined {
    return rooms.find((room) => room.id === roomId);
}
