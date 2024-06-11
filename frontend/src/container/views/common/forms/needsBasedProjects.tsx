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
import { AlertCircle, BookUser, CalendarIcon, FileArchive, Receipt , Users , UserCheck , GraduationCap } from 'lucide-react'
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
    projectTitle: z.string().min(2, {
        message: "Project Title required!"
    }).max(100, {
        message: "Project Title must not exceed 100 characters"
    }),

    institutionName: z.string().min(2, {
        message: "Institution/Organisation Name required!"
    }).max(100, {
        message: "Institution/Organisation Name must not exceed 100 characters"
    }),

    facultyCoordinatorName: z.string().min(2, {
        message: "Faculty Coordinator Name required!"
    }).max(100, {
        message: "Faculty Coordinator Name must not exceed 100 characters"
    }),

    facultyCoordinatorDepartment: z.string().min(2, {
        message: "Faculty Coordinator Department required!"
    }).max(100, {
        message: "Faculty Coordinator Department must not exceed 100 characters"
    }),

    facultyCoordinatorContactNo: z.string().regex(/^[0-9]{10}$/, {
        message: "Contact number must be 10 digits"
    }),

    facultyCoordinatorEmail: z.string().email({
        message: "Invalid email address format"
    }).min(5, {
        message: "Email required!"
    }).max(100, {
        message: "Email must not exceed 100 characters"
    }),

    studentTeamMembers: z.string()
    .min(2, {message: "Student name is required!"})
    .transform((value) => value.split(',').map((name) => name.trim()))
    .refine((value) => value.length >= 1 && value.length <= 10, {
        message: "Must Enter at least 1 and at most 10 Inventors.",
    }),

    studentDepartment: z.string().min(2, {
        message: "Student Department required!"
    }).max(100, {
        message: "Student Department must not exceed 100 characters"
    }),

    studentContactNo: z.string().regex(/^[0-9]{10}$/, {
        message: "Contact number must be 10 digits"
    }),

    studentEmail: z.string().email({
        message: "Invalid email address format"
    }).min(5, {
        message: "Email required!"
    }).max(100, {
        message: "Email must not exceed 100 characters"
    }),

    collaborationType: z.string().min(1, {
        message: "Collaboration Type required!"
    }),

    institutionWebsite: z.string().url({
        message: "Invalid website URL format"
    }).min(5, {
        message: "Website URL required!"
    }).max(1000, {
        message: "Website URL must not exceed 1000 characters"
    }),

    startDate: z.date(),
    endDate: z.date(),

    description: z.string().min(1).max(1000),
    institutionAddress: z.string().min(1).max(1000),
    outcomes: z.string().min(1).max(1000),

    sanctionedDocuments: pdfFileSchema,
    projectReport: pdfFileSchema,
    completionLetter: pdfFileSchema,
    visitDocuments: pdfFileSchema,

}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be greater than start date",
    path: ["endDate"], // Field to which the error will be attached
});

const ConsultancyForm = (props: Props) => {

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
            projectTitle: "",
            institutionName: "",
            collaborationType: "",
            startDate: undefined,
            endDate: undefined,
            institutionAddress: "",
            institutionWebsite: "",
            facultyCoordinatorName: "",
            facultyCoordinatorDepartment: "",
            facultyCoordinatorContactNo: "",
            facultyCoordinatorEmail: "",
            studentTeamMembers: undefined,
            studentDepartment: "",
            studentContactNo: "",
            studentEmail: "",
            description: "",
            outcomes: "",
            sanctionedDocuments: new File([], ''),
            projectReport: new File([], ''),
            completionLetter: new File([], ''),
            visitDocuments: new File([], ''),
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
                        NEEDBASED <span className='hidden sm:inline-block'>PROJECTS</span>
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
                                            <Users className="mr-2 h-4 w-4" />
                                            <span><a href='#partnerInstitutionDetails' onClick={()=>setOpen(false)}>Partner Institution Details</a></span>
                                        </CommandItem>
                                        <CommandItem>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            <span><a href='#facultyCoordinator' onClick={()=>setOpen(false)}>Faculty Coordinator Details</a></span>
                                        </CommandItem>
                                        <CommandItem>
                                            <GraduationCap className="mr-2 h-4 w-4" />
                                            <span><a href='#studentDetails' onClick={()=>setOpen(false)}>Student Details</a></span>
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
                                    name="projectTitle"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Project/Research Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="project Title" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Description </FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="description must not exceed 1000 characters" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="outcomes"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Outcome </FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="outcome must not exceed 1000 characters" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="collaborationType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Collaboration Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="academic">Academic</SelectItem>
                                                    <SelectItem value="industrial">Industrial</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                            </div>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">

                                <FormField
                                    control={form.control}

                                    name="startDate"
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

                                    name="endDate"
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
                                                Please select the end date.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>


                            <Separator className='my-5 bg-red-800' />

                            {/* Partner Institution/Organisation Details */}
                            <h2 id='partnerInstitutionDetails' className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Partner Institution/Organisation Details
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
                                    name="institutionName"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="institution/organisation Name" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="institutionAddress"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Address </FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="instituion/organisation Name must not exceed 1000 characters" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="institutionWebsite"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Website Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="institution/organisation Website Link" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <Separator className='my-5 bg-red-800' />

                            {/* Faculty Coordinator */}

                            <h2 id='facultyCoordinator' className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Faculty Coordinator Details
                            </h2>

                            <div>
                                <Alert className='bg-sky-500'>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        Please fill all the details correctly as per your knowledege. Also read all instructions given under specific fields in the form
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="facultyCoordinatorName"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="faculty Coordinator Name" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="facultyCoordinatorDepartment"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Department</FormLabel>
                                            <FormControl>
                                                <Input placeholder="faculty Coordinator Department" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="facultyCoordinatorContactNo"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Contact Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="faculty Coordinator Contact Number" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="facultyCoordinatorEmail"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Email-Id</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Faculty Coordinator Email" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <Separator className='my-5 bg-red-800' />

                            {/* Student Details */}

                            <h2 id='studentDetails' className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Student Details
                            </h2>

                            <div>
                                <Alert className='bg-sky-500'>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        Please fill all the details correctly as per your knowledege. Also read all instructions given under specific fields in the form
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="">
                                <FormField
                                    control={form.control}
                                    name="studentTeamMembers"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Team Members</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Student Team Member Names" {...field} autoComplete='off' />
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
                                    name="studentDepartment"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Department</FormLabel>
                                            <FormControl>
                                                <Input placeholder="student Department" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="studentContactNo"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Contact Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="student Contact Number" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="studentEmail"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Email-Id</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Student Email" {...field} autoComplete='off' />
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
                                    name="sanctionedDocuments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Sanctioned Documents </FormLabel>
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
                                    name="projectReport"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Project Report </FormLabel>
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
                                    name="completionLetter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Completion Letter </FormLabel>
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
                                    name="visitDocuments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Visit Documents and Photos </FormLabel>
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

export default ConsultancyForm