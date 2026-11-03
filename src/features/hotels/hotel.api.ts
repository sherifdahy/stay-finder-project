import { baseApi } from "@/src/store/baseApi";
import type { CitiesResponse } from "./dtos/cities-response.dto";
import type { HotelDetailsParams } from "./dtos/details/hotel-details-params.dto";
import type { HotelDetailsResponse } from "./dtos/details/hotel-details-response.dto";
import type { SearchHotelsParams } from "./dtos/search/search-hotels-params.dto";
import type { SearchHotelsResponse } from "./dtos/search/search-hotels-response.dto";

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

        getCities: builder.query<CitiesResponse, void>({
            query: () => "/cities",
        }),

        getHotelDetails: builder.query<
            HotelDetailsResponse,
            HotelDetailsParams
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
    useGetCitiesQuery,
    useSearchHotelsQuery,
    useGetHotelDetailsQuery,
} = hotelsApi;