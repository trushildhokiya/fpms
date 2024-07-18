
import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Line from '@/components/visual/Line'
import Pie from '@/components/visual/Pie'
import terminalHandler from '@/utils/functions/terminalFunction'
import axios from 'axios'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui'

interface DashboardData {
  pie: {
    id: string;
    value: number;
  }[];
  pastYearPerformanceData: {
    id: string;
    data: {
      x: number;
      y: number;
    }[];
  }[];
}



const Dashboard = () => {


  const user = useSelector((state: any) => state.user)
  const [terminalData, setTerminalData] = useState('Booting FPMS Kernel ========> complete\neg command: my-patent')
  const [dashboardData, setDashboardData] = useState<DashboardData|null>(null)

  const handleTerminalQuery = (command: string) => {
    setTerminalData(terminalHandler(command))
  }

  useEffect(() => {
    axios.get('/faculty/dashboard')
      .then((res) => {
        setDashboardData(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])



  return (
    <div>
      <FacultyNavbar />

      <div className="container font-Poppins">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-6 place-content-center">
          <div className="col-span-2 ">

            <Card className='h-full'>
              <CardHeader className='font-AzoSans text-2xl text-red-800 uppercase'>
                <CardTitle>
                  Welcome Back {user.email.split('@')[0]} !
                </CardTitle>
              </CardHeader>
              <CardContent>

                <div className="flex flex-wrap mb-2">
                  {user.tags.map((tag: string) => {
                    return (
                      <Badge key={tag} className='lowercase mr-3 my-1 font-normal bg-green-800 bg-opacity-85 text-green-200 glow'>{tag}</Badge>
                    )
                  })}
                </div>

                <div className="">

                  {/* animated stars */}
                  <p className='flex items-center font-Poppins mt-5'>
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6274e7">
                            <animate attributeName="stop-color" values="#6274e7;#8752a3;#8711c1;#2472fc" dur="5s" repeatCount="indefinite" />
                          </stop>
                          <stop offset="100%" stopColor="#2472fc">
                            <animate attributeName="stop-color" values="#8752a3;#6274e7;#8711c1;#2472fc" dur="5s" repeatCount="indefinite" />
                          </stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <Sparkles className='w-8 h-8 stroke-1 mr-2 drop-shadow-sm' style={{ fill: 'url(#gradient)' }} />
                    Suggestions
                  </p>

                  {/* Terminal  */}
                  <div className="my-4">
                    <Terminal name='My Shell' height='150px' colorMode={ColorMode.Dark} onInput={terminalInput => handleTerminalQuery(terminalInput)}>
                      <TerminalOutput>{terminalData}</TerminalOutput>
                    </Terminal>
                  </div>
                </div>
              </CardContent>

            </Card>


          </div>
          <div className="flex flex-col w-full justify-center items-center">
              <Pie data={dashboardData?.pie} />
            <p className='text-xl font-OpenSans text-gray-700 font-bold text-center'>
              My Stats
            </p>
          </div>
        </div>

        {/* PAST TRENDS */}
        <div className="my-[5rem]">

          <p className="font-OpenSans font-bold text-gray-700 text-xl my-4">
            Performance Past Trends
          </p>
          <Line data={dashboardData?.pastYearPerformanceData} />

        </div>


      </div>
    </div>
  )
}

export default Dashboard