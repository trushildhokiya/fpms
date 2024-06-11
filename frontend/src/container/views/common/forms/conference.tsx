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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { useState, useEffect } from 'react'

type Props = {}

/**
 * SCHEMAS 
 */
// const authorSchema = z.object({
//     authorName: z.string().min(1).max(100),
//     authorAffiliation: z.string().min(1).max(100),
// })

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
        researchPaperTitle: z.string().nonempty("Research Paper Title is required"),
        conferenceType: z.string().nonempty("Conference Type is required"),
        conferenceName: z.string().nonempty("Conference Name is required"),
        venue: z.string().nonempty("Venue is required"),
        organizer: z.string().nonempty("Organizer is required"),
        role: z.string().nonempty("Role is required"),
        fromDate: z.date(),
        toDate: z.date(),
        paperStatus: z.string().nonempty("Paper Status is required"),
        publicationDate: z.date().nullable().optional(),
        issnIsbnNo: z.string().optional(),
        impactFactor: z.number().nullable().optional(),
        pageNo: z.string().optional(),
        yearOfPublication: z.number().nullable().optional(),
        doi: z.string().optional(),
        indexing: z.string().optional(),
        fullPaperLink: z.string().optional(),
        citationCount: z.number().optional(),
        uploadPaper: pdfFileSchema.nullable().optional(),
        uploadCertificate: pdfFileSchema.nullable().optional(),
        authors: z.array(z.string().nonempty("Author is required")).min(1, "At least one author is required"),
        authorAffiliations: z.array(z.string().nonempty("Author Affiliation is required")).min(1, "At least one author affiliation is required"),
    }).refine((data) => data.toDate > data.fromDate, {
        message: "End date must be greater than start date",
        path: ["toDate"], // Field to which the error will be attached
    });
    

