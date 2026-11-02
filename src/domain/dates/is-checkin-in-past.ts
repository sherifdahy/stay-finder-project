import type { ISODate } from "../types/primitives";
export function isCheckInInPast(
    checkIn: ISODate,
    today: ISODate
): boolean {
    return checkIn < today;
}


