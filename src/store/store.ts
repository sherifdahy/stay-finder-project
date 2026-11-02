import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {}
})


// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store