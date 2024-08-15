import CommonNavbar from '@/components/navbar/CommonNavbar'
import ForgotIllustration from '../../assets/svg/forgot-pass.svg'
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
import { Link } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Footer from '@/components/footer/footer'
import axios from 'axios'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useState } from 'react'

const FormSchema = z.object({
    email: z.string().email({
        message: "Enter valid mail address"
    }).regex(new RegExp('^[a-zA-Z0-9._%+-]+@somaiya\.edu$'), {
        message: 'Invalid somaiya ID'
    })
})


const ForgotPassword = () => {

    const [showAlertDialog,setShowAlertDialog] = useState(false)
    const [alertDialogMessage,setDialogMessage] = useState("")

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    })


    function onSubmit(data: z.infer<typeof FormSchema>) {

        axios.post('/auth/forgot-password', data,)
            .then((res) => {
                if(res.data.message='success'){
                    setDialogMessage("We have mailed you a link at your registered mail address to change your password. We strongly recommend not to share the link with anyone. The link will be active for 5 minutes after the request has been made.")
                    setShowAlertDialog(true)
                }
            })
            .catch((err) => {
                setDialogMessage(err.message)
                setShowAlertDialog(true)
            })

            form.reset()

    }


    return (
        <div>
            <CommonNavbar />

            <div className='md:grid grid-cols-2'>

                {/* LOGIN FORM  */}
                <div className='my-10 place-self-center w-full'>

                    <div className='bg-white shadow-xl w-[90%] mx-auto  p-5'>
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
                                                <FormLabel>Registered Somaiya ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="trushil.d@somaiya.edu" autoComplete='off' {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter the somaiya mail which you have used to register on our servers
                                                </FormDescription>
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
                        <img src={ForgotIllustration} draggable={false} alt='geometric-illustrations' className='w-[80%] h-auto' />
                    </div>
                </div>

                {showAlertDialog && (
                    <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-800">Password change Request</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                    {alertDialogMessage}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-green-600 text-white capitalize hover:text-white hover:bg-green-700" onClick={() => setShowAlertDialog(false)}>Understood</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

            </div>
            <Footer />
            <Toaster />
        </div>
    )
}

export default ForgotPassword