import { City } from "./city";
import { HotelStars } from "./hotel-stars";

export interface Hotel {
  id: string;
  name: string;
  city: City;
  stars: HotelStars;
  rating: number;
  image: string;
  amenities: string[];
}