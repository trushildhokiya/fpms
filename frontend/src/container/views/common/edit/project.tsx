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
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import axios from 'axios'
import { ToastAction } from '@/components/ui/toast'
import { useParams } from 'react-router-dom'

type Props = {}

interface Project {
    _id: string;
    projectTitle: string;
    principalInvestigator: string;
    coInvestigators: string[];
    departmentInvolved: string[];
    facultiesInvolved: string[];
    fundingScheme: string;
    fundingAgency: string;
    nationalInternational: string;
    budgetAmount: number;
    sanctionedAmount: number;
    startDate: Date;
    endDate: Date;
    totalGrantReceived: number;
    domain: string;
    areaOfExpertise: string;
    description: string;
    transactionDetails: TransactionDetail[];
    sanctionedOrder: string;
    transactionProof: string;
    completionCertificate: string;
    supportingDocuments: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface TransactionDetail {
    _id: string;
    purchaseOrderNumber: string;
    purchaseOrderDate: Date;
    purchaseInvoiceNumber: string;
    purchaseInvoiceDate: Date;
    bankName: string;
    branchName: string;
    amountReceived: number;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}


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
    amountReceived: z.coerce.number().nonnegative(),
    remarks: z.string().max(1000, {
        message: "Remarks must not exceed 1000 characters"
    }).optional(),
})

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
    }).max(300, {
        message: "Project Title must not exceed 300 characters"
    }),

    principalInvestigator: z.string().min(2, {
        message: "Principal Investigator is required!"
    }).max(100, {
        message: "Principal Investigator must not exceed 100 characters"
    }),

    coInvestigators: z.string({
        invalid_type_error: "Required fields must be filled !"
    }).transform((value) => value.split(',').map((name) => name.trim())),

    departmentInvolved: z.array(z.string()).nonempty(),

    facultiesInvolved: z.string({
        invalid_type_error: "Faculties Somaiya ID is required!"
    }).transform(value => value.split(',').map(email => email.trim()))
        .refine(emails => emails.every(email => z.string().email().safeParse(email).success), {
            message: "Each faculty email must be a valid email address",
        }),

    fundingScheme: z.string().min(2, {
        message: "Funding Scheme required!"
    }).max(100, {
        message: "Funding Scheme must not exceed 100 characters"
    }),

    fundingAgency: z.string().min(2, {
        message: "Funding Agency required !"
    }).max(100, {
        message: "Funding agency must be less than 100 characters"
    }),

    nationalInternational: z.string().min(1, {
        message: "Funding Agency type required!"
    }),

    budgetAmount: z.coerce.number().nonnegative(),
    sanctionedAmount: z.coerce.number().nonnegative(),

    startDate: z.date(),
    endDate: z.date(),

    totalGrantReceived: z.coerce.number().nonnegative(),
    domain: z.string().min(1, {
        message: "Domain is required!"
    }).max(100, {
        message: "Domain must not exceed maximum of 100 characters"
    }),

    areaOfExpertise: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    transactionDetails: z.array(transactionSchema).nonempty(),

    sanctionedOrder: z.union([pdfFileSchema, z.any().optional()]),
    transactionProof: z.union([pdfFileSchema, z.any().optional()]),
    completionCertificate: z.union([pdfFileSchema, z.any().optional()]),
    supportingDocuments: z.union([pdfFileSchema, z.any().optional()]),

}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be greater than start date",
    path: ["endDate"], // Field to which the error will be attached
});

