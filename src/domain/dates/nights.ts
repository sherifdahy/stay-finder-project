import type { ISODate } from "../types/primitives";
import { parseISODate } from "../utils/parse-iso-date";
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function nights(
    checkIn: ISODate,
    checkOut: ISODate
): number {
    const start = parseISODate(checkIn);
    const end = parseISODate(checkOut);

    return Math.round(
        (end.getTime() - start.getTime()) / MILLISECONDS_PER_DAY
    );
}