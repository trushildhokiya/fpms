import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import { Mail, Pencil, Phone, Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// Define interface for profile data
interface ProfileData {
    _id: string,
    name: string,
    email: string,
    designation: string,
    department: string,
    contact: number,
    alternateContact: number,
    alternateEmail: string,
}

type Props = {}

const ProfileDisplay = (props: Props) => {
    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<ProfileData | undefined>(undefined);

    // Fetch data from API
    useEffect(() => {
        axios.get('/common/profile')
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
                    Basic Details
                </h1>

                <div className="my-10">
                    <Card className="font-Poppins">
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>My Details</CardTitle>
                            <CardDescription>Basic details of the faculty is shown below</CardDescription>
                        </CardHeader>
                        <CardContent className=''>
                            <div className="mb-5">
                                {data ?
                                    <Badge className='bg-red-800'> {data._id} </Badge>
                                    :
                                    <Skeleton className="h-4 inline-block w-1/4" />
                                }

                            </div>
                            <div className="grid md:grid-cols-2 gap-6 m-0 p-0">
                                {
                                    data ?
                                        <>
                                            <div className="">

                                                <div className="bg-slate-50 h-full flex justify-center items-center flex-col rounded-3xl shadow-sm py-3">

                                                    <Avatar className='mx-auto w-32 h-32'>
                                                        <AvatarImage src={user.profileImage} />
                                                        <AvatarFallback>TD</AvatarFallback>
                                                    </Avatar>

                                                    <div className="md:p-5">

                                                        <div className="text-center text-2xl font-bold text-gray-600">
                                                            {data.name}
                                                        </div>
                                                        <p className='text-center text-sm leading-5 text-gray-500'>
                                                            {data.designation}
                                                        </p>
                                                        <p className='text-center text-sm leading-5 text-gray-500'>
                                                            Department of {data.department} Engineering
                                                        </p>


                                                    </div>

                                                </div>

                                            </div>

                                            <div className="">

                                                <div className=" my-5 rounded-3xl shadow-md py-3">

                                                    <div className="md:p-5 p-3">
                                                        <h2 className='text-center font-bold uppercase text-2xl text-gray-700'>
                                                            Email
                                                        </h2>

                                                        <Alert className='my-2 text-gray-600'>
                                                            <Mail className="h-4 w-4" />
                                                            <AlertTitle>{data.email}</AlertTitle>
                                                        </Alert>

                                                        <Alert className='my-2 text-gray-600'>
                                                            <Mail className="h-4 w-4" />
                                                            <AlertTitle>{data.alternateEmail}</AlertTitle>
                                                        </Alert>


                                                    </div>

                                                </div>

                                                <div className=" my-5 rounded-3xl shadow-md py-3">

                                                    <div className="md:p-5 p-3">
                                                        <h2 className='text-center font-bold uppercase text-2xl text-gray-700'>
                                                            Contact
                                                        </h2>

                                                        <Alert className='my-2 text-gray-600'>
                                                            <Phone className="h-4 w-4" />
                                                            <AlertTitle>{data.contact}</AlertTitle>
                                                        </Alert>

                                                        <Alert className='my-2 text-gray-600'>
                                                            <Phone className="h-4 w-4" />
                                                            <AlertTitle>{data.alternateContact}</AlertTitle>
                                                        </Alert>


                                                    </div>

                                                </div>

                                            </div>

                                        </>
                                        :
                                        <Skeleton className='w-full md:col-span-2 h-64' />
                                }
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">

                            <Button size={'lg'}>
                                <Pencil className='w-4 h-4 mr-2' color='#fff' /> Edit
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

            </div>
        </div>
    )
}

export default ProfileDisplay;
