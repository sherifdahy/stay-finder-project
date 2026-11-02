import z from "zod";
import { citySchema } from "./city.schema";
import { hotelSortSchema } from "./sort.schema";
import { starsSchema } from "./stars.schema";
import { refineStay, stayShape } from "./stay.schema";

export const hotelSearchSchema = z
    .object({
        city: citySchema,
        ...stayShape,
        maxPrice: z.coerce.number().int().nonnegative().optional(),
        stars: starsSchema,
        sort: hotelSortSchema.optional(),
    })
    .superRefine(refineStay);

export type HotelSearchInput = z.infer<
    typeof hotelSearchSchema
>;
