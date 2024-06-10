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
} from "@/components/ui/command"
import React, { useState, useEffect } from 'react'

type Props = {}

/**
 * SCHEMAS 
 */
const ACCEPTED_FILE_TYPES = [
    'application/pdf'
];

const pdfFileSchemaForProof = z
    .instanceof(File)
    .refine((file) => {
        return !file || file.size <= 5 * 1024 * 1024;
    }, `File Size must be less than 50 mb`)
    .refine((file) => {
        return ACCEPTED_FILE_TYPES.includes(file.type);
    }, `File Type must be of pdf`
    )

const formSchema = z.object({
    bookTitle: z.string().min(2, {
        message: "Book Title required!"
    }).max(100, {
        message: "Book Title must not exceed 100 characters"
    }),


    bookChapterTitle: z.string().min(2, {
        message: "Book Chapter Title Required"
    }).max(500, {
        message: "Title count exceeded"
    }),

    authors: z.string({
        invalid_type_error: "Authors Name Required!"
    }).transform((value) => value.split(',').map((name) => name.trim())),

    publisherName: z.string().min(2, {
        message: "Publisher Title required!"
    }).max(100, {
        message: "Publisher Title must not exceed 100 characters"
    }),

    authorsAffiliation: z.string({
        invalid_type_error: "Required fields must be filled !"
    }).transform((value) => value.split(',').map((name) => name.trim())),

    nationalInternational: z.string().min(1, {
        message: "Publisher type required!"
    }),

    ISSNnumber: z.string({
        invalid_type_error: "ISSN / ISBN Number Required"
    }).max(100, {
        message: "ISSN / ISBN Number exceed!"
    }),

    impactFactor: z.coerce.number().nonnegative(),

    dateOfPublication: z.date(),

    digitalObjectIdentifier: z.string().min(2, {
        message: "Digital Object Identifier required!"
    }).max(100, {
        message: "Digital Object Identifier must not exceed 100 characters"
    }),

    indexing: z.string().min(2, {
        message: "Indexing Required"
    }).max(100, {
        message: "Indexing count exceeded"
    }),

    intendedAuidence: z.string().min(2, {
        message: "Field Required!"
    }).max(100, {
        message: "Field count exceeded"
    }),

    description: z.string().min(1).max(1000),

    bookLink: z.string().min(10, {
        message: "Paper Link Required!"
    }).max(500, {
        message: "Paper Link exceeded"
    }),

    citationCount: z.coerce.number().nonnegative(),

    proofUpload: pdfFileSchemaForProof,

});

const BookChapterPublication: React.FC = (props: Props) => {

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
            bookTitle: "",
            bookChapterTitle: "",
            publisherName: "",
            authors: [''],
            authorsAffiliation: [''],
            nationalInternational: "",
            ISSNnumber: "",
            impactFactor: undefined,
            dateOfPublication: undefined,
            digitalObjectIdentifier: undefined,
            intendedAuidence: undefined,
            description: "",
            indexing: undefined,
            bookLink: undefined,
            citationCount: undefined,
            proofUpload: new File([], ''),
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
                        BOOK <span className='hidden sm:inline-block'>PUBLICATIONS</span>
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
                                        <CommandItem>
                                            <Receipt className="mr-2 h-4 w-4" />
                                            <span><a href='#transactionDetails' onClick={() => setOpen(false)}>Transaction Details</a></span>
                                        </CommandItem>
                                        <CommandItem>
                                            <FileArchive className="mr-2 h-4 w-4" />
                                            <span><a href='#proofUpload' onClick={() => setOpen(false)}>Proof Upload</a></span>
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

                            <div>
                                <FormField
                                    control={form.control}
                                    name="bookTitle"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Book Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Book title" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bookChapterTitle"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Book Chapter Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Book Chapter title" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="authors"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Authors</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="eg: John Smith, David Fawling" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormDescription>
                                                Write mutiple names seperated by commas(,)
                                                <br />
                                                <span className=' text-red-600'>Max 8 aurthors</span>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="authorsAffiliation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Authors Affiliations</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="eg: John Smith, David Fawling" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormDescription>
                                                Write mutiple names seperated by commas(,)
                                                <br />
                                                <span className=' text-red-600'>Max 8 aurthors</span>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="publisherName"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Publisher Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Publisher title" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="nationalInternational"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Journel Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="national">National</SelectItem>
                                                    <SelectItem value="international">International</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ISSNnumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>ISSN / ISBN Number</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="ISSN / ISBN Number" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="impactFactor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Impact Factor</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Impact Factor" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dateOfPublication"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className='text-gray-800'>Date of Publication</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Please select a year.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="digitalObjectIdentifier"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Digital Object Identifier</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="Digital Object Identifier" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="intendedAuidence"
                                    render={({ field }) => (
                                        <FormItem className=' my-4'>
                                            <FormLabel className=' text-gray-800'>Intended Auidence</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Engineering Students , Researchers, others' {...field} autoComplete='off' />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                            </div>

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

                            <div className=' grid md:grid-cols-1 grid-cols-1 gap-6'>

                                <FormField
                                    control={form.control}
                                    name="indexing"
                                    render={({ field }) => (
                                        <FormItem className=' my-4'>
                                            <FormLabel className='text-gray-800'>Indexing</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="Scopus, Web of Science, UGC CARE-I, UGC CARE-II, others." {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className=' grid md:grid-cols-2 grid-cols-2 gap-6'>

                                <FormField
                                    control={form.control}
                                    name="bookLink"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Book Link</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="Book Link" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="citationCount"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Citation Count</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Citation Count" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <Separator className='my-5 bg-red-800' />

                            {/* Document Upload */}
                            <h2 id='paperUpload' className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Proof Upload
                            </h2>
                            <div>
                                <Alert variant="default" className='bg-amber-500'>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        Documents must be in a single pdf file of maximum size 5MB.
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="grid md:grid-cols-1 gap-6">

                                <FormField
                                    control={form.control}
                                    name="proofUpload"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Paper Upload</FormLabel>
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

export default BookChapterPublication;