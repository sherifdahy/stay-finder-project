import { Hotel } from "@/src/domain/types/hotel";
import { hotels } from "../memoryDb";

export function getHotels(): Hotel[] {
    return [...hotels];
}