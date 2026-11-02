import type { City } from "@/src/domain/types/city";
import { citySchema } from "@/src/domain/validations/city.schema";
import { isoDateSchema } from "@/src/domain/validations/iso-date.schema";
import {
    hotelSortSchema,
    type HotelSort,
} from "@/src/domain/validations/sort.schema";

export interface HotelSearchParams {
    city: City;
    checkIn: string;
    checkOut: string;
    adults: number;
    maxPrice?: number;
    stars: number[];
    sort: HotelSort;
}

const DEFAULT_ADULTS = 2;

export function parseSearchParams(
    params: URLSearchParams,
): HotelSearchParams {
    const rawAdults = Number(params.get("adults"));
    const rawMaxPrice = params.get("maxPrice");

    const stars = (params.get("stars") ?? "")
        .split(",")
        .map(Number)
        .filter((star) => Number.isInteger(star) && star >= 1 && star <= 5);

    return {
        city: citySchema.catch("riyadh").parse(params.get("city")),
        checkIn: isoDateSchema.catch("").parse(params.get("checkIn")),
        checkOut: isoDateSchema.catch("").parse(params.get("checkOut")),
        adults:
            Number.isInteger(rawAdults) && rawAdults >= 1 && rawAdults <= 4
                ? rawAdults
                : DEFAULT_ADULTS,
        maxPrice:
            rawMaxPrice && Number.isFinite(Number(rawMaxPrice))
                ? Number(rawMaxPrice)
                : undefined,
        stars,
        sort: hotelSortSchema.catch("price").parse(params.get("sort")),
    };
}

export function serializeSearchParams(
    search: HotelSearchParams,
): URLSearchParams {
    const params = new URLSearchParams();

    params.set("city", search.city);
    params.set("checkIn", search.checkIn);
    params.set("checkOut", search.checkOut);
    params.set("adults", String(search.adults));

    if (search.maxPrice !== undefined) {
        params.set("maxPrice", String(search.maxPrice));
    }

    if (search.stars.length > 0) {
        params.set("stars", search.stars.join(","));
    }

    params.set("sort", search.sort);

    return params;
}

export function hotelHref(
    hotelId: string,
    stay: Pick<HotelSearchParams, "checkIn" | "checkOut" | "adults">,
): string {
    const params = new URLSearchParams({
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        adults: String(stay.adults),
    });

    return `/hotels/${hotelId}?${params.toString()}`;
}
