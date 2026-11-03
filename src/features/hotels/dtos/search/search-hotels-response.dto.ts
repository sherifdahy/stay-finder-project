import type { Hotel } from "@/src/domain/types/hotel";
import type { Money } from "@/src/domain/types/primitives";

export interface SearchHotelsResponse {
    hotels: (Hotel & {
        fromTotal: Money;
    })[];
}
