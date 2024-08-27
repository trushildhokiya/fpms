import CommonNavbar from '@/components/navbar/CommonNavbar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UnauthorizedIllustration from '@/assets/svg/unauthorized.svg'
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Input } from "@/components/ui/input"
import Background from '@/assets/svg/blob-scene.svg'
import { ToastAction } from '@/components/ui/toast'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { cn } from '@/lib/utils'

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(strongPasswordRegex, { message: "Password must include uppercase, lowercase, number, and special character" }),
  confirmPassword: z.string()
    .min(8, { message: "Confirm Password must be at least 8 characters long" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ['confirmPassword'], // The path to which the error message will be attached
});

const ResetPassword = () => {

  const [authorized, setAuthorized] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { token } = useParams()


  useEffect(() => {
    axios.get('/auth/validate', {
      headers: {
        'token': token
      }
    })
      .then((res) => {
        if (res.data.authorized) {
          setAuthorized(res.data.authorized)
        }
      })
      .catch((err) => {
        console.error(err)
      })
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {

    const data = {
      ...values,
      accessToken: token
    }

    axios.post('auth/reset-password', data)
    .then((res) => {

      if (res.data.message === 'success') {

        toast({
          className: cn(
            'top-0 left-1/2 transform -translate-x-1/2 flex fixed md:max-w-[420px] md:top-4'
          ),
          title: 'Request successful',
          description: 'Account password successfully changed',
          action: <ToastAction altText="Okay" onClick={()=> navigate('/auth/login')}>Okay</ToastAction>,
        });

      }

    })
    .catch((err) => {
      
      toast({
        title: 'Something went wrong!',
        description: err.response.data.message,
        variant: 'destructive',
        action: <ToastAction altText="Okay" onClick={()=> navigate('/auth/login')}>Okay</ToastAction>,
      })
    })

    form.reset()

  }

  return (
    <div>
      <CommonNavbar />
      {
        authorized
          ?
          <>
            <div
              className="h-screen flex items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: `url(${Background})` }}
            >
              <Card className="w-[450px] mx-auto font-Poppins">
                <CardHeader>
                  <CardTitle className='text-gray-700 tracking-wide'>Change Password</CardTitle>
                  <CardDescription>Change your password in a single clicks.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type='email' autoComplete='off' placeholder="xyz@somaiya.edu" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is registered mail on our servers.
                            </FormDescription>
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
                              <Input type='password' autoComplete='off'  placeholder="*****" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type='password' autoComplete='off'  placeholder="*****" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className='bg-red-800' type="submit">Submit</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

            </div>
          </>
          :
          <>
            <div className="container">
              <img src={UnauthorizedIllustration} className='w-full h-full object-contain' alt='error 401' />
            </div>
          </>
      }
      <Toaster />
    </div>
  )
}

export default ResetPassword