import { useEffect } from "react"
import { loadUserData } from "@/utils/functions/reduxFunctions"
import AdminNavbar from "@/components/navbar/AdminNavbar"

const Dashboard = () => {

    useEffect(()=>{

        loadUserData()
        
    },[])

  return (
    <div>
      <AdminNavbar />
        Admin Dashboard
    </div>
  )
}

export default Dashboard