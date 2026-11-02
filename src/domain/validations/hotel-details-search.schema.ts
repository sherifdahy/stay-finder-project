import z from "zod";
import { isoDateSchema } from "./iso-date.schema";

export const hotelDetailsSearchSchema = z.object({
    checkIn: isoDateSchema,
    checkOut: isoDateSchema,
    adults: z.coerce.number().int().min(1).max(4),
});


export type HotelDetailsSearchInput = z.infer<
    typeof hotelDetailsSearchSchema
>;