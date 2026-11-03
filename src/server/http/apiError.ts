import { API_ERROR_CODE, type ApiErrorCode } from "@/src/domain/constants/api-error-code";
import { ZodError } from "zod";
import { ServiceError } from "../errors/service-error";
import type { ApiTranslator } from "../i18n/get-translator";

export function errorResponse(
    code: ApiErrorCode,
    message: string,
    status: number,
    details: unknown = null,
): Response {
    return Response.json(
        { error: { code, message, details } },
        { status },
    );
}

export function internalErrorResponse(t: ApiTranslator): Response {
    return errorResponse(API_ERROR_CODE.INTERNAL_ERROR, t("internal"), 500);
}

export function toApiError(error: unknown, t: ApiTranslator): Response {
    if (error instanceof ServiceError) {
        return errorResponse(
            error.code,
            t(error.messageKey),
            error.statusCode,
            error.details ?? null,
        );
    }

    if (error instanceof ZodError) {
        return errorResponse(
            API_ERROR_CODE.VALIDATION_ERROR,
            t("validation"),
            400,
            error.issues,
        );
    }

    if (error instanceof SyntaxError) {
        return errorResponse(
            API_ERROR_CODE.VALIDATION_ERROR,
            t("invalidJson"),
            422,
        );
    }

    console.error("Unhandled API error:", error);

    return internalErrorResponse(t);
}
