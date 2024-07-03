import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Line from '@/components/visual/Line'
import Pie from '@/components/visual/Pie'
import terminalHandler from '@/utils/functions/terminalFunction'
import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';

const Dashboard = () => {


  const user = useSelector((state: any) => state.user)
  const [terminalData, setTerminalData] = useState('Booting FPMS OS...')

  const handleTerminalQuery = (command: string) => {

    setTerminalData( terminalHandler(command) )
    
  }

  return (
    <div>
      <HeadNavbar />

      <div className="container font-Poppins">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 my-6 place-content-center">
          <div className="col-span-3 py-5 ">

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

                  <p className='flex items-center font-Poppins mt-5'>
                    <Sparkles className='w-8 h-8 stroke-1 fill-[#6441A5] mr-2 drop-shadow-sm' /> Suggestions
                  </p>

                  <div className="my-4">
                    <Terminal name='My Shell' height='150px' colorMode={ColorMode.Dark} onInput={terminalInput => handleTerminalQuery(terminalInput)}>
                      <TerminalOutput>{terminalData}</TerminalOutput>
                    </Terminal>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
          <div className="">
            <Pie />
            <p className='text-xl font-OpenSans text-gray-700 font-bold text-center'>
              Department Stats
            </p>
          </div>
        </div>

        {/* PAST TRENDS */}
        <div className="my-[5rem]">

          <p className="font-OpenSans font-bold text-gray-700 text-xl my-4">
            Department Past Trends
          </p>
          <Line />

        </div>


      </div>
    </div>
  )
}

export default Dashboard