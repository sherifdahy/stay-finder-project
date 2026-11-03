import type { AmenityRecord } from "../../records";
import { amenities } from "../memoryDb";

export function getAmenityByCode(code: string): AmenityRecord | undefined {
    return amenities.find((amenity) => amenity.code === code);
}
