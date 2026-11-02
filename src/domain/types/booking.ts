import type { ISODate } from "./primitives";
import { BookingStatus } from "../constants/booking-status";
import type { Guest } from "../validations/guest.schema";
import { Quote } from "./quote";

export interface Booking {
    id: string;
    status: BookingStatus;

    hotelId: string;
    roomId: string;

    adults: number;

    checkIn: ISODate;
    checkOut: ISODate;

    quote: Quote;

    holdExpiresAt: string | null;

    guest?: BookingGuest;
}


export type BookingGuest = Guest;

export type BookingView = Booking & {
    hotelName: string;
    roomName: string;
    refundable: boolean;
};
