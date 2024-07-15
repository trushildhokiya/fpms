import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Link as LinkIcon, Pencil, Pin, PlusCircle, Tally5 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'


type Props = {}

interface ResearchData {
    _id: string,
    name: string;
    department: string;
    designation: string;
    contact: number;
    email: string;
    googleScholarId: string;
    googleScholarUrl: string;
    scopusId: string;
    scopusUrl: string;
    orcidId: string;
    hIndexGoogleScholar: string;
    hIndexScopus: string;
    citationCountGoogleScholar: number;
    citationCountScopus: number;
    iTenIndexGoogleScholar: string;
    iTenIndexScopus: string;
}


const ResearchProfileDisplay = (props: Props) => {


    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<ResearchData | undefined>()
    const navigate = useNavigate()

    useEffect(() => {

        axios.get('/common/research-profile')
            .then((res) => {
                console.log(res.data);
                setData(res.data)
            })
            .catch((err) => {
                console.log(err);
            })

    }, [])

    return (
        <div>

            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container my-10 p-2">

                <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                    Research Profile
                </h1>

                <div className="my-10">

                    <Card className='font-Poppins'>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Research Details</CardTitle>
                            <CardDescription>Research details of the faculty is shown below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-5">
                                {data ?
                                    <Badge className='bg-red-800 font-normal'> {data._id} </Badge>
                                    :
                                    <>
                                        <p className='text-sm text-red-800 '>
                                            No data found make sure you have filled your reserach details
                                        </p>
                                        <Skeleton className="h-4 mt-4 block w-1/4" />
                                    </>
                                }

                            </div>

                            <div className="">

                                {
                                    data ?
                                        <>
                                            <div className="grid md:grid-cols-2 gap-6">

                                                <div className="md:col-span-2">
                                                    <Alert className='my-3'>
                                                        <Pin className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>Orchid ID</AlertTitle>
                                                        <AlertDescription>
                                                            <Badge className='bg-amber-500 text-gray-900 hover:bg-amber-400'>{data.orcidId}</Badge>
                                                        </AlertDescription>
                                                    </Alert>
                                                </div>

                                                <div className="shadow-md md:p-6 p-3 py-6 my-6">

                                                    <h2 className='text-center font-bold uppercase text-2xl text-gray-700'>
                                                        Google Scholar
                                                    </h2>

                                                    <Alert className='my-3'>
                                                        <Pin className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>ID</AlertTitle>
                                                        <AlertDescription>
                                                            <Badge className='bg-blue-500 font-normal text-white'>{data.googleScholarId}</Badge>
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Alert className='my-3'>
                                                        <LinkIcon className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>URL</AlertTitle>
                                                        <AlertDescription>
                                                            <a target='_blank' href={data.googleScholarUrl} className='text-blue-800'>Visit profile</a>
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Alert className='my-3'>
                                                        <Pin className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>H-Index</AlertTitle>
                                                        <AlertDescription>
                                                            {data.hIndexGoogleScholar}
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Alert className='my-3'>
                                                        <Pin className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>I10 Index</AlertTitle>
                                                        <AlertDescription>
                                                            {data.iTenIndexGoogleScholar}
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Alert className='my-3'>
                                                        <Tally5 className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>Citation Count</AlertTitle>
                                                        <AlertDescription>
                                                            {data.citationCountGoogleScholar}
                                                        </AlertDescription>
                                                    </Alert>

                                                </div>

                                                <div className="shadow-md md:p-6 p-3 py-6 my-6">

                                                    <h2 className='text-center font-bold uppercase text-2xl text-gray-700'>
                                                        Scopus
                                                    </h2>

                                                    <Alert className='my-3'>
                                                        <Pin className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>ID</AlertTitle>
                                                        <AlertDescription>
                                                            <Badge className='bg-lime-500  text-black'>{data.scopusId}</Badge>
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Alert className='my-3'>
                                                        <LinkIcon className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>URL</AlertTitle>
                                                        <AlertDescription>
                                                            <a target='_blank' href={data.scopusUrl} className='text-blue-800'>Visit profile</a>
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Alert className='my-3'>
                                                        <Pin className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>H-Index</AlertTitle>
                                                        <AlertDescription>
                                                            {data.hIndexScopus}
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Alert className='my-3'>
                                                        <Pin className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>I10 Index</AlertTitle>
                                                        <AlertDescription>
                                                            {data.iTenIndexScopus}
                                                        </AlertDescription>
                                                    </Alert>

                                                    <Alert className='my-3'>
                                                        <Tally5 className="h-4 w-4" />
                                                        <AlertTitle className='text-red-800'>Citation Count</AlertTitle>
                                                        <AlertDescription>
                                                            {data.citationCountScopus}
                                                        </AlertDescription>
                                                    </Alert>

                                                </div>

                                            </div>
                                        </>
                                        :
                                        <Skeleton className="h-64 mt-4 block w-fill col-span-2" />
                                }
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-6 flex-wrap">

                             <Link to='/common/edit/research-profile'>
                                <Button size={'lg'} disabled={data ? false : true}>
                                    <Pencil className='w-4 h-4 mr-2' color='#fff' /> Edit
                                </Button>
                            </Link>

                            <Button size={'lg'} className='bg-teal-600'
                                disabled={data ? true : false}
                                onClick={() => navigate('/common/forms/research-profile')}
                            >
                                <PlusCircle className='w-4 h-4 mr-2' color='#fff' /> Add research details
                            </Button>

                        </CardFooter>

                    </Card>

                </div>

            </div>
        </div>
    )
}

export default ResearchProfileDisplay