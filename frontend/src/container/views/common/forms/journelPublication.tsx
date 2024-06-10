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
const transactionSchema = z.object({
    purchaseOrderNumber: z.string().min(1).max(100),
    purchaseOrderDate: z.date(),
    purchaseInvoiceNumber: z.string().min(1).max(100),
    purchaseInvoiceDate: z.date(),
    bankName: z.string().min(1).max(100),
    branchName: z.string().min(1).max(100),
    amountRecieved: z.coerce.number().nonnegative(),
    remarks: z.string().max(1000, {
        message: "Remarks must not exceed 1000 characters"
    }).optional(),
})

const ACCEPTED_FILE_TYPES = [
    'application/pdf'
];

const pdfFileSchemaForPaper = z
    .instanceof(File)
    .refine((file) => {
        return !file || file.size <= 50 * 1024 * 1024;
    }, `File Size must be less than 50 mb`)
    .refine((file) => {
        return ACCEPTED_FILE_TYPES.includes(file.type);
    }, `File Type must be of pdf`   
    )

const formSchema = z.object({
    researchPaperTitle: z.string().min(2, {
        message: "Research Paper Title required!"
    }).max(100, {
        message: "Research Paper Title must not exceed 100 characters"
    }),

    authors: z.string({
        invalid_type_error: "Authors Name Required!"
    }).transform((value) => value.split(',').map((name) => name.trim())),

    journelTitle: z.string().min(2, {
        message: "Journel Title Title required!"
    }).max(100, {
        message: "Journel Title Title must not exceed 100 characters"
    }),

    authorsAffiliation: z.string({
        invalid_type_error: "Required fields must be filled !"
    }).transform((value) => value.split(',').map((name) => name.trim())),

    nationalInternational: z.string().min(1, {
        message: "Funding Agency type required!"
    }),

    ISSNnumber: z.string({
        invalid_type_error: "ISSN / ISBN Number Required"
    }).max(100, {
        message: "ISSN / ISBN Number exceed!"
    }),

    impactFactor: z.coerce.number().nonnegative(),

    journelPageNumberFrom: z.coerce.number().nonnegative(),
    journelPageNumberTo: z.coerce.number().nonnegative(),

    dateOfPublication: z.date(),

    digitalObjectIdentifier: z.string().min(2, {
        message: "Digital Object Identifier required!"
    }).max(100, {
        message: "Digital Object Identifier must not exceed 100 characters"
    }),

    indexing: z.string().min(2, {
        message: "Indexing Required!"
    }).max(100, {
        message: "Indexing count exceeded"
    }),

    fullPaperLink: z.string().min(10, {
        message: "Paper Link Required!"
    }).max(500, {
        message: "Paper Link exceeded"
    }),

    citationCount: z.coerce.number().nonnegative(),

    paperUpload: pdfFileSchemaForPaper,
    certificateUpload: pdfFileSchemaForPaper,

});

const JournelPublication: React.FC = (props: Props) => {

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
            researchPaperTitle: "",
            authors: [''],
            authorsAffiliation: [''],
            nationalInternational: "",
            ISSNnumber: "",
            impactFactor: undefined,
            journelPageNumberFrom: 0,
            journelPageNumberTo: undefined,
            dateOfPublication: undefined,
            digitalObjectIdentifier: undefined,
            indexing: undefined,
            fullPaperLink: undefined,
            citationCount: undefined,
            paperUpload: new File([], ''),
            certificateUpload: new File([], ''),
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
                        JOURNEL <span className='hidden sm:inline-block'>PUBLICATION</span>
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
                                    name="researchPaperTitle"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Research Paper Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="research paper title" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="authors"
                                    render={({ field }) => (
                                        <FormItem className=' my-4'>
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
                                    name="journelTitle"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Journey Paper Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Journey Paper title" {...field} autoComplete='off' />
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
                                        <FormItem className=' my-4'>
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
                                        <FormItem className=' my-4'>
                                            <FormLabel className='text-gray-800'>Impact Factor</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="impactFactor" autoComplete='off' {...field} />
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
                                    name="journelPageNumberFrom"
                                    render={({ field }) => (
                                        <FormItem className=' my-4'>
                                            <FormLabel className=' text-gray-800'>Journel Page From</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder='Journel Page Number' autoComplete='off' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="journelPageNumberTo"
                                    render={({ field }) => (
                                        <FormItem className=' my-4'>
                                            <FormLabel className=' text-gray-800'>Journel Page To</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder='Journel Page Number' autoComplete='off' {...field} />
                                            </FormControl>
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
                                    name="indexing"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Indexing</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="Scopus, Web of Science, UGC CARE-I, UGC CARE-II, others." {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fullPaperLink"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Full Paper Link</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="Full Paper Link" {...field} autoComplete='off' />
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
                                Document Upload
                            </h2>
                            <div>
                                <Alert variant="default" className='bg-amber-500'>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        Documents must be in a single pdf file of maximum size 50MB.
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">

                                <FormField
                                    control={form.control}
                                    name="paperUpload"
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

                                <FormField
                                    control={form.control}
                                    name="certificateUpload"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Certificate Upload</FormLabel>
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

export default JournelPublication;