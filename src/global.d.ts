import type { Locale } from "./domain/constants/locale";

declare module "next-intl" {
    interface AppConfig {
        Locale: Locale;
    }
}
