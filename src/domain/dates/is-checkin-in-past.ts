export function isCheckInInPast(
    checkIn: ISODate,
    today: ISODate
): boolean {
    return checkIn < today;
}


