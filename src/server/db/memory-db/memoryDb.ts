
import "server-only";

import seed from "../seed.json";
import { Hotel } from "@/src/domain/types/hotel";
import { Room } from "@/src/domain/types/room";
import { Booking } from "@/src/domain/types/booking";

export const hotels: Hotel[] = seed.hotels as Hotel[];
export const rooms: Room[] = seed.rooms as Room[];

export const bookings = new Map<string, Booking>();




















