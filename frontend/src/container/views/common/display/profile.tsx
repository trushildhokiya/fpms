import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { Mail, Pencil, Phone, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ToastAction } from "@/components/ui/toast"


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

const formSchema = z.object({
    profileImage: z.instanceof(File, { message: 'Image is required' }).refine(
        (file) => file.name.trim() !== '',
        {
            message: `No file uploaded`,
        }
    )
        .refine(
            (file) => file.size <= 600 * 1024, // 600KB in bytes
            {
                message: 'File size must be 600KB or less',
            }
        ),
})



const ProfileDisplay = (props: Props) => {
    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<ProfileData | undefined>(undefined);
    const navigate = useNavigate()
    const { toast } = useToast()

    // Fetch data from API
    useEffect(() => {
        axios.get('/common/profile')
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    // functions
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profileImage: new File([], "")
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {

        axios.put('/common/profile/image', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then((res) => {
                if (res.data.status === 'success') {
                    // taost of success
                    toast({
                        title: 'Update Sucessful',
                        description: " Logout and login again to see the updations.",
                        variant: 'default',
                        action: <ToastAction altText="Okay">Okay</ToastAction>,
                    })
                }
            })
            .catch(() => {

                // toast of error
                toast({
                    title: 'Something went wrong!',
                    description: "There was a error making your request. Try again later !",
                    variant: 'destructive',
                    action: <ToastAction altText="Okay">Okay</ToastAction>,
                })

            })

    }

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
                                    <Badge className='bg-red-800 font-normal'> {data._id} </Badge>
                                    :
                                    <>
                                        <p className='text-sm text-red-800 '>
                                            No data found make sure you have filled your basic details
                                        </p>
                                        <Skeleton className="h-4 mt-4 block w-1/4" />
                                    </>
                                }

                            </div>
                            <div className="grid md:grid-cols-2 gap-6 m-0 p-0">
                                {
                                    data ?
                                        <>
                                            <div className="">

                                                <div className="bg-slate-50 h-full flex justify-center items-center flex-col rounded-3xl shadow-sm py-3">

                                                    <Popover>
                                                        <PopoverTrigger>

                                                            <Avatar className='mx-auto w-32 h-32'>
                                                                <AvatarImage src={user.profileImage} />
                                                                <AvatarFallback>TD</AvatarFallback>
                                                            </Avatar>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <Form {...form}>
                                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name="profileImage"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>
                                                                                    Image
                                                                                </FormLabel>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                                                                                        type="file"
                                                                                        onChange={(e) =>
                                                                                            field.onChange(e.target.files ? e.target.files[0] : null)
                                                                                        }
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                                <FormDescription>
                                                                                    Maximum upload size: 600KB
                                                                                </FormDescription>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                    <Button type="submit" className="bg-red-800">
                                                                        Save Image
                                                                    </Button>
                                                                </form>
                                                            </Form>
                                                        </PopoverContent>
                                                    </Popover>


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
                        <CardFooter className="flex gap-6 flex-wrap">

                            <Button
                                onClick={() => navigate('/common/edit/profile')}
                                size={'lg'} disabled={data ? false : true}
                            >
                                <Pencil className='w-4 h-4 mr-2' color='#fff' /> Edit
                            </Button>

                            <Button size={'lg'} className='bg-teal-600'
                                disabled={data ? true : false}
                                onClick={() => navigate('/common/forms/profile')}
                            >
                                <PlusCircle className='w-4 h-4 mr-2' color='#fff' /> Add basic details
                            </Button>

                        </CardFooter>
                    </Card>
                </div>

            </div>
            <Toaster />
        </div>
    )
}

export default ProfileDisplay;
