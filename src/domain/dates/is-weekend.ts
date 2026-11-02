import { parseISODate } from "../utils/parse-iso-date";

export function isWeekend(date: ISODate): boolean {
    const day = parseISODate(date).getUTCDay();

    return day === 4 || day === 5;
}
