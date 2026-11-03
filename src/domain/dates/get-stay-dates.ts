import { MAX_STAY_NIGHTS, MIN_STAY_NIGHTS } from "../constants/stay";
import type { ISODate } from "../types/primitives";
import { parseISODate } from "../utils/parse-iso-date";
import { nights } from "./nights";

export function getStayDates(
    checkIn: ISODate,
    checkOut: ISODate
): ISODate[] {
    const totalNights = nights(checkIn, checkOut);

    if (totalNights < MIN_STAY_NIGHTS || totalNights > MAX_STAY_NIGHTS) {
        throw new Error(`Stay must be between ${MIN_STAY_NIGHTS} and ${MAX_STAY_NIGHTS} nights.`);
    }

    const dates: ISODate[] = [];
    const current = parseISODate(checkIn);

    for (let index = 0; index < totalNights; index++) {
        dates.push(current.toISOString().slice(0, 10));
        current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
}
