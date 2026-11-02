import z from "zod";
import { isoDateSchema } from "./iso-date.schema";

export const createHoldSchema = z.object({
    hotelId: z.string().min(1),
    roomId: z.string().min(1),
    checkIn: isoDateSchema,
    checkOut: isoDateSchema,
    adults: z.number().int().min(1).max(4),
    quotedTotal: z.number().int().nonnegative(),
});


export type CreateHoldInput = z.infer<
    typeof createHoldSchema
>;