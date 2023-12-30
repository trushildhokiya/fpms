import HeadNavbar from "@/components/navbar/HeadNavbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getDecodedToken } from "@/utils/functions/authFunctions"

const formSchema = z.object({
    title: z.string().min(3, {
        message: 'Title is required (min. 3 characters)'
    }).max(40, {
        message: 'Title must not exceed 40 characters'
    }),

    description: z.string().min(5, {
        message: 'Description is required (min. 5 characters)'
    }).max(250, {
        message: 'Description must not exceed 250 characters'
    }),

    imageUrl: z.string().regex(/^(https?|ftp):\/\/[^\s/$.?#]*[^\s]*$|^$/, {
        message: 'Invalid Url'
    }),

    referenceUrl: z.string().regex(/^(https?|ftp):\/\/[^\s/$.?#]*[^\s]*$|^$/, {
        message: 'Invalid reference link'
    }),

    department: z.string().min(2)

})

const Notify = () => {

    const { department } = getDecodedToken()

    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            imageUrl: "",
            referenceUrl: "",
            department: department!,
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {

        axios.post('/head/notify', data, {
            headers: {
                'token': localStorage.getItem('token')
            }
        })
            .then((res) => {

                if (res.data.status === 'Success') {

                    // toast of success
                    toast({
                        title: 'Notfication created',
                        description: 'Notification created successfully ',
                        action: (
                            <ToastAction altText="Okay">Okay</ToastAction>
                        ),
                    })
                }
            })
            .catch((err) => {

                //toast of error
                toast({
                    title: 'Something went wrong',
                    description: err.response.data.message,
                    variant: 'destructive',
                    action: (
                        <ToastAction altText="Okay">Okay</ToastAction>
                    ),
                })
            })

            form.reset()
    }

    return (
        <div>
            <HeadNavbar />
            <div className="container font-Poppins">

                {/* HEADING  */}
                <div className="my-8">
                    <span className="uppercase md:text-4xl font-bold font-AzoSans text-2xl text-red-800 border-b-4 border-red-800">
                        Notify
                    </span>
                </div>

                <Card className="mx-auto w-full md:w-[70%] lg:w-[60%] my-8 ">
                    <CardHeader>
                        <CardTitle className="font-OpenSans text-gray-700">
                            New Notification
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Fill out the form to create a new notfication for all faculties in your department
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Research Opputinity. Cornell University" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Title will be displayed as headings on notifications
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Discover exciting research opportunities at Cornell University, where innovation meets excellence. Dive into a world of cutting-edge projects spanning diverse fields. "
                                                    className=" resize-y"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://via.placeholder.com/400x400" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Optional! Image to display along your post
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="referenceUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reference Url</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://undergraduateresearch.cornell.edu/research-opportunities/" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Optional. Link to refernce article.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="bg-red-800 text-white">Submit</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </div>
    )
}

export default Notify