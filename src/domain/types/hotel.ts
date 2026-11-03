import { City } from "./city";
import { HotelStars } from "./hotel-stars";

// `code` picks the icon; `label` is the name in the language of the request.
export interface HotelAmenity {
  code: string;
  label: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: City;
  cityName: string;
  stars: HotelStars;
  rating: number;
  image: string;
  amenities: HotelAmenity[];
}
