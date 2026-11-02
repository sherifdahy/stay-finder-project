import { ZodError } from "zod";
import { ServiceError } from "../errors/service-error";

export function toApiError(error: unknown): Response {
    if (error instanceof ServiceError) {
        return Response.json(
            {
                error: {
                    code: error.code,
                    message: error.message,
                    details: error.details ?? null,
                },
            },
            { status: error.statusCode }
        );
    }

    if (error instanceof ZodError) {
        return Response.json(
            {
                error: {
                    code: "VALIDATION_ERROR",
                    message: "The provided data is invalid.",
                    details: error.issues,
                },
            },
            { status: 400 }
        );
    }

    if (error instanceof SyntaxError) {
        return Response.json(
            {
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Invalid JSON request body.",
                    details: null,
                },
            },
            { status: 400 }
        );
    }

    console.error("Unhandled API error:", error);

    return Response.json(
        {
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                details: null,
            },
        },
        { status: 500 }
    );
}