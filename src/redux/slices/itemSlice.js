import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: []
}

export const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload)
        }
    }
})

const { actions, reducer } = itemSlice

export const { addItem } = actions

export default reducer