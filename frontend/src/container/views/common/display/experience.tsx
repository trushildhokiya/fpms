import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import { Building2, FileCheck2, GraduationCap, Layers3, Pencil, PlusCircle, SigmaSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

type Props = {}

interface exp {
    designation: string;
    experienceIndustry: string;
    experienceProof: string;
    experienceType: string;
    fromDate: string;
    organizationAddress: string;
    organizationName: string;
    organizationUrl: string;
    toDate: string;
    totalExperience: string;
    _id: string;
}


interface ExperienceData {

    experience: exp[],
    industryExperience: string,
    teachingExperience: string,
    totalExperience: string,
}

const ExperienceDisplay = (props: Props) => {

    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<ExperienceData>()
    const navigate = useNavigate()


    // Fetch data from API
    useEffect(() => {
        axios.get('/common/experience')
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

            <div className="container my-10 p-2 ">

                <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                    Experience Details
                </h1>


                <div className="my-10">

                    <Card className='font-Poppins'>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>My Experience</CardTitle>
                            <CardDescription>Experience details of the faculty is shown below</CardDescription>
                        </CardHeader>
                        <CardContent className=''>

                            <div className="grid md:grid-cols-2 gap-6">

                                {
                                    data?.experience.length !== 0
                                        ?
                                        <>
                                            <Alert className='border-red-400'>
                                                <Building2 className="h-5 w-5" />
                                                <AlertTitle>Industry Experience</AlertTitle>
                                                <AlertDescription className=''>
                                                    {data?.industryExperience}
                                                </AlertDescription>
                                            </Alert>

                                            <Alert className='border-teal-400'>
                                                <GraduationCap className="h-5 w-5" />
                                                <AlertTitle>Teaching Experience</AlertTitle>
                                                <AlertDescription className=''>
                                                    {data?.teachingExperience}
                                                </AlertDescription>
                                            </Alert>

                                            <Alert className='bg-amber-400 md:col-span-2'>
                                                <SigmaSquare className="h-5 w-5" />
                                                <AlertTitle>Total Experience</AlertTitle>
                                                <AlertDescription className='text-gray-900'>
                                                    {data?.totalExperience}
                                                </AlertDescription>
                                            </Alert>
                                        </>
                                        :
                                        <>
                                            <p className='text-sm text-red-800 '>
                                                No data found make sure you have filled your experience details
                                            </p>
                                        </>
                                }


                            </div>

                            <div className="my-10 p-2">

                                {
                                    data?.experience.length !== 0
                                        ?
                                        data?.experience.map((exp) => {
                                            return (
                                                <Collapsible key={exp._id}>
                                                    <CollapsibleTrigger className={`bg-emerald-500  p-2 w-full my-4 rounded-lg`}>
                                                        <p className='text-lg text-black'>
                                                            {exp.organizationName}
                                                        </p>
                                                        <p className='text-sm text-emerald-900'>
                                                            {exp.designation}
                                                        </p>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className='mb-10'>
                                                        <Card>
                                                            <CardContent className='py-5 p-2 md:p-6'>

                                                                <div className="grid md:grid-cols-2 gap-6 my-5">
                                                                    <div className="md:shadow-md md:p-2">

                                                                        <h2 className='text-xl font-semibold text-center uppercase text-gray-600'>
                                                                            COMMON
                                                                        </h2>

                                                                        <div className="my-2 md:p-3">
                                                                            <Badge className='bg-red-800'>{exp._id}</Badge>

                                                                            <Alert className='my-3'>
                                                                                <Layers3 className='h-4 w-4 mr-2' />
                                                                                <AlertTitle className='text-red-800 tracking-wide'>Experience Industry Type</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {exp.experienceIndustry}
                                                                                </AlertDescription>
                                                                            </Alert>

                                                                            <Alert className='my-3'>
                                                                                <Layers3 className='h-4 w-4 mr-2' />
                                                                                <AlertTitle className='text-red-800 tracking-wide'>Experience Type</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {exp.experienceType}
                                                                                </AlertDescription>
                                                                            </Alert>


                                                                        </div>

                                                                    </div>

                                                                    <div className="md:shadow-md p-2">

                                                                        <h2 className='text-xl font-semibold text-center uppercase text-gray-600'>
                                                                            Organization
                                                                        </h2>

                                                                        <div className="my-2 md:p-3">

                                                                            <Alert className='my-3'>
                                                                                <Layers3 className='h-4 w-4 mr-2' />
                                                                                <AlertTitle className='text-red-800 tracking-wide'>Name</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {exp.organizationName}
                                                                                </AlertDescription>
                                                                            </Alert>

                                                                            <Alert className='my-3'>
                                                                                <Layers3 className='h-4 w-4 mr-2' />
                                                                                <AlertTitle className='text-red-800 tracking-wide'>Address</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {exp.organizationAddress}
                                                                                </AlertDescription>
                                                                            </Alert>

                                                                            <Alert className='my-3'>
                                                                                <Layers3 className='h-4 w-4 mr-2' />
                                                                                <AlertTitle className='text-red-800 tracking-wide'>Website</AlertTitle>
                                                                                <AlertDescription>
                                                                                    <a className='text-blue-800 ' target='_blank' href={exp.organizationUrl}>Visit site</a>
                                                                                </AlertDescription>
                                                                            </Alert>


                                                                        </div>

                                                                    </div>

                                                                    <div className="md:shadow-md md:col-span-2 p-2">

                                                                        <h2 className='text-xl font-semibold text-center uppercase text-gray-600'>
                                                                            Duration and Proof
                                                                        </h2>

                                                                        <div className="my-2 md:p-3">

                                                                            <Alert className='my-3'>
                                                                                <Layers3 className='h-4 w-4 mr-2' />
                                                                                <AlertTitle className='text-red-800 tracking-wide'>Date of Joining</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {new Date(exp.fromDate).toDateString()}
                                                                                </AlertDescription>
                                                                            </Alert>

                                                                            <Alert className='my-3'>
                                                                                <Layers3 className='h-4 w-4 mr-2' />
                                                                                <AlertTitle className='text-red-800 tracking-wide'>Date of Leaving</AlertTitle>
                                                                                <AlertDescription>
                                                                                    {new Date(exp.toDate).toDateString()}
                                                                                </AlertDescription>
                                                                            </Alert>

                                                                            <Link target='_blank' to={ axios.defaults.baseURL +'/'+ exp.experienceProof.split('uploads')[1]}>
                                                                                <Button className='bg-red-800 text-white'>
                                                                                    <FileCheck2 className='h-4 w-4 mr-2' />Proof
                                                                                </Button>
                                                                            </Link>

                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            )
                                        })
                                        :
                                        <>
                                            <Skeleton className='w-full  h-64' />
                                        </>
                                }

                            </div>

                        </CardContent>
                        <CardFooter className="flex gap-6 flex-wrap">

                            <Button size={'lg'}>
                                <Pencil className='w-4 h-4 mr-2' color='#fff' /> Edit
                            </Button>

                            <Button size={'lg'} className='bg-teal-600'
                                disabled={data?.experience.length !== 0 ? true : false}
                                onClick={() => navigate('/common/forms/experience')}
                            >
                                <PlusCircle className='w-4 h-4 mr-2' color='#fff' /> Add experience details
                            </Button>

                        </CardFooter>
                    </Card>


                </div>

            </div>


        </div>
    )
}

export default ExperienceDisplay