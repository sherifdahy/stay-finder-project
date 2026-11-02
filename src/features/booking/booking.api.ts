import type {
    Booking,
    BookingGuest,
    BookingView,
} from "@/src/domain/types/booking";
import { baseApi } from "@/src/store/baseApi";

type CreateHoldRequest = Pick<
    Booking,
    "hotelId" | "roomId" | "checkIn" | "checkOut" | "adults"
> & {
    quotedTotal: Booking["quote"]["total"];
};

type ConfirmBookingRequest = {
    bookingId: string;
    guest: BookingGuest;
    idempotencyKey: string;
};

type BookingResponse = {
    booking: Booking;
    serverTime: string;
};

export const bookingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<BookingView[], void>({
            query: () => "/bookings",
            transformResponse: (response: { bookings: BookingView[] }) =>
                response.bookings,
            providesTags: ["Booking"],
        }),

        getBookingById: builder.query<BookingResponse, string>({
            query: (bookingId) => `/bookings/${bookingId}`,
            providesTags: ["Booking"],
        }),

        // Invalidates "Hotel" even when it fails, so rooms refresh after ROOM_UNAVAILABLE.
        createHold: builder.mutation<BookingResponse, CreateHoldRequest>({
            query: (body) => ({
                url: "/bookings",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Booking", "Hotel"],
        }),

        confirmBooking: builder.mutation<
            BookingResponse,
            ConfirmBookingRequest
        >({
            query: ({ bookingId, guest, idempotencyKey }) => ({
                url: `/bookings/${bookingId}/confirm`,
                method: "POST",
                body: guest,
                headers: {
                    "Idempotency-Key": idempotencyKey,
                },
            }),
            invalidatesTags: ["Booking"],
        }),

        // Optimistic: mark as cancelled at once, roll back if the request fails.
        cancelBooking: builder.mutation<BookingResponse, string>({
            query: (bookingId) => ({
                url: `/bookings/${bookingId}/cancel`,
                method: "POST",
            }),
            async onQueryStarted(bookingId, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    bookingsApi.util.updateQueryData(
                        "getBookings",
                        undefined,
                        (draft) => {
                            const booking = draft.find(
                                (item) => item.id === bookingId
                            );

                            if (booking) booking.status = "cancelled";
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
            invalidatesTags: ["Booking", "Hotel"],
        }),
    }),
});

export const {
    useGetBookingsQuery,
    useGetBookingByIdQuery,
    useCreateHoldMutation,
    useConfirmBookingMutation,
    useCancelBookingMutation,
} = bookingsApi;
