import { parseISODate } from "../utils/parse-iso-date";
import { nights } from "./nights";

export function getStayDates(
    checkIn: ISODate,
    checkOut: ISODate
): ISODate[] {
    const totalNights = nights(checkIn, checkOut);

    if (totalNights < 1 || totalNights > 14) {
        throw new Error("Stay must be between 1 and 14 nights.");
    }

    const dates: ISODate[] = [];
    const current = parseISODate(checkIn);

    for (let index = 0; index < totalNights; index++) {
        dates.push(current.toISOString().slice(0, 10));
        current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
}
