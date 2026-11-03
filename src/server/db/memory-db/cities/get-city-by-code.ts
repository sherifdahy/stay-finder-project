import type { CityRecord } from "../../records";
import { cities } from "../memoryDb";

export function getCityByCode(code: string): CityRecord | undefined {
    return cities.find((city) => city.code === code);
}
