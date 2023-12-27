import { jwtDecode } from 'jwt-decode'
import { store } from '@/app/store'
import { login } from '@/features/user/userSlice'
import { authPayloadInterface } from '../interface/authPayload'

export const loadUserData = ()=>{

    const encryptedData = localStorage.getItem('token')!
    const decryptedData: authPayloadInterface = jwtDecode(encryptedData)

    const payload: authPayloadInterface = {

        email :decryptedData.email,
        role : decryptedData.role,
        profileImage :decryptedData.profileImage,
        institute : decryptedData.institute,
        department: decryptedData.department
    }

    store.dispatch( login(payload) )
    

}