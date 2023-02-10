import { configureStore } from "@reduxjs/toolkit"
import itemReducer from './slices/itemSlice'
import userReducer from './slices/userSlice'
import clubReducer from './slices/clubSlice'

export const store = configureStore({
    reducer: {
        items: itemReducer,
        user: userReducer,
        club: clubReducer
    }
})