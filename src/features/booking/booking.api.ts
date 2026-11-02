import { Booking } from "@/src/domain/types/booking";
import { baseApi } from "@/src/store/baseApi";


// البيانات المطلوبة لإنشاء حجز مؤقت
type CreateHoldRequest = Pick<
    Booking,
    "hotelId" | "roomId" | "checkIn" | "checkOut" | "adults"
> & {
    quotedTotal: Booking["quote"]["total"];
};

// بيانات تأكيد الحجز
type ConfirmBookingRequest = {
    bookingId: string;
    guest: NonNullable<Booking["guest"]>;
    idempotencyKey: string;
};

// الاستجابة التي تحتوي على بيانات الحجز ووقت الخادم
type BookingWithServerTime = Booking & {
    serverTime: string;
};

export const bookingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // جلب كل الحجوزات
        getBookings: builder.query<Booking[], void>({
            query: () => "/bookings",
            providesTags: ["Booking"],
        }),

        // جلب حجز محدد
        getBookingById: builder.query<
            BookingWithServerTime,
            string
        >({
            query: (bookingId) => `/bookings/${bookingId}`,
            providesTags: ["Booking"],
        }),

        // إنشاء حجز مؤقت
        createHold: builder.mutation<
            BookingWithServerTime,
            CreateHoldRequest
        >({
            query: (body) => ({
                url: "/bookings",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Booking"],
        }),

        // تأكيد الحجز
        confirmBooking: builder.mutation<
            Booking,
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

        // إلغاء الحجز
        cancelBooking: builder.mutation<Booking, string>({
            query: (bookingId) => ({
                url: `/bookings/${bookingId}/cancel`,
                method: "POST",
            }),
            invalidatesTags: ["Booking"],
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