const ProjectForm = (props: Props) => {

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
        axios.get(`/common/projects/${id}`)
            .then((res) => {

                const data: Project = res.data

                form.reset({
                    ...data,
                    facultiesInvolved: data.facultiesInvolved.join(', '),
                    coInvestigators: data.coInvestigators.join(', '),
                    startDate: new Date(data.startDate),
                    endDate: new Date(data.endDate),
                    transactionDetails:data.transactionDetails.map( transaction => ({
                        ...transaction,
                        purchaseInvoiceDate: new Date(transaction.purchaseInvoiceDate),
                        purchaseOrderDate: new Date(transaction.purchaseOrderDate)
                    }))
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
            principalInvestigator: "",
            coInvestigators: [''],
            facultiesInvolved: [],
            departmentInvolved: [],
            fundingScheme: "",
            fundingAgency: "",
            nationalInternational: "",
            budgetAmount: 0,
            sanctionedAmount: 0,
            startDate: new Date(),
            endDate: new Date(),
            totalGrantReceived: 0,
            domain: "",
            areaOfExpertise: "",
            description: "",
            transactionDetails: [],
            sanctionedOrder: new File([], ''),
            transactionProof: new File([], ''),
            completionCertificate: new File([], ''),
            supportingDocuments: new File([], ''),
        },
    })

    const { control, handleSubmit, formState: { errors } } = form;
    const { fields, append } = useFieldArray({
        control,
        name: "transactionDetails"
    });

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
    }

    const handleTransactionClick = (event: any) => {
        append({
            purchaseOrderNumber: '',
            purchaseOrderDate: new Date(),
            purchaseInvoiceNumber: '',
            purchaseInvoiceDate: new Date(),
            bankName: '',
            branchName: '',
            amountReceived: 0,
            remarks: '',
        });

        event.preventDefault()
    };

    const renderTransactionBlock = (index: number) => (
        <div key={index}>
            <Separator className='my-8 bg-red-800' />
            <div className="grid md:grid-cols-2 gap-6">

                <FormField
                    control={control}
                    name={`transactionDetails.${index}.purchaseOrderNumber`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Purchase Order Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Purchase Order Number" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`transactionDetails.${index}.purchaseInvoiceNumber`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Purchase Invoice Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Purchase Invoice number" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`transactionDetails.${index}.purchaseOrderDate`}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className='text-grey-800'>Purchase Order Date</FormLabel>
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
                                        toYear={2300}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={control}
                    name={`transactionDetails.${index}.purchaseInvoiceDate`}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className='text-grey-800'>Purchase Invoice Date</FormLabel>
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
                                        toYear={2300}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`transactionDetails.${index}.bankName`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Bank Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Bank Name" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`transactionDetails.${index}.branchName`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Branch Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Branch Name" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="">
                <FormField
                    control={control}
                    name={`transactionDetails.${index}.amountReceived`}
                    render={({ field }) => (
                        <FormItem className='my-4'>
                            <FormLabel className='text-grey-800'>Amount Received</FormLabel>
                            <FormControl>
                                <Input type='number' placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`transactionDetails.${index}.remarks`}
                    render={({ field }) => (
                        <FormItem className='my-4'>
                            <FormLabel className='text-grey-800'>Remarks</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Remarks ( if any ) " autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Separator className='my-8 bg-red-800' />
        </div>
    );


    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container my-8">

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 ">
                    <span className="border-b-4 border-red-800 break-words ">
                        MAJOR/MINOR <span className='hidden sm:inline-block'>PROJECTS</span>
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

                            <div className="">
                                <FormField
                                    control={form.control}
                                    name="projectTitle"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Major/Minor Project Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="project Title" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="principalInvestigator"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Principal Investigator</FormLabel>
                                            <FormControl>
                                                <Input placeholder="principal Investigator" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coInvestigators"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Co-Investigators</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="eg: John Smith, David Fawling" {...field} autoComplete='off' />
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
                                    name="fundingScheme"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Funding Scheme</FormLabel>
                                            <FormControl>
                                                <Input placeholder="funding Scheme" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="fundingAgency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Funding Agency</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="funding Agency " {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nationalInternational"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Funding Agency Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                                    name="budgetAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Budget Amount</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Budget Amount" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sanctionedAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Grant Sanctioned Amount</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Sanctioned Amount" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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
                                                        toYear={2300}
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
                                                        toYear={2300}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="totalGrantReceived"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Total Grant Recieved </FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Total Grant Recieved" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="domain"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Domain </FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="eg: Neuro Science" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <div className="">

                                <FormField
                                    control={form.control}
                                    name="areaOfExpertise"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Area of Expertise </FormLabel>
                                            <FormControl>
                                                <Input type='text' autoComplete='off' placeholder="eg: Human Psychology" {...field} />
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

                            {/* Transaction DETAILS */}
                            <h2 className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500' id='transactionDetails'>
                                Transaction Details
                            </h2>

                            <Alert className='bg-green-500'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>NOTE</AlertTitle>
                                <AlertDescription>
                                    Click the Add Transaction button to enter a new transaction . Please take care that the enetered amount is not greater than the amount you have been sanctioned. The proofs for all the transaction must be attached at the end of this form.
                                </AlertDescription>
                            </Alert>

                            <Button size={'lg'} onClick={handleTransactionClick} className='text-black hover:bg-emerald-600 bg-emerald-500'> Add Transaction </Button>

                            {fields.map((field, index) => (
                                renderTransactionBlock(index)
                            ))}

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
                                    name="sanctionedOrder"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Sanctioned Order </FormLabel>
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
                                    name="transactionProof"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Transaction Proof </FormLabel>
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
                                    name="completionCertificate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Completion Certificate </FormLabel>
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
                                    name="supportingDocuments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Supporting Documents </FormLabel>
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

export default ProjectForm