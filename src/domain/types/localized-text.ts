import type { Locale } from "../constants/locale";

// One text in every language we support, as the DB stores it.
export type LocalizedText = Record<Locale, string>;
