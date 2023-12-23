import { authPayloadInterface } from '@/utils/interface/authPayload'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: authPayloadInterface = {
  email:"",
  role:"",
  profileImage:""
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state,action:PayloadAction<authPayloadInterface>)=>{

        state.email = action.payload.email
        state.role = action.payload.role
        state.profileImage = action.payload.profileImage
        
    },
    logout:(state)=>{
        
        state = initialState
    }
  },
})

export const { login , logout } = userSlice.actions

export default userSlice.reducer