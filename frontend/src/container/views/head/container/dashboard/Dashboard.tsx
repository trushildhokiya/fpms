import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command'
import Line from '@/components/visual/Line'
import Pie from '@/components/visual/Pie'
import terminalHandler from '@/utils/functions/terminalFunction'
import axios from 'axios'
import { Sparkles, TerminalIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';

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
  const [dashboardData, setDashboardData] = useState<DashboardData>()


  const handleTerminalQuery = (command: string) => {

    setTerminalData(terminalHandler(command))

  }
  
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  useEffect(()=>{

    axios.get('/head/dashboard')
    .then((res)=>{
      setDashboardData(res.data)
    })
    .catch((err)=>{
      console.error(err);
    })

  },[])

  return (
    <div>
      <HeadNavbar />

      <div className="container font-Poppins">

                {/* ACCESSIBILTY  */}
                <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Research">
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Patents</span>
                <CommandShortcut>my-patents | patent</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Copyright</span>
                <CommandShortcut>my-copyright | copyright</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Publications">
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Journal</span>
                <CommandShortcut>my-journal | journal</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Conference</span>
                <CommandShortcut>my-conference | conference</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Book</span>
                <CommandShortcut>my-book | book</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Book Chapter</span>
                <CommandShortcut>my-book-chapter | book-chapter</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Major/Minor Projects</span>
                <CommandShortcut>my-projects | projects</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Need based Project</span>
                <CommandShortcut>my-nbp | nbp</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Awards & Honors</span>
                <CommandShortcut>my-awards-honors | awards-honors</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Consultancy</span>
                <CommandShortcut>my-consultancy | consultancy</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Others">
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Synchronize</span>
                <CommandShortcut>re-init</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Logout</span>
                <CommandShortcut>logout</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Suggestions</span>
                <CommandShortcut>suggestion</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-6 place-content-center">
          <div className="col-span-2 py-5 ">

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

                  {/* Terminal */}
                  <div className="my-4">
                    <Terminal name='My Shell' height='150px' colorMode={ColorMode.Dark} onInput={terminalInput => handleTerminalQuery(terminalInput)}>
                      <TerminalOutput>{terminalData}</TerminalOutput>
                    </Terminal>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>
          <div className="flex flex-col justify-center items-center">
            <Pie data={dashboardData?.pie} />
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
          <Line data={dashboardData?.pastYearPerformanceData} />

        </div>


      </div>
    </div>
  )
}

export default Dashboard