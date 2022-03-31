import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {IUser} from "../../models/IUser";

interface UserState {
    user: IUser,
    isAuth: boolean,
    error: string,
    isLoading: boolean
}

const initialState: UserState = {
    user: {} as IUser,
    isAuth: false,
    isLoading: false,
    error: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.isAuth = true
            state.user = action.payload
        },
        removeUser: (state,  action: PayloadAction<IUser>) => {
            state.isAuth = false
            state.user = action.payload
        },
    }
})


export const {setUser, removeUser} = userSlice.actions
export default userSlice.reducer

