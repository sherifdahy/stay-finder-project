import { ZodError } from "zod";
import { ServiceError } from "../errors/service-error";

export function errorResponse(
    code: string,
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
            "VALIDATION_ERROR",
            "The provided data is invalid.",
            400,
            error.issues,
        );
    }

    if (error instanceof SyntaxError) {
        return errorResponse(
            "VALIDATION_ERROR",
            "Invalid JSON request body.",
            422,
        );
    }

    console.error("Unhandled API error:", error);

    return errorResponse(
        "INTERNAL_SERVER_ERROR",
        "An unexpected error occurred.",
        500,
    );
}
