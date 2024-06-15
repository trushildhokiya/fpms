import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import axios from 'axios'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

type Props = {}

const ProfileDisplay = (props: Props) => {


    const user = useSelector((state: any) => state.user)

    // functions
    useEffect(()=>{

        axios.get('/common/profile')
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);    
        })

    },[])

    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}
        </div>
    )
}

export default ProfileDisplay