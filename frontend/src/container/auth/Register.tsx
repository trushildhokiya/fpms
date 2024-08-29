import CommonNavbar from "@/components/navbar/CommonNavbar"
import RegisterIllustration from '../../assets/svg/welcome.svg'
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
import axios from "axios"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Footer from "@/components/footer/footer"

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).regex(new RegExp('^[a-zA-Z0-9._%+-]+@somaiya\.edu$'), {
    message: 'Invalid somaiya ID'
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  department: z.string().min(2, {
    message: 'Select your department'
  }),
})


const Register = () => {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      department: ""
    },
  })

  const { toast } = useToast()

  function onSubmit(data: z.infer<typeof FormSchema>) {

    axios.post('auth/register', data)
      .then((res) => {

        if (res.data.status === 'Success') {

          toast({
            title: 'Registeration Successful',
            description: ' Faculty registered successfully',
            action: <ToastAction altText="Okay">Okay</ToastAction>,
          })

        }

      })
      .catch((err) => {
        
        toast({
          title: 'Something went wrong!',
          description: err.response.data.message,
          variant: 'destructive',
          action: <ToastAction altText="Okay">Okay</ToastAction>,
        })
      })

    form.reset()
  }


  return (
    <div>
      <CommonNavbar />
      <div className='md:grid grid-cols-2'>

        {/* LOGIN FORM  */}
        <div className='my-10'>

          <div className='bg-white shadow-xl w-[90%] mx-auto p-5'>
            <h1 className='text-center text-3xl font-AzoSans text-gray-500 tracking-wider '>
              REGISTER
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
                          <Input placeholder="alex@somaiya.edu" autoComplete='off' {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your Department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Computer">Computer Engineering</SelectItem>
                            <SelectItem value="Information Technology">Information Technology</SelectItem>
                            <SelectItem value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</SelectItem>
                            <SelectItem value="Electronics and Telecommunication">Electronics and Telecommunication</SelectItem>
                            <SelectItem value="Basic Science and Humanities">Basic Science and Humanities</SelectItem>
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
                <Link to='/auth/login'>
                  <p className='text-sm text-red-700 my-5 p-2'>
                    Already Have an account? Login!
                  </p>
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* IMAGE */}
        <div className='p-3 hidden md:block '>
          <div className='flex justify-center'>
            <img src={RegisterIllustration} draggable={false} alt='geometric-illustrations' className='w-[80%] drop-shadow-2xl h-auto' />
          </div>
        </div>

      </div>
      <Footer />
      <Toaster />
    </div>
  )
}

export default Register