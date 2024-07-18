import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import { Pencil, PlusCircle, School } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'


// Define interface for profile data
interface QualificationData {
    degree: string;
    stream: string;
    institute: string;
    university: string;
    year: number;
    class: string;
    status: string;
    _id: string;
}


type Props = {}




const QualificationDisplay = (props: Props) => {

    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<QualificationData[] | undefined>(undefined);
    const navigate = useNavigate()

    // Fetch data from API
    useEffect(() => {
        axios.get('/common/qualification')
            .then((res) => {
                setData(res.data)
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])



    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container p-2 my-10">

                <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                    Qualification Details
                </h1>

                <div className="my-10">
                    <Card className="font-Poppins">
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>My Qualifications</CardTitle>
                            <CardDescription>Qualification details of the faculty is shown below</CardDescription>
                        </CardHeader>
                        <CardContent className=''>

                            {
                                !data ?
                                    <>
                                        <Skeleton className='w-full h-96' />
                                    </>
                                    :
                                    <>
                                        {
                                            data.map((qualification) => {
                                                return (
                                                    <Collapsible key={qualification._id}>
                                                        <CollapsibleTrigger className={`bg-lime-500  p-2 w-full my-4 rounded-lg capitalize`}>
                                                            <p className='text-lg text-gray-700 font-semibold'>
                                                                {qualification.degree} Degree
                                                            </p>
                                                            <p className='text-sm text-emerald-900'>
                                                                {qualification.university}
                                                            </p>
                                                        </CollapsibleTrigger>
                                                        <CollapsibleContent className='mb-10'>
                                                            <Card>
                                                                <CardContent className='py-5 p-2 md:p-6'>
                                                                    <div className='grid md:grid-cols-2 gap-6'>
                                                                        <div className="p-3 py-8 justify-center flex flex-col items-center rounded-2xl bg-zinc-50 shadow-lg capitalize">
                                                                            <h2 className="text-gray-600 font-semibold ">
                                                                                {qualification.degree} in {qualification.stream}
                                                                            </h2>
                                                                            <p className='my-2 text-sm font-semibold text-gray-500'>
                                                                                {qualification.status}
                                                                            </p>
                                                                            <div className="my-3">
                                                                                <Badge className='bg-blue-400 bg-opacity-40 text-blue-800'>{qualification._id}</Badge>
                                                                            </div>
                                                                        </div>
                                                                        <div className="p-3 py-8 rounded-2xl bg-zinc-50 shadow-lg capitalize">

                                                                            <Alert className='my-3 border-lime-400'>
                                                                                <School className="h-4 w-4" />
                                                                                <AlertTitle className='text-gray-600 font-semibold'>Institute</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {qualification.institute}
                                                                                </AlertDescription>
                                                                            </Alert>

                                                                             <Alert className='my-3 border-green-400'>
                                                                                <School className="h-4 w-4" />
                                                                                <AlertTitle className='text-gray-600 font-semibold'>University</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {qualification.university}
                                                                                </AlertDescription>
                                                                            </Alert>

                                                                             <Alert className='my-3 border-emerald-400'>
                                                                                <School className="h-4 w-4" />
                                                                                <AlertTitle className='text-gray-600 font-semibold'>Class</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {qualification.class}
                                                                                </AlertDescription>
                                                                            </Alert>

                                                                             <Alert className='my-3 border-teal-400'>
                                                                                <School className="h-4 w-4" />
                                                                                <AlertTitle className='text-gray-600 font-semibold'>Year of Completion</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {qualification.year}
                                                                                </AlertDescription>
                                                                            </Alert>



                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </CollapsibleContent>
                                                    </Collapsible>
                                                )
                                            })
                                        }
                                    </>
                            }
                        </CardContent>
                        <CardFooter className="flex gap-6 flex-wrap">

                            <Link to='/common/edit/qualification'>
                                <Button size={'lg'} disabled={data ? false : true}>
                                    <Pencil className='w-4 h-4 mr-2' color='#fff' /> Edit
                                </Button>
                            </Link>

                            <Button size={'lg'} className='bg-teal-600'
                                disabled={data ? true : false}
                                onClick={() => navigate('/common/forms/qualification')}
                            >
                                <PlusCircle className='w-4 h-4 mr-2' color='#fff' /> Add qualification details
                            </Button>

                        </CardFooter>
                    </Card>
                </div>

            </div>
        </div>
    )
}

export default QualificationDisplay;
