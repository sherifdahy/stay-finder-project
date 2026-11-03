import type { Locale } from "@/src/domain/constants/locale";
import { getApiTranslator } from "../i18n/get-translator";
import { resolveLocale } from "../i18n/resolve-locale";
import { withChaos, type ChaosControls, type ChaosOptions } from "../withChaos";
import { internalErrorResponse, toApiError } from "./apiError";

interface ApiContext {
    chaos: ChaosControls;
    locale: Locale;
}

type ApiHandler<TContext> = (request: Request, context: TContext, api: ApiContext) => Promise<Response>;

// Every route goes through here: language from Accept-Language, chaos, and the one place errors are translated.
export function withApi<TContext = unknown>(
    handler: ApiHandler<TContext>,
    options: Pick<ChaosOptions, "errorTiming"> = {},
): (request: Request, context: TContext) => Promise<Response> {
    return async (request, context) => {
        const locale = resolveLocale(request.headers.get("accept-language"));
        const t = await getApiTranslator(locale);

        const run = withChaos<TContext>(
            async (req, ctx, chaos) => {
                try {
                    return await handler(req, ctx, { chaos, locale });
                } catch (error) {
                    return toApiError(error, t);
                }
            },
            { ...options, onServerError: () => internalErrorResponse(t) },
        );

        const response = await run(request, context);

        response.headers.set("Content-Language", locale);
        response.headers.append("Vary", "Accept-Language");

        return response;
    };
}
