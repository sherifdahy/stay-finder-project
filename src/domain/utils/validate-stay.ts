import { isCheckInInPast } from "../dates/is-checkin-in-past";
import { nights } from "../dates/nights";

export function validateStay(
    checkIn: ISODate,
    checkOut: ISODate,
    today: ISODate
): boolean {
    const totalNights = nights(checkIn, checkOut);

    return (
        totalNights >= 1 &&
        totalNights <= 14 &&
        !isCheckInInPast(checkIn, today)
    );
}