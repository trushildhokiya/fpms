import { useSelector } from "react-redux"
import AdminNavbar from "@/components/navbar/AdminNavbar"
import Pie from "@/components/visual/Pie"
import Line from "@/components/visual/Line"
import Radar from "@/components/visual/Radar"
import axios from "axios"
import { useState, useEffect } from "react"

interface DepartmentData {
  id: string;
  value: number;
}

interface PastYearPerformanceData {
  x: number;
  y: number;
}

interface DashboardData {
  institution:DepartmentData[];
  computer: DepartmentData[];
  it: DepartmentData[];
  aids: DepartmentData[];
  extc: DepartmentData[];
  bsh: DepartmentData[];
  pastYearPerformance: {
    id: string;
    data: PastYearPerformanceData[];
  }[];
  radar: {
    department: string;
    patent: number;
    publication: number;
    project: number;
    consultancy: number;
    copyright: number;
  }[];
}


const Dashboard = () => {

  const user = useSelector((state: any) => state.user)
  const [dashboardData, setDashboardData] = useState<DashboardData>()


  useEffect(() => {

    axios.get('/admin/dashboard')
      .then((res) => {
        setDashboardData(res.data)
      })
      .catch((err) => {
        console.error(err);
      })

  }, [])

  return (
    <div>
      <AdminNavbar />

      <div className="container font-Poppins">
        <div className="font-AzoSans text-2xl font-semibold  text-red-800 uppercase mt-7 mb-2">
          Welcome Back {user ? user.email.split('@')[0] : ''} !
        </div>

        {/* Donuts  */}
        <p className="font-OpenSans font-bold text-gray-700 text-xl my-4">
          Institute & Department Wise Summary
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10">

          <div className="">
            <Pie data={dashboardData?.institution}  />
            <p className="my-3 font-xl font-semibold text-center text-red-800">
              Institutional Count
            </p>
          </div>

          <div className="">
            <Pie data={dashboardData?.computer} />
            <p className="my-3 font-xl text-center text-red-800">
              Computer Department
            </p>
          </div>

          <div className="">
            <Pie data={dashboardData?.bsh} />
            <p className="my-3 font-xl text-center text-red-800">
              BSH Department
            </p>
          </div>

          <div className="">
            <Pie data={dashboardData?.it} />
            <p className="my-3 font-xl text-center text-red-800">
              IT Department
            </p>
          </div>

          <div className="">
            <Pie data={dashboardData?.aids} />
            <p className="my-3 font-xl text-center text-red-800">
              AIDS Department
            </p>
          </div>

          <div className="">
            <Pie data={dashboardData?.extc} />
            <p className="my-3 font-xl  text-center text-red-800">
              EXTC Department
            </p>
          </div>

        </div>

        {/* Lines  */}
        <p className="font-OpenSans font-bold text-gray-700 text-xl my-4">
          Institute Past Trends
        </p>

        <Line data={dashboardData?.pastYearPerformance} />

        {/* Radar  */}
        <p className="font-OpenSans font-bold text-gray-700 text-xl my-4">
          Department Performance Stats
        </p>
        <Radar data={dashboardData?.radar} />

      </div>
    </div>
  )
}

export default Dashboard