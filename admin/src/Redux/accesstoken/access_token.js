import { createSlice } from "@reduxjs/toolkit";

export const accessTokenSlice= createSlice({
    name:'access_token',
    initialState:{
        value:{}
    },
    reducers:{
        change_token:(state,action)=>{
            state.value=action.payload.access_token
        }
    }
})

export const {change_token}= accessTokenSlice.actions

export default accessTokenSlice.reducer