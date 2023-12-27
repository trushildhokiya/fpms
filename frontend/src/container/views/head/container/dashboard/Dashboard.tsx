import HeadNavbar from '@/components/navbar/HeadNavbar'
import { loadUserData } from '@/utils/functions/reduxFunctions'
import { useEffect } from 'react'

const Dashboard = () => {

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <div>
      <HeadNavbar />
      Head Dashboard
    </div>
  )
}

export default Dashboard