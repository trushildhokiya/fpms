/**
 * IMPORTS
 */
import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import { useSelector } from 'react-redux'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { AlertCircle, BookUser, CalendarIcon, FileArchive, Receipt } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useState, useEffect } from 'react'

type Props = {}

/**
 * SCHEMAS 
 */

const formSchema = z.object({
    Name: z.string().min(2, {
        message: "Name required!"
    }).max(100, {
        message: "Name must not exceed 100 characters"
    }),

    Department: z.string().min(2, {
        message: "Department is required!"
    }).max(100, {
        message: "Department must not exceed 100 characters"
    }),

    Designation: z.string().min(2, {
        message: "Designation is required!"
    }).max(100, {
        message: "Designation must not exceed 100 characters"
    }),

    ContactNumber: z.coerce.number().nonnegative(),

    EmailId: z.string().min(2, {
        message: "EmailId is required!"
    }).max(100, {
        message: "EmailId must not exceed 100 characters"
    }),

    alternateContactNumber: z.coerce.number().nonnegative(),

    alternateEmailId: z.string().min(2, {
        message: "Alternate EmailId is required!"
    }).max(100, {
        message: "Alternate EmailId must not exceed 100 characters"
    }),

})

const ProfileManagementForm = (props: Props) => {

    const user = useSelector((state: any) => state.user)

    // command
    const [open, setOpen] = useState(false)

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


    // functions

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Name: "",
            Department: "",
            Designation: "",
            ContactNumber: 0,
            EmailId: "",
            alternateContactNumber: 0,
            alternateEmailId: "",
        },
    })

    const { control, handleSubmit, formState: { errors } } = form;

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
    }

    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container my-8">

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 ">
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
                                            <span><a href='#basicDetails' onClick={()=>setOpen(false)}>Basic Details</a></span>
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
                                    name="Name"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
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
                                    name="Department"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Department</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Department" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="Designation"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
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
                                    name="ContactNumber"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
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
                                    name="EmailId"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>EmailId</FormLabel>
                                            <FormControl>
                                                <Input type='email' placeholder="EmailId" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="alternateContactNumber"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
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
                                    name="alternateEmailId"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Alternate EmailId</FormLabel>
                                            <FormControl>
                                                <Input type='email' placeholder="Alternate EmailId" {...field} autoComplete='off' />
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
        </div>
    )
}

export default ProfileManagementForm