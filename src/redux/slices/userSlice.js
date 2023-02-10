import { createSlice } from "@reduxjs/toolkit"

const user = JSON.parse(sessionStorage.getItem('user'))

const initialState = {
    user: {
        name: user ? user.name : '',
        phone: user ? user.phone : '',
        countryCode: user ? user.countryCode : '',
        email: user ? user.email : '',
        role: user ? user.role : '',
        isLogged: user ? true : false
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setIsLogged: (state, action) => {
            state.user.isLogged = action.payload
        }
    }
})

const { actions, reducer } = userSlice

export const { setUser, setIsLogged } = actions

export default reducer