import type { Locale } from "./domain/constants/locale";
import type messages from "./i18n/messages/en.json";

declare module "next-intl" {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof messages;
    }
}
