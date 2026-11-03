import type { Quote } from "@/src/domain/types/quote";
import type { Room } from "@/src/domain/types/room";

export type HotelRoom = Room & {
    quote: Quote;
    unitsLeft: number;
    canAccommodate: boolean;
};
