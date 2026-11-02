import { buildQuote } from "@/src/domain/pricing";
import { Hotel } from "@/src/domain/types/hotel";
import { Room } from "@/src/domain/types/room";
import { getHotels } from "../db/memory-db/hotels/get-hotels";
import { getRoomsByHotelId } from "../db/memory-db/rooms/get-rooms-by-hotel-id";
import { getUnitsLeft } from "../db/memory-db/units/get-units-left";
import type { HotelSearchInput } from "@/src/domain/validations/hotel-search.schema";
import { getEffectiveBaseRate } from "../db/memory-db/rooms/get-effective-base-rate";
import { getHotelById } from "../db/memory-db/hotels/get-hotel-by-id";



export interface HotelSearchResult extends Hotel {
    fromTotal: number;
}

export interface HotelRoomResult extends Room {
    quote: ReturnType<typeof buildQuote>;
    unitsLeft: number;
    canAccommodate: boolean;
}

export interface HotelDetailsResult {
    hotel: Hotel;
    rooms: HotelRoomResult[];
}

export function searchHotels(
    params: HotelSearchInput,
): HotelSearchResult[] {
    const {
        city,
        checkIn,
        checkOut,
        adults,
        maxPrice,
        stars,
        sort,
    } = params;

    const hotels = getHotels();

    const results: HotelSearchResult[] = [];

    for (const hotel of hotels) {
        // Filter by city.
        if (city && hotel.city !== city) {
            continue;
        }

        // Filter by stars.
        if (stars?.length && !stars.includes(hotel.stars)) {
            continue;
        }

        const rooms = getRoomsByHotelId(hotel.id);

        const availableRoomTotals: number[] = [];

        for (const room of rooms) {
            // Room must support the requested number of adults.
            if (adults > room.maxGuests) {
                continue;
            }

            // At least one unit must be available.
            const unitsLeft = getUnitsLeft(room, checkIn, checkOut);

            if (unitsLeft <= 0) {
                continue;
            }

            const quote = buildQuote(
                getEffectiveBaseRate(room),
                checkIn,
                checkOut,
            );

            availableRoomTotals.push(quote.total);
        }

        // Hotel is not available for this stay.
        if (availableRoomTotals.length === 0) {
            continue;
        }

        const fromTotal = Math.min(...availableRoomTotals);

        // Filter by maximum total price for the whole stay.
        if (maxPrice !== undefined && fromTotal > maxPrice) {
            continue;
        }

        results.push({
            ...hotel,
            fromTotal,
        });
    }

    if (sort === "price") {
        results.sort((a, b) => a.fromTotal - b.fromTotal);
    } else if (sort === "rating") {
        results.sort((a, b) => b.rating - a.rating);
    }

    return results;
}

export function getHotelDetails(
    hotelId: string,
    checkIn: string,
    checkOut: string,
    adults: number,
): HotelDetailsResult | null {
    const hotel = getHotelById(hotelId);

    if (!hotel) {
        return null;
    }

    const rooms = getRoomsByHotelId(hotelId);

    const roomResults: HotelRoomResult[] = rooms.map((room) => ({
        ...room,
        quote: buildQuote(getEffectiveBaseRate(room), checkIn, checkOut),
        unitsLeft: getUnitsLeft(room, checkIn, checkOut),
        canAccommodate: adults <= room.maxGuests,
    }));

    return {
        hotel,
        rooms: roomResults,
    };
}