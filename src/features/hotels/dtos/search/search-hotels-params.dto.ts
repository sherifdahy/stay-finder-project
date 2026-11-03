import type { City } from "@/src/domain/types/city";
import type { Money } from "@/src/domain/types/primitives";

export interface SearchHotelsParams {
    city: City;
    checkIn: string;
    checkOut: string;
    adults: number;
    maxPrice?: Money;
    stars?: number[];
    sort?: "price" | "rating";
}
