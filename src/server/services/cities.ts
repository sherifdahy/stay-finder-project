import type { Locale } from "@/src/domain/constants/locale";
import { getCities } from "../db/memory-db/cities/get-cities";
import { localize } from "../i18n/localize";

export function listCities(locale: Locale): { code: string; name: string }[] {
    return getCities().map((city) => ({ code: city.code, name: localize(city.name, locale) }));
}
