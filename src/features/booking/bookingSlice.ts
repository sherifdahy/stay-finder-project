import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store/make-store";

interface BookingState {
    // One key per hold, so every confirm retry sends the same Idempotency-Key.
    idempotencyKeys: Record<string, string>;
}

const initialState: BookingState = {
    idempotencyKeys: {},
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        ensureIdempotencyKey: {
            reducer(
                state,
                action: { payload: { bookingId: string; key: string } }
            ) {
                const { bookingId, key } = action.payload;

                state.idempotencyKeys[bookingId] ??= key;
            },
            prepare(bookingId: string) {
                return { payload: { bookingId, key: crypto.randomUUID() } };
            },
        },
    },
});

export const { ensureIdempotencyKey } = bookingSlice.actions;

const selectKeys = (state: RootState) => state.booking.idempotencyKeys;

export const selectIdempotencyKey = createSelector(
    [selectKeys, (_state: RootState, bookingId: string) => bookingId],
    (keys, bookingId) => keys[bookingId] ?? null
);

export default bookingSlice.reducer;
