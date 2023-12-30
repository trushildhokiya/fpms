import { authPayloadInterface } from '@/utils/interface/authPayload'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: authPayloadInterface = {
  email:"",
  role:"",
  profileImage:"",
  institute:"",
  department:"",
  tags:[''],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state,action:PayloadAction<authPayloadInterface>)=>{

        state.email = action.payload.email
        state.role = action.payload.role
        state.profileImage = action.payload.profileImage
        state.institute = action.payload.institute
        state.department = action.payload.department
        state.tags = action.payload.tags
    },
    logout:(state)=>{
        
      state.email = ''
      state.role =''
      state.profileImage = ''
      state.institute = ''
      state.department = ''
      state.tags = ['']
    }
  },
})

export const { login , logout } = userSlice.actions

export default userSlice.reducer