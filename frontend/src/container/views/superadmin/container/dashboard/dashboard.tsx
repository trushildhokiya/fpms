import SuperAdminNavbar from '@/components/navbar/SuperAdminNavbar'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Line from '@/components/visual/Line'
import Pie from '@/components/visual/Pie'
import { useSelector } from 'react-redux'

type Props = {}

const Dashboard = (props: Props) => {
  const user = useSelector((state: any) => state.user)

  return (
    <div>
        <SuperAdminNavbar />
        <div className="container font-Poppins">

          <h2 className='font-AzoSans text-2xl text-red-800 uppercase mt-7 mb-2'>
            Welcome Back {user.email.split('@')[0]} !
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 my-6 place-content-center">
            <div className="col-span-3 ">

              <Card className='h-full'>
                <CardHeader>
                  <CardTitle> To be Decided</CardTitle>
                </CardHeader>
                <CardContent>
                  Work under progress 🚧 
                </CardContent>
              </Card>

            </div>
            <div className="">
              <Pie />
              <p className='text-xl font-OpenSans text-gray-700 font-bold text-center'>
              Institute Stats
              </p>
            </div>
          </div>

          {/* PAST TRENDS */}
          <div className="my-[5rem]">

            <p className="font-OpenSans font-bold text-gray-700 text-xl my-4">
              Institute Past Trends
            </p>
            <Line />

          </div>


      </div>
    </div>
  )
}

export default Dashboard