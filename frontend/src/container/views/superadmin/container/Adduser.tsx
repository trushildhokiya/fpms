import SuperAdminNavbar from '@/components/navbar/SuperAdminNavbar'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Toaster } from '@/components/ui/toaster'
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

const AdminFormSchema = z.object({

    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).regex(new RegExp('^[a-zA-Z0-9._%+-]+@somaiya\.edu$'), {
        message: 'Invalid somaiya ID'
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    role: z.string().min(2, {
        message: 'Select login Type'
    }),

})


const Adduser = () => {


    const { toast } = useToast()

    const formAdmin = useForm<z.infer<typeof AdminFormSchema>>({
        resolver: zodResolver(AdminFormSchema),
        defaultValues: {
            email: "",
            password: "",
            role: "Admin",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(data: any) {

        console.log(data);


        axios.post('/admin/create-user', data, {
            headers: {
                'token': localStorage.getItem('token'),
            }
        })
            .then((res) => {
                if (res.data.status === 'Success') {
                    toast({
                        title: `New ${data.role} created`,
                        description: `new ${data.role} created successfully`,
                        variant: 'default',
                        action: (
                            <ToastAction altText="Ok">Okay</ToastAction>
                        ),
                    })
                }
            })
            .catch((err) => {
                toast({
                    title: `Something went wrong`,
                    description: `${err.response.data.message}`,
                    variant: 'destructive',
                    action: (
                        <ToastAction altText="Ok">Okay</ToastAction>
                    ),
                })
            })

        formAdmin.reset()
    }

    return (
        <div>
            <SuperAdminNavbar />
            <div className="container font-Poppins leading-5 md:text-justify">

                <h2 className="font-AzoSans text-2xl text-center text-red-800 tracking-wider my-5">
                    CREATE USERS
                </h2>
                <div className=" flex justify-center">
                    <Tabs defaultValue="Admin" className="w-[90%] md:w-[50%] lg:w-[32%]">
                        <TabsContent value="Admin">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-OpenSans my-2"> Admin </CardTitle>
                                    <CardDescription>
                                        Enter credentials to create new admin and click save user to create one
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Form {...formAdmin}>
                                        <form onSubmit={formAdmin.handleSubmit(onSubmit)} className="space-y-8">
                                            <FormField
                                                control={formAdmin.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Somaiya Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="trushil.d@somaiya.edu" {...field} autoComplete="off" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={formAdmin.control}
                                                name="role"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Role</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value} disabled>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder={field.value} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Admin">Admin</SelectItem>
                                                                <SelectItem value="Head Of Department">Head Of Department</SelectItem>
                                                                <SelectItem value="Faculty">Faculty</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={formAdmin.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <Input type='password' placeholder="*******" autoComplete='off' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button className="bg-red-800">Save user</Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                    </Tabs>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Adduser