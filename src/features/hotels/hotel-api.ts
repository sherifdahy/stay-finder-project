import { City } from "@/src/domain/types/city";
import { Hotel } from "@/src/domain/types/hotel";
import { Quote } from "@/src/domain/types/quote";
import { Room } from "@/src/domain/types/room";
import { baseApi } from "@/src/store/baseApi";

export interface SearchHotelsParams {
    city: City;
    checkIn: string;
    checkOut: string;
    adults: number;
    maxPrice?: Money;
    stars?: number[];
    sort?: "price" | "rating";
}

interface SearchHotelsResponse {
    hotels: (Hotel & {
        fromTotal: Money;
    })[];
}

interface HotelDetailsResponse {
    hotel: Hotel;
    rooms: (Room & {
        quote: Quote;
        unitsLeft: number;
    })[];
}

export const hotelsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        searchHotels: builder.query<
            SearchHotelsResponse,
            SearchHotelsParams
        >({
            query: (params) => ({
                url: "/hotels",
                params: {
                    ...params,
                    stars: params.stars?.join(","),
                },
            }),
            providesTags: ["Hotel"],
        }),

        getHotelDetails: builder.query<
            HotelDetailsResponse,
            {
                hotelId: string;
                checkIn: string;
                checkOut: string;
                adults: number;
            }
        >({
            query: ({ hotelId, ...params }) => ({
                url: `/hotels/${hotelId}`,
                params,
            }),
            providesTags: ["Hotel"],
        }),
    }),
});

export const {
    useSearchHotelsQuery,
    useGetHotelDetailsQuery,
} = hotelsApi;