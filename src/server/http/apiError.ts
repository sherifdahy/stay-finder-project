import { API_ERROR_CODE, type ApiErrorCode } from "@/src/domain/constants/api-error-code";
import { ZodError } from "zod";
import { ServiceError } from "../errors/service-error";

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

export function toApiError(error: unknown): Response {
    if (error instanceof ServiceError) {
        return errorResponse(
            error.code,
            error.message,
            error.statusCode,
            error.details ?? null,
        );
    }

    if (error instanceof ZodError) {
        return errorResponse(
            API_ERROR_CODE.VALIDATION_ERROR,
            "The provided data is invalid.",
            400,
            error.issues,
        );
    }

    if (error instanceof SyntaxError) {
        return errorResponse(
            API_ERROR_CODE.VALIDATION_ERROR,
            "Invalid JSON request body.",
            422,
        );
    }

    console.error("Unhandled API error:", error);

    return errorResponse(
        API_ERROR_CODE.INTERNAL_ERROR,
        "An unexpected error occurred.",
        500,
    );
}
