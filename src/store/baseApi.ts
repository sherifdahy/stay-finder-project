import { API_ERROR_CODE, type ApiErrorCode } from "@/src/domain/constants/api-error-code";
import { DEFAULT_LOCALE, isLocale } from "@/src/domain/constants/locale";
import {
    createApi,
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export type { ApiErrorCode };

// The single error shape every component receives from RTK Query.
// `message` is empty when the client made the error; useErrorMessage words it.
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
            code: body?.code ?? API_ERROR_CODE.INTERNAL_ERROR,
            message: body?.message ?? "",
            details: body?.details ?? null,
        };
    }

    return {
        status: "FETCH_ERROR",
        code: API_ERROR_CODE.NETWORK_ERROR,
        message: "",
        details: null,
    };
}

// The URL is the only source of the language. A language switch rebuilds the store, so no cache
// from the other language survives it.
const rawBaseQuery = fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
        const segment = window.location.pathname.split("/")[1];

        headers.set("Accept-Language", isLocale(segment) ? segment : DEFAULT_LOCALE);

        return headers;
    },
});

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
