/**
 * IMPORTS
 */
import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import { useSelector } from 'react-redux'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { AlertCircle, BookUser } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useState, useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import { ToastAction } from '@/components/ui/toast'
import { useNavigate } from 'react-router-dom'

type Props = {}

interface Profile {
    name: string;
    department: string;
    designation: string;
    contact: number;
    email: string;
    alternateContact: number;
    alternateEmail: string;
    _id?: string; // optional ID field if needed
  }

  
/**
 * SCHEMAS 
 */

const formSchema = z.object({

    name: z.string().min(1, {
        message: "Name is required!"
    }).max(100, {
        message: "Name must not exceed 100 characters"
    }),

    department: z.string().min(2, {
        message: "Department is required!"
    }).max(100, {
        message: "Department must not exceed 100 characters"
    }),

    designation: z.string().min(2, {
        message: "Designation is required!"
    }).max(100, {
        message: "Designation must not exceed 100 characters"
    }),

    contact: z.coerce.number({
        invalid_type_error: "Contact number is required "
    }).nonnegative({
        message: "Contact number must be a non-negative number"
    }).min(1000000000, {
        message: "Contact number must be of atleast 10 digits"
    }).max(9999999999, {
        message: "Contact number must not exceed 10 digits"
    }),

    email: z.string().min(1, {
        message: "Email Address is required!"
    }).email({
        message: "Invalid email address!"
    }).regex(new RegExp('^[a-zA-Z0-9._%+-]+@somaiya\.edu$'), {
        message: 'Invalid somaiya ID'
    }),

    alternateContact:z.coerce.number({
        invalid_type_error: "Contact number is required "
    }).nonnegative({
        message: "Contact number must be a non-negative number"
    }).min(1000000000, {
        message: "Contact number must be of atleast 10 digits"
    }).max(9999999999, {
        message: "Contact number must not exceed 10 digits"
    }),

    alternateEmail: z.string().min(1, {
        message: "Alternate Email is required!"
    }).email({
        message: "Invalid email address!"
    }),

}).refine(data => data.contact !== data.alternateContact, {
    message: "Contact and alternate contact numbers must not be the same",
    path: ["alternateContact"],
}).refine(data => data.email !== data.alternateEmail, {
    message: "Email and alternate email must not be the same",
    path: ["alternateEmail"],
});

const ProfileForm = (props: Props) => {

    const user = useSelector((state: any) => state.user)
    const { toast } = useToast()
    const navigate = useNavigate()

    // command
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState<Profile>()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    useEffect(() => {
        axios.get('/common/profile')
            .then((res) => {
                setFormData(res.data)
                form.reset(res.data); // Reset the form with the fetched data
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    // functions

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: formData?.name || "",
            department: formData?.department || "",
            designation: formData?.designation || "",
            contact: formData?.contact || 0,
            email: formData?.email || "",
            alternateContact: formData?.alternateContact || 0,
            alternateEmail: formData?.alternateEmail || "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        axios.put('/common/profile',values)
        .then((res)=>{
            if(res.data.message==='success'){

                toast({
                    title: "Profile updated successfully",
                    description: "Your profile information has been updated successfully",
                    action: (
                      <ToastAction className='' onClick={()=>{ navigate('/common/display/profile')}} altText="okay">Okay</ToastAction>
                    ),
                })
                form.reset()
                
            }
        })
        .catch((err)=>{
            console.log(err);
        })
        
    }

    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container my-8">

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 uppercase ">
                    <span className="border-b-4 border-red-800 break-words ">
                        Profile <span className='hidden sm:inline-block'>Management</span>
                    </span>
                </h1>

                <div className="p-2 font-Poppins text-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* COMMAND DIALOG  */}
                            <CommandDialog open={open} onOpenChange={setOpen}>
                                <CommandInput placeholder="Type a command or search..." />
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup heading="Suggestions">
                                        <CommandItem>
                                            <BookUser className="mr-2 h-4 w-4" />
                                            <span><a href='#basicDetails' onClick={() => setOpen(false)}>Basic Details</a></span>
                                        </CommandItem>
                                    </CommandGroup>
                                </CommandList>
                            </CommandDialog>

                            {/* BASIC DETAILS */}
                            <h2 id='basicDetails' className='my-5 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Basic Details
                            </h2>

                            <Alert className='bg-sky-500'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>NOTE</AlertTitle>
                                <AlertDescription>
                                    Please fill all the details correctly as per your knowledege. Also read all instructions given under specific fields in the form
                                </AlertDescription>
                            </Alert>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} autoComplete='off' />
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
                                            <FormLabel className='text-gray-800'>Department</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={formData?.department} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your department" />
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
                                    name="designation"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Designation</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Designation" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Contact Number</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Contact Number" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type='email' placeholder="email address <somaiya>" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="alternateContact"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Alternate Contact Number</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Alternate Contact Number" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="alternateEmail"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Alternate Email Address</FormLabel>
                                            <FormControl>
                                                <Input type='email' placeholder="alternate email address" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <Button type="submit" className='bg-red-800 hover:bg-red-700'>Submit</Button>
                        </form>
                    </Form>
                </div>

            </div>
            <Toaster />
        </div>
    )
}

export default ProfileForm