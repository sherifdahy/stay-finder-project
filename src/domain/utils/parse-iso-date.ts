export function parseISODate(date: ISODate): Date {
    const parsed = new Date(`${date}T00:00:00.000Z`);

    if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== date
    ) {
        throw new Error("Invalid date. Expected YYYY-MM-DD.");
    }

    return parsed;
}