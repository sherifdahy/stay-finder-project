import { Room } from "@/src/domain/types/room";
import { rateAdjustments } from "../memoryDb";

export function getEffectiveBaseRate(room: Room): number {
    return Math.round(room.baseRate * (rateAdjustments.get(room.id) ?? 1));
}
