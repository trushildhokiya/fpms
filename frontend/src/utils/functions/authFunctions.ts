import { jwtDecode } from "jwt-decode"
import { authPayloadInterface } from "../interface/authPayload"

export const getDecodedToken = ()=>{
    
    const token = jwtDecode(localStorage.getItem('token')!) as authPayloadInterface
    return token
}