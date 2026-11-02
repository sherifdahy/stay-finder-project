import z from "zod";
import { refineStay, stayShape } from "./stay.schema";

export const hotelDetailsSearchSchema = z
    .object(stayShape)
    .superRefine(refineStay);


export type HotelDetailsSearchInput = z.infer<
    typeof hotelDetailsSearchSchema
>;
