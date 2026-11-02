import z from "zod";

export const hotelSortSchema = z.enum(["price", "rating"]);

export type HotelSort = z.infer<typeof hotelSortSchema>;
