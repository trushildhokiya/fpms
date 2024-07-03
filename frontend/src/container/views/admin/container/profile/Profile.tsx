import AdminNavbar from "@/components/navbar/AdminNavbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { useSelector } from "react-redux"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MailCheckIcon, Terminal } from "lucide-react"


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



const Profile = () => {


    const user = useSelector((state: any) => state.user)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profileImage: new File([], "")
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        axios.put('/admin/profile/image', values, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'token': localStorage.getItem('token'),
                'email': user.email ? user.email : ''
            }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
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
            <AdminNavbar />
            <div className="container font-Poppins">



                <div className="my-10">

                    <div className="my-10">
                        <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                            My Profile
                        </h1>
                    </div>

                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-600 tracking-wide">
                                My Profile
                            </CardTitle>
                            <CardDescription>
                                To edit your avatar click on the avator and upload new image
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="my-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="rounded-3xl bg-slate-50 shadow-md p-2 md:py-10 py-6">

                                    <div className="flex flex-col justify-center items-center">

                                        <Popover>
                                            <PopoverTrigger>
                                                <Avatar className="md:w-56 w-36 h-36 md:h-56">
                                                    <AvatarImage src={user.profileImage ? user.profileImage : ''} className="object-cover" />
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

                                        <div className="text-center my-5 py-5">
                                            <p className="text-gray-600 font-bold leading-5">Admin</p>
                                            <p className="text-gray-500 leading-7 text-sm">{user.institute ? user.institute : ""}</p>
                                        </div>

                                    </div>

                                </div>
                                <div className="">

                                    <div className="">
                                        <Alert className="border-red-800">
                                            <MailCheckIcon className="h-5 w-5" />
                                            <AlertTitle className="font-semibold text-gray-600">Email</AlertTitle>
                                            <AlertDescription className="my-2">
                                                {user.email}
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Profile