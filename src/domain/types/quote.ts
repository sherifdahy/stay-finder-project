import type { ISODate, Money } from "./primitives";
export interface Quote {
    nights: QuoteNight[];
    subtotal: Money;
    vat: Money;
    total: Money;
}


export interface QuoteNight {
    date: ISODate;
    rate: Money;
    isWeekend: boolean;
}