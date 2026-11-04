import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
    // Everything except the API, Next internals and files with an extension.
    // The dot needs a double backslash: "\." in a JS string is just ".", which excluded every path.
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
