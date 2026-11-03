import type { CityRecord } from "../../records";
import { cities } from "../memoryDb";

export function getCities(): CityRecord[] {
    return [...cities];
}
