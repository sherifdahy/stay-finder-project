
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
    activeBookingId: string | null;
}

const initialState: BookingState = {
    activeBookingId: null,
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setActiveBookingId: (
            state,
            action: PayloadAction<string>
        ) => {
            state.activeBookingId = action.payload;
        },

        clearActiveBooking: (state) => {
            state.activeBookingId = null;
        },
    },
});

export const {
    setActiveBookingId,
    clearActiveBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
