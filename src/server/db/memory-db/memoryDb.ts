import "server-only";

import seed from "../seed.json";
import { Booking } from "@/src/domain/types/booking";
import type { AmenityRecord, CityRecord, HotelRecord, RoomRecord } from "../records";

export const cities: CityRecord[] = seed.cities as CityRecord[];
export const amenities: AmenityRecord[] = seed.amenities as AmenityRecord[];
export const hotels: HotelRecord[] = seed.hotels as HotelRecord[];
export const rooms: RoomRecord[] = seed.rooms as RoomRecord[];

export const bookings = new Map<string, Booking>();

// roomId -> price multiplier, raised by the chaos price-change simulation.
export const rateAdjustments = new Map<string, number>();