const Conference = (props: Props) => {

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

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            researchPaperTitle: "",
            conferenceType: "",
            conferenceName: "",
            venue: "",
            organizer: "",
            role: "",
            fromDate: new Date(),
            toDate: new Date(),
            paperStatus: "",
            publicationDate: undefined,
            issnIsbnNo: "",
            impactFactor: undefined,
            pageNo: "",
            yearOfPublication: undefined,
            doi: "",
            indexing: "",
            fullPaperLink: "",
            citationCount: undefined,
            uploadPaper: undefined,
            uploadCertificate: undefined,
            authors: ['', '', '', '', '', '', '', ''],
            authorAffiliations: ['', '', '', '', '', '', '', ''],
        },
    });
    
    
    const { control, handleSubmit, formState: { errors } } = form;
    // const { fields, append } = useFieldArray({
    //     control,
    //     name: "authorDetails"
    // });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }
    

    // const handleTransactionClick = (event: any) => {
    //     append({
    //         authorName: '',
    //         authorAffiliation: '',
    //     });

    //     event.preventDefault()
    // };

    // const renderAuthorBlock = (index: number) => (
    //     <div key={index}>
    //         <Separator className='my-8 bg-red-800' />
    //         <div className="grid md:grid-cols-2 gap-6">
    //             <FormField
    //                 control={control}
    //                 name={`authorDetails.${index}.authorName`}
    //                 render={({ field }) => (
    //                     <FormItem>
    //                         <FormLabel className='text-grey-800'>Author Name</FormLabel>
    //                         <FormControl>
    //                             <Input placeholder="Author Name" autoComplete='off' {...field} />
    //                         </FormControl>
    //                         <FormMessage />
    //                     </FormItem>
    //                 )}
    //             />
    
    //             <FormField
    //                 control={control}
    //                 name={`authorDetails.${index}.authorAffiliation`}
    //                 render={({ field }) => (
    //                     <FormItem>
    //                         <FormLabel className='text-grey-800'>Author Affiliation</FormLabel>
    //                         <FormControl>
    //                             <Input placeholder="Author Affiliation" autoComplete='off' {...field} />
    //                         </FormControl>
    //                         <FormMessage />
    //                     </FormItem>
    //                 )}
    //             />
    //         </div>
    //     </div>
    // );
    

    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container my-8">

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 ">
                    <span className="border-b-4 border-red-800 break-words ">
                        CONFERENCE <span className='hidden sm:inline-block'>PUBLICATIONS</span>
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
                                    <Receipt className="mr-2 h-4 w-4" />
                                    <span><a href='#conferenceDetails' onClick={()=>setOpen(false)}>Conference Details</a></span>
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
                            Please fill all the details correctly as per your knowledge. Also read all instructions given under specific fields in the form.
                        </AlertDescription>
                    </Alert>

                    <div className="">
                        <FormField
                            control={form.control}
                            name="researchPaperTitle"
                            render={({ field }) => (
                                <FormItem className='my-4'>
                                    <FormLabel className='text-gray-800'>Research Paper Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Research Paper Title" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex justify-around gap-8'>
                            <div className='flex flex-col w-full'>
                                {Array.from({ length: 8 }, (_, index) => (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={`authors.${index}`}
                                    render={({ field }) => (
                                    <FormItem className='my-4'>
                                        <FormLabel className='text-gray-800'>{`Author ${index + 1}`}</FormLabel>
                                        <FormControl>
                                        <Input placeholder={`Author ${index + 1}`} {...field} autoComplete='off' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                ))}
                            </div>

                            <div className='flex flex-col w-full'>
                                {Array.from({ length: 8 }, (_, index) => (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={`authorAffiliations.${index}`}
                                    render={({ field }) => (
                                    <FormItem className='my-4'>
                                        <FormLabel className='text-gray-800'>{`Author Affiliation ${index + 1}`}</FormLabel>
                                        <FormControl>
                                        <Input placeholder={`Author Affiliation ${index + 1}`} {...field} autoComplete='off' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                ))}
                            </div>

                        </div>
                        
                        {/* <Button size={'lg'} onClick={handleTransactionClick} className='text-black hover:bg-emerald-600 bg-emerald-500'> Add Author </Button>

                        {fields.map((field, index) => (
                            renderAuthorBlock(index)
                        ))} */}

                        {/* {Array.from({ length: 8 }, (_, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={`author${index + 1}`}
                                render={({ field }) => (
                                    <FormItem className='my-4'>
                                        <FormLabel className='text-gray-800'>{`Author ${index + 1}`}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={`Author ${index + 1}`} {...field} autoComplete='off' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        {Array.from({ length: 8 }, (_, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={`authorAffiliation${index + 1}`}
                                render={({ field }) => (
                                    <FormItem className='my-4'>
                                        <FormLabel className='text-gray-800'>{`Author Affiliation ${index + 1}`}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={`Author Affiliation ${index + 1}`} {...field} autoComplete='off' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))} */}
                    </div>

                    <Separator className='my-5 bg-red-800' />

                    {/* CONFERENCE DETAILS */}
                    <h2 className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500' id='conferenceDetails'>
                        Conference Details
                    </h2>

                    <Alert className='bg-green-500'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>NOTE</AlertTitle>
                        <AlertDescription>
                            Fill out the conference details carefully.
                        </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                        <FormField
                            control={form.control}
                            name="conferenceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-800'>Conference Type</FormLabel>
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
                            name="conferenceName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-800'>Conference Name</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder="Conference Name" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="venue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-800'>Venue</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder="Venue" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="organizer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-800'>Organizer</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder="Organizer" {...field} autoComplete='off' />
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
                                    <FormLabel className='text-gray-800'>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="presenter">Presenter</SelectItem>
                                            <SelectItem value="attendee">Attendee</SelectItem>
                                            <SelectItem value="speaker">Speaker</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}

                            name="fromDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='text-gray-800'>Start Date</FormLabel>
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

                            name="toDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className='text-gray-800'>End Date</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="paperStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-800'>Paper Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="presented">Paper Presented</SelectItem>
                                            <SelectItem value="presentedAndPublished">Paper Presented and Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    {/* PUBLICATION DETAILS */}
                    {form.watch('paperStatus') === 'presentedAndPublished' && (
                        <>
                        <Separator className='my-5 bg-red-800' />
                            <h2 className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Publication Details
                            </h2>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="publicationDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className='text-gray-800'>Publication Date</FormLabel>
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
                                                Please select the publication date.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="issnIsbnNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>ISSN / ISBN No.</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="ISSN / ISBN No." {...field} autoComplete='off' />
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
                                                <Input type='number' step="0.01" placeholder="Impact Factor" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pageNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Page No. (From - To)</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="Page No. (From - To)" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="yearOfPublication"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Year of Publication</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Year of Publication" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="doi"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>DOI (Digital Object Identifier)</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="DOI" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="indexing"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Indexing</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select indexing" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="scopus">Scopus</SelectItem>
                                                    <SelectItem value="webOfScience">Web of Science</SelectItem>
                                                    <SelectItem value="ugcCareI">UGC CARE-I</SelectItem>
                                                    <SelectItem value="ugcCareII">UGC CARE-II</SelectItem>
                                                    <SelectItem value="others">Others</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fullPaperLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Full Paper Link (optional)</FormLabel>
                                            <FormControl>
                                                <Input type='url' placeholder="Full Paper Link" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="citationCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Citation Count (if available)</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Citation Count" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </>
                    )}

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
                            name="uploadPaper"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-800'>Upload Paper</FormLabel>
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
                            name="uploadCertificate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-800'>Upload Certificate</FormLabel>
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

export default Conference