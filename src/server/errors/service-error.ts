import type { ApiErrorCode } from "@/src/domain/constants/api-error-code";

export class ServiceError extends Error {
    constructor(
        public readonly code: ApiErrorCode,
        message: string,
        public readonly statusCode: number,
        public readonly details?: unknown,
    ) {
        super(message);

        this.name = "ServiceError";
    }
}