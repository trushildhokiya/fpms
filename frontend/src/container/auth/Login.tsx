import CommonNavbar from '@/components/navbar/CommonNavbar'
import LoginIllustration from '../../assets/svg/login.svg'
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster } from '@/components/ui/toaster'
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { jwtDecode } from 'jwt-decode'
import { authPayloadInterface } from '@/utils/interface/authPayload'
import { useDispatch } from 'react-redux'
import { login } from '@/features/user/userSlice'

const FormSchema = z.object({
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
    })
})


const Login = () => {


    const navigate = useNavigate()
    const { toast } = useToast()
    const dispatch = useDispatch()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            role: "",
        },
    })


    function onSubmit(data: z.infer<typeof FormSchema>) {

        axios.post('/auth/login', data)
            .then((res) => {

                localStorage.setItem('token', res.data.token)

                const decodedResponse: authPayloadInterface = jwtDecode(res.data.token)
                dispatch(login(decodedResponse))

                switch (decodedResponse.role) {

                    case "Admin":
                        navigate('/admin')
                        break;
                    case "Head Of Department":
                        navigate('/hod')
                        break;
                    case "Faculty":
                        if (decodedResponse.tags!.includes('research coordinator')) {
                            navigate('/hod')
                            break;
                        }
                        else{
                            navigate('/faculty')
                            break;
                        }
                        
                    default:
                        navigate('/auth/login')
                }

            })
            .catch((err: any) => {
                console.log(err);

                toast({
                    title: "Error Occurred !",
                    description: err.response.data.message,
                    variant: 'destructive',
                    action: (
                        <ToastAction altText="Ok">Okay</ToastAction>
                    ),
                })
            })

    }


    return (
        <div>
            <CommonNavbar />

            <div className='md:grid grid-cols-2'>

                {/* LOGIN FORM  */}
                <div className='my-10'>

                    <div className='bg-white shadow-xl w-[90%] mx-auto p-5'>
                        <h1 className='text-center text-3xl font-AzoSans text-gray-500 tracking-wider '>
                            LOGIN
                        </h1>

                        <div className='md:w-[90%] px-2 mx-auto my-10 font-Poppins text-xl'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Somaiya ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="trushil.d@somaiya.edu" autoComplete='off' {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Login Type</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Login Type" />
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
                                        control={form.control}
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

                                    <Button type="submit" className='bg-red-800'>Submit</Button>
                                </form>
                            </Form>

                            <div>
                                <Link to='/auth/register'>
                                    <p className='text-sm text-red-700 my-5 p-2'>
                                        Don't have an account? Dont worry Register now!
                                    </p>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>

                {/* IMAGE */}
                <div className='p-3 hidden md:block '>
                    <div className='flex justify-center'>
                        <img src={LoginIllustration} alt='geometric-illustrations' className='w-[80%] drop-shadow-2xl h-auto' />
                    </div>
                </div>

            </div>
            <Toaster />
        </div>
    )
}

export default Login