import { createSlice } from '@reduxjs/toolkit'

const club = JSON.parse(sessionStorage.getItem('club'))


const initialState = {
    club: club ? club : {}
}

export const clubSlice = createSlice({
    name: 'club',
    initialState,
    reducers: {
        setClub: (state, action) => {
            state.club = action.payload
        }
    }
})

const {actions, reducer } = clubSlice

export const { setClub } = actions

export default reducer