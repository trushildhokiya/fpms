import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import axios from 'axios'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

type Props = {}

const CopyrightDisplay = (props: Props) => {

    // constants
    const user = useSelector((state: any) => state.user)

    // funcions

    useEffect(()=>{
        axios.get('/common/copyright')
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

export default CopyrightDisplay