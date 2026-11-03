import type { Hotel } from "@/src/domain/types/hotel";
import type { City } from "@/src/domain/types/city";
import type { LocalizedText } from "@/src/domain/types/localized-text";
import type { Room } from "@/src/domain/types/room";

// The shape of the data in the DB: every name in every language. Only the server sees these.
export interface CityRecord {
    code: City;
    name: LocalizedText;
}

export interface AmenityRecord {
    code: string;
    name: LocalizedText;
}

export interface HotelRecord extends Omit<Hotel, "name" | "cityName" | "amenities"> {
    name: LocalizedText;
    // Amenity codes; the names live in the amenities table.
    amenities: string[];
}

export interface RoomRecord extends Omit<Room, "name"> {
    name: LocalizedText;
}
