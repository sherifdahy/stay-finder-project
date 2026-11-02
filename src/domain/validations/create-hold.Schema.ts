import z from "zod";
import { refineStay, stayShape } from "./stay.schema";

export const createHoldSchema = z
    .object({
        hotelId: z.string().min(1),
        roomId: z.string().min(1),
        ...stayShape,
        quotedTotal: z.number().int().nonnegative(),
    })
    .superRefine(refineStay);


export type CreateHoldInput = z.infer<
    typeof createHoldSchema
>;
