import type { Booking } from "@/src/domain/types/booking";

export type CreateHoldRequest = Pick<
    Booking,
    "hotelId" | "roomId" | "checkIn" | "checkOut" | "adults"
> & {
    quotedTotal: Booking["quote"]["total"];
};
