import { Hotel } from "@/src/domain/types/hotel";
import { hotels } from "../memoryDb";

export function getHotelById(
    hotelId: string
): Hotel | undefined {
    return hotels.find((hotel) => hotel.id === hotelId);
}