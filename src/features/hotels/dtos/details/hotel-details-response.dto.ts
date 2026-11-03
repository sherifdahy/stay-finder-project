import type { Hotel } from "@/src/domain/types/hotel";
import type { HotelRoom } from "./hotel-room.dto";

export interface HotelDetailsResponse {
    hotel: Hotel;
    rooms: HotelRoom[];
}
