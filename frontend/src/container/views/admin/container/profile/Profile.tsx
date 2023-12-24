import AdminNavbar from "@/components/navbar/AdminNavbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { loadUserData } from "@/utils/functions/reduxFunctions"
import { useEffect } from "react"
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    profileImage: z.instanceof(File, { message: 'Image is required' }).refine(
        (file) =>file.name.trim() !== '',
        {
            message: `No file uploaded`,
        }
    )
})



const Profile = () => {

    useEffect(() => {
        loadUserData()

    })

    const user = useSelector((state: any) => state.userReducer)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profileImage: new File([], "")
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values.profileImage)
    }

    return (
        <div>
            <AdminNavbar />
            <div className="container">
                <div className="my-10 mx-auto w-full md:w-[70%] lg:w-[55%] ">

                    <Card>
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

                            <div className="grid grid-cols-1 md:grid-cols-4">
                                <div className="col-span-1 place-self-center ">
                                    <Popover>
                                        <PopoverTrigger>
                                            <Avatar className="w-24 h-auto">
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
                                    <div className="flex justify-center">
                                        <Badge variant={"secondary"} className="my-2 mx-auto text-sm text-white bg-red-800">
                                            Admin
                                        </Badge>
                                    </div>
                                </div>
                                <div className="col-span-3 mx-3 font-Poppins ">

                                    <div className="my-3">
                                        <span className="text-red-800 font-AzoSans tracking-wide"> Email:</span> {user.email ? user.email : ""}
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