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
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BookUser, CalendarIcon, FileArchive } from 'lucide-react'
import countries from './countries';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"


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
    patentTitle: z.string().min(2, {
        message: "Copyright Title required!"
    }).max(100, {
        message: "Copyright Title must not exceed 100 characters"
    }),

    inventors: z.string()
    .min(2, {message: "Inventor name is required!"})
    .transform((value) => value.split(',').map((name) => name.trim()))
    .refine((value) => value.length >= 1 && value.length <= 10, {
        message: "Must Enter at least 1 and at most 10 Inventors.",
    }),

    affiliationInventors: z.string()
    .min(2, {message: "Affiliation Inventor name is required!"})
    .transform((value) => value.split(',').map((name) => name.trim()))
    .refine((value) => value.length >= 1 && value.length <= 10, {
        message: "Must Enter at least 1 and at most 10 Affiliation Inventors.",
    }),

    nationalInternational: z.string().min(1, {
        message: "This field must be marked"
    }),

    country: z.string().min(1, { message: "Country is required" }),

    patentApplicationNumber: z.string().min(2, {
        message: "Copyright Application Number required!"
    }).max(100, {
        message: "Copyright Application Number must not exceed 100 characters"
    }),

    filingDate: z.date(),
    grantDate: z.date(),
    patentCertificate: pdfFileSchema,
})
.refine((data) => data.grantDate > data.filingDate, {
    message: "End date must be greater than start date",
    path: ["endDate"], // Field to which the error will be attached
});


const PatentDetails = (props: Props) => {

    const user = useSelector((state: any) => state.user);

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
            patentTitle: "",
            inventors: undefined,
            affiliationInventors: undefined,
            nationalInternational: "",
            country: "",
            patentApplicationNumber: "",
            filingDate: undefined,
            grantDate: undefined,
            patentCertificate: new File([], ''),
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    const { control, handleSubmit, formState: { errors } } = form;

    return (
        <>
        {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}
        <div className="container my-8">

           <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 ">
                <span className="border-b-4 border-red-800 break-words ">
                    PATENT
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

                        <FormField
                            control={form.control}
                            name="patentTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Patent Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Title" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="inventors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inventors</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter Inventor Names" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormDescription>
                                        Write mutiple names seperated by commas(,)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="affiliationInventors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Affiliation Inventors</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter Affiliation Inventor Names" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormDescription>
                                        Write mutiple names seperated by commas(,)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="patentApplicationNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Patent Application Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Patent Application Number" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">

                                <FormField
                                    control={form.control}
                                    name="nationalInternational"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Copyright Type</FormLabel>
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
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a country" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.code} value={country.name}>
                                                {country.name}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage>{errors.country?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}

                                    name="filingDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className='text-gray-800'>Date of Filing</FormLabel>
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
                                                Please select the start date.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}

                                    name="grantDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className='text-gray-800'>Date of Grant</FormLabel>
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
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Please select the start date.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                        <Separator className='bg-red-800' />
                        
                        <h2 id='proofUpload' className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Proof Uploads
                            </h2>
                            <div>
                                <Alert variant="default" className='bg-amber-500'>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        Patent Certificate must be in a single pdf file of maximum size 5MB.
                                    </AlertDescription>
                                </Alert>
                            </div>


                            <FormField
                                control={form.control}
                                name="patentCertificate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-gray-800'>Patent Certificate</FormLabel>
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

                        <Button type="submit" className='bg-red-800 hover:bg-red-700'>Submit</Button>
                    </form>
                </Form>
            </div>

        </div>
        </>

    )
}

export default PatentDetails;
