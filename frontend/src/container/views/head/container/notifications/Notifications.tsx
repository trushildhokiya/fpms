import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getDecodedToken } from '@/utils/functions/authFunctions';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const Notifications = () => {


    useEffect(() => {
        getNotifications()
    }, [])


    interface ResearchNotification {
        title: string;
        description: string;
        imageUrl: string;
        referenceUrl: string;
        department: string;
    }

    const [notifications, setNotifications] = useState<ResearchNotification[]>([])

    const { email } = getDecodedToken()
    const { toast } = useToast()

    const getNotifications: Function = () => {

        axios.get('/head/notifications', {
            headers: {
                'token': localStorage.getItem('token'),
                'email': email
            }
        })
            .then((res) => {

                setNotifications(res.data)

            })
            .catch((err) => {

                // toast of error
                toast({
                    title: 'Something went wrong!',
                    description: err.response.data.message,
                    variant: 'destructive',
                    action: <ToastAction altText="Okay">Okay</ToastAction>,
                })
            })


    }

    return (
        <div>
            <HeadNavbar />
            <div className="container font-Poppins">

                <div className="my-10">
                    <span className=' text-2xl text-red-800 uppercase font-AzoSans md:text-4xl border-b-4 border-red-800'>
                        Notifications
                    </span>
                </div>

                {
                    notifications.length > 0
                        ?
                        <div className="w-full md:w-[50%] lg:w-[40%] mx-auto">
                            {
                                notifications.map((post, index) => {
                                    return (
                                        <Card className='my-8' key={index}>
                                            <div className="h-[150px] rounded-t overflow-hidden brightness-75 ">
                                                <img src={post.imageUrl} className=' object-cover w-full h-full' alt="Research Image" />
                                            </div>
                                            <CardHeader>
                                                <CardTitle className='text-gray-700 font-OpenSans leading-7'>
                                                    {post.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className='text-sm '>
                                                {post.description}
                                            </CardContent>
                                            <CardFooter className='flex justify-end'>
                                                <Button className='mx-5 bg-red-800'>
                                                    <a href={post.referenceUrl} target='_blank'>
                                                        See More
                                                    </a>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )
                                })
                            }
                        </div>
                        :
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-gray-600 font-OpenSans'>
                                    No Records Found
                                </CardTitle>
                            </CardHeader>
                        </Card>
                }
            </div>
            <Toaster />
        </div>
    )
}

export default Notifications