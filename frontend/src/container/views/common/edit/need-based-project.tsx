//@ts-nocheck
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
import { AlertCircle, BookUser, CalendarIcon, FileArchive, Users, UserCheck, GraduationCap } from 'lucide-react'
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
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useParams } from 'react-router-dom'

type Props = {}

interface Student {
    _id: string;
    name: string;
    department: string;
    contact: number;
    email: string;
}

interface Project {
    _id: string;
    projectTitle: string;
    description: string;
    outcomes: string;
    departmentInvolved: string[];
    facultiesInvolved: string[];
    institutionName: string;
    institutionAddress: string;
    institutionUrl: string;
    collaborationType: string;
    facultyCoordinatorName: string;
    facultyCoordinatorDepartment: string;
    facultyCoordinatorContact: string;
    facultyCoordinatorEmail: string;
    students: Student[];
    startDate: Date;
    endDate: Date;
    sanctionedDocuments: string;
    projectReport: string;
    completionLetter: string;
    visitDocuments: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

/**
 * SCHEMAS 
 */

const studentSchema = z.object({
    name: z.string().min(1).max(100),
    department: z.string().min(1),
    contact: z.coerce.number().min(1000000000).max(9999999999),
    email: z.string().min(1).email()
})


const ACCEPTED_FILE_TYPES = [
    'application/pdf'
];

const pdfFileSchema = z.instanceof(File)
    .refine((file) => {
        return !file || file.size <= 5 * 1024 * 1024;
    }, `File size must be less than 5MB`)
    .refine((file) => {
        return ACCEPTED_FILE_TYPES.includes(file.type);
    }, 'File must be a pdf'
    )

const formSchema = z.object({

    projectTitle: z.string().min(1, {
        message: "Project Title required!"
    }).max(300, {
        message: "Project Title must not exceed 300 characters"
    }),

    description: z.string().min(1).max(1000),
    outcomes: z.string().min(1).max(1000),

    institutionAddress: z.string().min(1).max(1000),

    departmentInvolved: z.array(z.string()).nonempty(),

    facultiesInvolved: z.string({
        invalid_type_error: "Faculties Somaiya ID is required!"
    }).transform(value => value.split(',').map(email => email.trim()))
        .refine(emails => emails.every(email => z.string().email().safeParse(email).success), {
            message: "Each faculty email must be a valid email address",
        }),

    institutionName: z.string().min(1, {
        message: "Institution/Organisation Name required!"
    }).max(100, {
        message: "Institution/Organisation Name must not exceed 100 characters"
    }),

    facultyCoordinatorName: z.string().min(1, {
        message: "Faculty Coordinator Name required!"
    }).max(100, {
        message: "Faculty Coordinator Name must not exceed 100 characters"
    }),

    facultyCoordinatorDepartment: z.string().min(2, {
        message: "Faculty Coordinator Department required!"
    }).max(100, {
        message: "Faculty Coordinator Department must not exceed 100 characters"
    }),

    facultyCoordinatorContact: z.string().regex(/^[0-9]{10}$/, {
        message: "Contact number must be 10 digits"
    }),

    facultyCoordinatorEmail: z.string().email({
        message: "Invalid email address format"
    }).min(5, {
        message: "Email required!"
    }).max(100, {
        message: "Email must not exceed 100 characters"
    }),

    students: z.array(studentSchema),

    collaborationType: z.string().min(1, {
        message: "Collaboration Type required!"
    }),

    institutionUrl: z.string().url({
        message: "Invalid website URL format"
    }).min(1, {
        message: "Website URL required!"
    }).max(1000, {
        message: "Website URL must not exceed 1000 characters"
    }),

    startDate: z.date(),
    endDate: z.date(),


    sanctionedDocuments: z.union([pdfFileSchema, z.any().optional()]),
    projectReport: z.union([pdfFileSchema, z.any().optional()]),
    completionLetter: z.union([pdfFileSchema, z.any().optional()]),
    visitDocuments: z.union([pdfFileSchema, z.any().optional()]),

}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be greater than start date",
    path: ["endDate"], // Field to which the error will be attached
});

