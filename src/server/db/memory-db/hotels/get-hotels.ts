import type { HotelRecord } from "../../records";
import { hotels } from "../memoryDb";

export function getHotels(): HotelRecord[] {
    return [...hotels];
}
