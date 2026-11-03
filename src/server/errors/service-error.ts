import type { ApiErrorCode } from "@/src/domain/constants/api-error-code";
import type messages from "@/src/i18n/messages/en.json";

// A key of the ApiErrors namespace; toApiError turns it into the caller's language.
export type ApiErrorKey = keyof typeof messages.ApiErrors;

export class ServiceError extends Error {
    constructor(
        public readonly code: ApiErrorCode,
        public readonly messageKey: ApiErrorKey,
        public readonly statusCode: number,
        public readonly details?: unknown,
    ) {
        super(messageKey);

        this.name = "ServiceError";
    }
}
