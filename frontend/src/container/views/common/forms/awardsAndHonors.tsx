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

const ACCEPTED_FILE_TYPES = [
    'application/pdf'
];
const pdfFileSchema = z
    .instanceof(File)
    .refine((file) => {
        return !file || file.size <= 5 * 1024 * 1024;
    }, `File size must be less than 5MB`)
    .refine((file) => {
        return ACCEPTED_FILE_TYPES.includes(file.type);
    }, 'File must be a pdf'
    )

const formSchema = z.object({
    Title: z.string().min(2, {
        message: "Title required!"
    }).max(100, {
        message: "Title must not exceed 100 characters"
    }),

    AwardingBody: z.string().min(2, {
        message: "Awarding Body is required!"
    }).max(100, {
        message: "Awarding Body must not exceed 100 characters"
    }),

    Year: z.coerce.number().nonnegative(),
    description: z.string().min(1).max(1000),

    Photo: pdfFileSchema,

});

const AwardsAndHonorsForm = (props: Props) => {

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
            Title: "",
            AwardingBody: "",
            Year: 0,
            description: "",
            Photo: new File([], ''),
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
                        Awards And <span className='hidden sm:inline-block'>Honors</span>
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
                                        <CommandItem>
                                            <FileArchive className="mr-2 h-4 w-4" />
                                            <span><a href='#proofUpload' onClick={()=>setOpen(false)}>Proof Upload</a></span>
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

                            <div className="">
                                <FormField
                                    control={form.control}
                                    name="Title"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Title" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="AwardingBody"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Awarding Body</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Awarding Body" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="Year"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Year</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Year" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Description </FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="description must not exceed 1000 characters" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator className='my-5 bg-red-800' />

                            {/* Proof Upload */}
                            <h2 id='proofUpload' className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Proof Uploads
                            </h2>
                            <div>
                                <Alert variant="default" className='bg-amber-500'>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        All proof for respective uploads must be in a single pdf file of maximum size 5MB.
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="Photo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Upload Photo / Certificate </FormLabel>
                                            <FormControl>
                                                <Input
                                                    accept=".pdf"
                                                    type="file"
                                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                                />
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

export default AwardsAndHonorsForm