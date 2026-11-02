import type { ISODate, Money } from "./types/primitives";

import { getStayDates } from "./dates/get-stay-dates";
import { isWeekend } from "./dates/is-weekend";
import { Quote } from "./types/quote";

const WEEKEND_MULTIPLIER = 1.25;
const VAT_RATE = 0.15;

export function buildQuote(
    baseRate: Money,
    checkIn: ISODate,
    checkOut: ISODate
): Quote {
    if (!Number.isSafeInteger(baseRate) || baseRate < 0) {
        throw new Error("Base rate must be a non-negative integer.");
    }

    const dates = getStayDates(checkIn, checkOut);

    const nightlyRates = dates.map((date) => {
        const weekend = isWeekend(date);

        const rate = weekend
            ? Math.round(baseRate * WEEKEND_MULTIPLIER)
            : baseRate;

        return {
            date,
            rate,
            isWeekend: weekend,
        };
    });

    const subtotal = nightlyRates.reduce(
        (total, night) => total + night.rate,
        0
    );

    const vat = Math.round(subtotal * VAT_RATE);

    return {
        nights: nightlyRates,
        subtotal,
        vat,
        total: subtotal + vat,
    };
}
