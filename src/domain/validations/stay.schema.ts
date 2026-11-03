import z from "zod";
import { MAX_STAY_NIGHTS, MIN_STAY_NIGHTS } from "../constants/stay";
import { isCheckInInPast } from "../dates/is-checkin-in-past";
import { nights } from "../dates/nights";
import { isoDateSchema } from "./iso-date.schema";

export const stayShape = {
    checkIn: isoDateSchema,
    checkOut: isoDateSchema,
    adults: z.coerce.number().int().min(1).max(4),
};

export function refineStay<T extends { checkIn: string; checkOut: string }>(
    value: T,
    ctx: z.RefinementCtx,
) {
    // Per-field errors are already reported; nights() needs valid dates.
    if (
        !isoDateSchema.safeParse(value.checkIn).success ||
        !isoDateSchema.safeParse(value.checkOut).success
    ) {
        return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const total = nights(value.checkIn, value.checkOut);

    if (isCheckInInPast(value.checkIn, today)) {
        ctx.addIssue({
            code: "custom",
            path: ["checkIn"],
            message: "checkInInPast",
        });
    }

    if (total < MIN_STAY_NIGHTS || total > MAX_STAY_NIGHTS) {
        ctx.addIssue({
            code: "custom",
            path: ["checkOut"],
            message: "stayLength",
            params: { min: MIN_STAY_NIGHTS, max: MAX_STAY_NIGHTS },
        });
    }
}

export const staySchema = z.object(stayShape).superRefine(refineStay);

export type StayInput = z.infer<typeof staySchema>;
