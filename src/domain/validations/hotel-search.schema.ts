import z from "zod";
import { citySchema } from "./city.schema";
import { isoDateSchema } from "./iso-date.schema";


export const hotelSearchSchema = z.object({
    city: citySchema,
    checkIn: isoDateSchema,
    checkOut: isoDateSchema,
    adults: z.coerce.number().int().min(1).max(4),
    maxPrice: z.coerce.number().int().nonnegative().optional(),
    stars: z.coerce.number().int().min(1).max(5).optional(),
    sort: z.enum(["price", "rating"]).optional(),
});

export type HotelSearchInput = z.infer<
    typeof hotelSearchSchema
>;