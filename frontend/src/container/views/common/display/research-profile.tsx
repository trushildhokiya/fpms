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
import { Pencil, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


type Props = {}

interface ResearchData {
    _id:string,
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
                console.log(res);
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
                                    <Badge className='bg-red-800'> {data._id} </Badge>
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
                                    data?
                                    <>
                                        <div className="grid md:grid-cols-2 gap-6">

                                            <div className="">Section 01</div>
                                            <div className="">Section 02</div>

                                        </div>
                                    </>
                                    :
                                    <Skeleton className="h-64 mt-4 block w-fill col-span-2" />
                                }
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-6 flex-wrap">

                            <Button size={'lg'}>
                                <Pencil className='w-4 h-4 mr-2' color='#fff' /> Edit
                            </Button>

                            <Button size={'lg'} className='bg-teal-600'
                            disabled={data? true : false}
                            onClick={()=>navigate('/common/forms/research-profile')}
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