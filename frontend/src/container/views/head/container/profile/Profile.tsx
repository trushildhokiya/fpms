import HeadNavbar from "@/components/navbar/HeadNavbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadUserData } from "@/utils/functions/reduxFunctions"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    profileImage: z.instanceof(File, { message: 'Image is required' }).refine(
        (file) =>file.name.trim() !== '',
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

    useEffect(() => {
        loadUserData()
    }, [])

    const user = useSelector((state: any) => state.user)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profileImage: new File([], "")
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {

        console.log(data);
        
    }
    
    return (
        <div>
            <HeadNavbar />
            <div className="container font-Poppins">

                <div className="my-10">

                    <Card className="lg:w-[60%] md:w-[70%] w-full mx-auto">
                        <CardHeader>
                            <CardTitle>
                                <p className="font-OpenSans my-2 text-gray-900">
                                    My Profile
                                </p>
                            </CardTitle>
                            <CardDescription>
                                To edit your avatar click on the avator and upload new image
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-4 grid-cols-1 gap-4 my-5">

                                <div className="col-span-1 place-self-center">
                                    <Popover>
                                        <PopoverTrigger>

                                            <Avatar className="w-20 sm:w-24 md:w-32 h-auto">
                                                <AvatarImage src={user.profileImage ? user.profileImage : ''} />
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

                                </div>
                                <div className="col-span-3">
                                    <h2 className="font-OpenSans text-red-800 text-xl font-bold uppercase whitespace-normal break-all">
                                        {user.email}
                                    </h2>
                                    <p className="captialize text-sm text-gray-600 my-1">
                                        Head of {user.department} Department
                                    </p>
                                    <div className="">
                                        {
                                            user.tags
                                                ?
                                                user.tags.map((item: string, index: number) => {
                                                    return (
                                                        <Badge key={index} className="bg-emerald-500 font-OpenSans">
                                                            {item}
                                                        </Badge>
                                                    )
                                                })
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}

export default Profile