import type { RoomRecord } from "../../records";
import { rateAdjustments } from "../memoryDb";

export function getEffectiveBaseRate(room: RoomRecord): number {
    return Math.round(room.baseRate * (rateAdjustments.get(room.id) ?? 1));
}
