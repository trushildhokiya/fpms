import { useSelector } from "react-redux"
import AdminNavbar from "@/components/navbar/AdminNavbar"
import Pie from "@/components/visual/Pie"
import Line from "@/components/visual/Line"
import Radar from "@/components/visual/Radar"

const Dashboard = () => {

  const user = useSelector((state: any) => state.user)

  return (
    <div>
      <AdminNavbar />

      <div className="container font-Poppins">
        <div className="font-AzoSans text-2xl font-semibold  text-red-800 uppercase mt-7 mb-2">
          Welcome Back {user ? user.email.split('@')[0] : ''} !
        </div>

        {/* Donuts  */}
        <p className="font-OpenSans font-bold text-gray-700 text-xl my-4">
          Department Wise Summary
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10">

          <div className="">
            <Pie />
            <p className="my-3 font-xl text-center text-red-800">
              Computer Department
            </p>
          </div>

          <div className="">
            <Pie />
            <p className="my-3 font-xl text-center text-red-800">
              IT Department
            </p>
          </div>

          <div className="">
            <Pie />
            <p className="my-3 font-xl text-center text-red-800">
              AIDS Department
            </p>
          </div>

          <div className="">
            <Pie />
            <p className="my-3 font-xl  text-center text-red-800">
              EXTC Department
            </p>
          </div>

        </div>

        {/* Lines  */}
        <p className="font-OpenSans font-bold text-gray-700 text-xl my-4">
          Institute Past Trends
        </p>

        <Line />

        {/* Radar  */}
        <p className="font-OpenSans font-bold text-gray-700 text-xl my-4">
          Department Performance Stats
        </p>
        <Radar />

      </div>
    </div>
  )
}

export default Dashboard