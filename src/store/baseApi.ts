import {
    createApi,
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export type ApiErrorCode =
    | "VALIDATION_ERROR"
    | "NOT_FOUND"
    | "ROOM_UNAVAILABLE"
    | "PRICE_CHANGED"
    | "HOLD_EXPIRED"
    | "NOT_REFUNDABLE"
    | "INTERNAL_ERROR"
    | "NETWORK_ERROR";

// The single error shape every component receives from RTK Query.
export interface ApiError {
    status: number | "FETCH_ERROR";
    code: ApiErrorCode;
    message: string;
    details: unknown;
}

export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error
    );
}

function toApiError(error: FetchBaseQueryError): ApiError {
    if (typeof error.status === "number") {
        const body = (error.data as { error?: Partial<ApiError> } | undefined)
            ?.error;

        return {
            status: error.status,
            code: body?.code ?? "INTERNAL_ERROR",
            message: body?.message ?? "Something went wrong.",
            details: body?.details ?? null,
        };
    }

    return {
        status: "FETCH_ERROR",
        code: "NETWORK_ERROR",
        message: "Network error. Please check your connection.",
        details: null,
    };
}

const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api" });

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
        return { error: toApiError(result.error) };
    }

    return { data: result.data };
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Hotel", "Booking"],
    endpoints: () => ({}),
});
