import type { HotelRecord } from "../../records";
import { hotels } from "../memoryDb";

export function getHotelById(
    hotelId: string
): HotelRecord | undefined {
    return hotels.find((hotel) => hotel.id === hotelId);
}
