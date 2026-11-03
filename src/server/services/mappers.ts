import type { Locale } from "@/src/domain/constants/locale";
import type { Hotel } from "@/src/domain/types/hotel";
import type { Room } from "@/src/domain/types/room";
import { getAmenityByCode } from "../db/memory-db/amenities/get-amenity-by-code";
import { getCityByCode } from "../db/memory-db/cities/get-city-by-code";
import type { HotelRecord, RoomRecord } from "../db/records";
import { localize } from "../i18n/localize";

// The one place a DB record becomes an API object in the caller's language.
export function toHotel(record: HotelRecord, locale: Locale): Hotel {
    const city = getCityByCode(record.city);

    return {
        ...record,
        name: localize(record.name, locale),
        cityName: city ? localize(city.name, locale) : record.city,
        amenities: record.amenities.map((code) => {
            const amenity = getAmenityByCode(code);

            return { code, label: amenity ? localize(amenity.name, locale) : code };
        }),
    };
}

export function toRoom(record: RoomRecord, locale: Locale): Room {
    return { ...record, name: localize(record.name, locale) };
}
