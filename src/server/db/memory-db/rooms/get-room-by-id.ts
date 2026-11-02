import { Room } from "@/src/domain/types/room";
import { rooms } from "../memoryDb";

export function getRoomById(
    roomId: string
): Room | undefined {
    return rooms.find((room) => room.id === roomId);
}