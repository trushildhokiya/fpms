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
import { AlertCircle, CalendarIcon } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
    remarks: z.string().max(1000,{
        message:"Remarks must not exceed 1000 characters"
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
    }).max(100, {
        message: "Project Title must not exceed 100 characters"
    }),

    principalInvestigator: z.string().min(2, {
        message: "Principal Investigator is required!"
    }).max(100, {
        message: "Principal Investigator must not exceed 100 characters"
    }),

    coInvestigators: z.string({
        invalid_type_error: "Required fields must be filled !"
    }).transform((value) => value.split(',').map((name) => name.trim())),

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

    totalGrantRecieved: z.coerce.number().nonnegative(),
    domain: z.string().min(1, {
        message: "Domain is required!"
    }).max(100, {
        message: "Domain must not exceed maximum of 100 characters"
    }),

    areaOfExpertise: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    transactionDetails: z.array(transactionSchema).nonempty(),

    sanctionedOrder: pdfFileSchema,
    transactionProof: pdfFileSchema,
    completionCertificate: pdfFileSchema,
    supportingDocuments: pdfFileSchema,

}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be greater than start date",
    path: ["endDate"], // Field to which the error will be attached
});

const ConsultancyForm = (props: Props) => {

    const user = useSelector((state: any) => state.user)

    // functions

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectTitle: "",
            principalInvestigator: "",
            coInvestigators: [''],
            fundingAgency: "",
            nationalInternational: "",
            budgetAmount: 0,
            sanctionedAmount: 0,
            startDate: undefined,
            endDate: undefined,
            totalGrantRecieved: 0,
            domain: "",
            areaOfExpertise: "",
            description: "",
            transactionDetails: undefined,
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
            amountRecieved: 0,
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
                                <Input placeholder="Purchase Order Number"  autoComplete='off' {...field}  />
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
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                    name={`transactionDetails.${index}.purchaseInvoiceDate`}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className='text-grey-800'>Purchase Invoice Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                                <Input placeholder="Bank Name"  autoComplete='off' {...field} />
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
                                <Input placeholder="Branch Name"  autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="">
                <FormField
                    control={control}
                    name={`transactionDetails.${index}.amountRecieved`}
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
                                <Textarea placeholder="Remarks ( if any ) "  autoComplete='off' {...field} />
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
                        CONSULTANCY <span className='hidden sm:inline-block'>PROJECTS</span>
                    </span>
                </h1>

                <div className="p-2 font-Poppins text-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* BASIC DETAILS */}
                            <h2 className='my-5 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
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
                                            <FormLabel className='text-gray-800'>Project Title</FormLabel>
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

                            </div>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="fundingAgency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Funding Agency</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="funding Agency " {...field}  autoComplete='off' />
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
                                                Please select the start date.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="totalGrantRecieved"
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
                                                <Input type='text' placeholder="eg: Neuro Science"  autoComplete='off' {...field} />
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
                                                <Input type='text'  autoComplete='off' placeholder="eg: Human Psychology" {...field} />
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
                                                <Textarea placeholder="description must not exceed 1000 characters"  autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            <Separator className='my-5 bg-red-800' />

                            {/* Transaction DETAILS */}
                            <h2 className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
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
                            <h2 className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
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
        </div>
    )
}

export default ConsultancyForm