const NeedBasedProjectForm = (props: Props) => {

    const user = useSelector((state: any) => state.user)
    const { toast } = useToast()

    //constants

    const departments = [
        "Computer",
        "Information Technology",
        "Artificial Intelligence and Data Science",
        "Electronics and Telecommunication",
        "Basic Science and Humanities"
    ];

    // command
    const [open, setOpen] = useState(false)
    const { id } = useParams()

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
        // Fetch the project data
        axios
            .get(`/common/need-based-project/${id}`)
            .then((res) => {

                const data: Project = res.data

                form.reset({
                    ...data,
                    facultiesInvolved: data.facultiesInvolved.join(', '),
                    startDate: new Date(data.startDate),
                    endDate: new Date(data.endDate),
                    students: data.students.map(student => student)
                })
            })
            .catch((err) => {
                console.error("Error fetching project honors data:", err);
            });
    }, []);
    // functions



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectTitle: "",
            institutionName: "",
            collaborationType: "",
            facultiesInvolved: [],
            departmentInvolved: [],
            startDate: new Date(),
            endDate: new Date(),
            institutionAddress: "",
            institutionUrl: "",
            facultyCoordinatorName: "",
            facultyCoordinatorDepartment: "",
            facultyCoordinatorContact: "",
            facultyCoordinatorEmail: "",
            students: [],
            description: "",
            outcomes: "",
            sanctionedDocuments: new File([], ''),
            projectReport: new File([], ''),
            completionLetter: new File([], ''),
            visitDocuments: new File([], ''),
        },
    })

    const { control, handleSubmit, formState: { errors } } = form;
    const { fields, append } = useFieldArray({
        control,
        name: "students"
    });

    const handleStudentClick = (event: any) => {
        append({
            name: '',
            contact: 0,
            department: '',
            email: '',
        });

        event.preventDefault()
    };

    const renderStudentBlock = (index: number) => (
        <div key={index}>
            <Separator className='my-8 bg-red-800' />
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name={`students.${index}.name`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Student Name</FormLabel>
                            <FormControl>
                                <Input placeholder="name" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`students.${index}.department`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select  Department" />
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
                    control={control}
                    name={`students.${index}.email`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Email Address" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`students.${index}.contact`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Student Contact Number</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Contact Number" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Separator className='my-8 bg-red-800' />
        </div>
    );



    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values);

    }

    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container my-8">

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 uppercase ">
                    <span className="border-b-4 border-red-800 break-words ">
                        <span className='hidden sm:inline-block'> NEED BASED</span> Projects
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
                                            <Users className="mr-2 h-4 w-4" />
                                            <span><a href='#partnerInstitutionDetails' onClick={() => setOpen(false)}>Partner Institution Details</a></span>
                                        </CommandItem>
                                        <CommandItem>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            <span><a href='#facultyCoordinator' onClick={() => setOpen(false)}>Faculty Coordinator Details</a></span>
                                        </CommandItem>
                                        <CommandItem>
                                            <GraduationCap className="mr-2 h-4 w-4" />
                                            <span><a href='#studentDetails' onClick={() => setOpen(false)}>Student Details</a></span>
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
                                    name="facultiesInvolved"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Faculties Involved Somaiya Mail Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="eg: maxmiller@somaiya.edu, david@somaiya.edu" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormDescription>
                                                Write mutiple email seperated by commas(,)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="departmentInvolved"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Department Involved</FormLabel>
                                            <FormControl>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className='w-full overflow-hidden'>
                                                            {field.value?.length > 0 ? field.value.join(', ') : "Select Involved Departments"}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="">
                                                        <DropdownMenuLabel>Select Departments</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {departments.map(option => (
                                                            <DropdownMenuCheckboxItem
                                                                key={option}
                                                                checked={field.value?.includes(option)}
                                                                onCheckedChange={() => {
                                                                    const newValue = field.value?.includes(option)
                                                                        ? field.value.filter(val => val !== option)
                                                                        : [...(field.value || []), option];
                                                                    field.onChange(newValue);
                                                                }}
                                                            >
                                                                {option}
                                                            </DropdownMenuCheckboxItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
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
                                            <FormLabel className='text-grey-800'>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className=" w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown-buttons"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        fromYear={1900}
                                                        toYear={2100}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}

                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className='text-grey-800'>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className=" w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown-buttons"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        fromYear={1900}
                                                        toYear={2100}
                                                    />
                                                </PopoverContent>
                                            </Popover>
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

                            <Alert className='bg-teal-500'>
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
                                            <FormLabel className='text-gray-800'>Institution Name</FormLabel>
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
                                            <FormLabel className='text-gray-800'>Institution Address </FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="instituion/organisation Name must not exceed 1000 characters" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="institutionUrl"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Institution website URL</FormLabel>
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
                                <Alert className='bg-cyan-500'>
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
                                        <FormItem className=''>
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
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select  Department" />
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
                                    name="facultyCoordinatorContact"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Contact Number</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="faculty Coordinator Contact Number" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="facultyCoordinatorEmail"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Email Address</FormLabel>
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
                                <Alert className='bg-lime-400'>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        Please fill all the details correctly as per your knowledege.Click the add button to enter students details
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="">

                                <Button size={'lg'} onClick={handleStudentClick} className='text-black hover:bg-lime-600 bg-lime-500'> Add Student </Button>

                                {fields.map((field, index) => (
                                    renderStudentBlock(index)
                                ))}

                            </div>

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
            <Toaster />
        </div>
    )
}

export default NeedBasedProjectForm