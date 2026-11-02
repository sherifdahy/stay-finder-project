import { BookingStatus } from "../constants/booking-status";
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


export interface BookingGuest {
    fullName: string;
    email: string;
    phone: string;
}