import { z } from "zod";
import { guestSchema } from "./guest.schema";

export const confirmBookingSchema = z.object({
    guest: guestSchema,
});


export type ConfirmBookingInput = z.infer<
    typeof confirmBookingSchema
>;