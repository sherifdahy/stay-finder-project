export interface Room {
  id: string;
  hotelId: string;
  name: string;
  maxGuests: number;
  baseRate: Money;
  refundable: boolean;
  units: number;
}