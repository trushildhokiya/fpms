import { loadUserData } from '@/utils/functions/reduxFunctions'
import { useEffect } from 'react'

const Dashboard = () => {

  useEffect(()=>{
    loadUserData()
  },[])

  return (
    <div>
    Head Dashboard
    </div>
  )
}

export default Dashboard