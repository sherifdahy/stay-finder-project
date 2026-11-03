import { API_ERROR_CODE } from "@/src/domain/constants/api-error-code";
import type { z } from "zod";
import { ServiceError } from "../errors/service-error";

// 400 for a bad query, 422 for a bad body. Throws, so withApi turns it into the error response.
export function parseInput<S extends z.ZodType>(schema: S, input: unknown, status: 400 | 422): z.output<S> {
    const result = schema.safeParse(input);

    if (!result.success) {
        throw new ServiceError(API_ERROR_CODE.VALIDATION_ERROR, "validation", status, result.error.issues);
    }

    return result.data;
}
