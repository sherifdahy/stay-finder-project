import { MAX_STAY_NIGHTS } from "../constants/stay";
import type { ISODate } from "../types/primitives";

// Check-in today, check-out after the longest stay we allow. "Today" is UTC, like the stay schema.
export function getDefaultStay(now: Date = new Date()): { checkIn: ISODate; checkOut: ISODate } {
    const checkOut = new Date(now);

    checkOut.setUTCDate(checkOut.getUTCDate() + MAX_STAY_NIGHTS);

    return {
        checkIn: now.toISOString().slice(0, 10),
        checkOut: checkOut.toISOString().slice(0, 10),
    };
}
