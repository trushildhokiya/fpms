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
import { useState } from 'react'
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
    remarks: z.string().optional(),
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
        invalid_type_error: "English"
    }).transform((value) => value.split(',').map((name) => name.trim())),

    fundingAgency: z.string().min(2, {
        message: "Funding Agency required !"
    }).max(100, {
        message: "Funding agency must be less than 100 characters"
    }),

    nationalInternational: z.string().min(1, {
        message: "This field must be marked"
    }),

    budgetAmount: z.coerce.number().nonnegative(),
    sanctionedAmount: z.coerce.number().nonnegative(),

    startDate: z.date(),
    endDate: z.date(),

    totalGrantRecieved: z.coerce.number().nonnegative(),
    domain: z.string().min(1, {
        message: "Enter required domain!"
    }).max(100, {
        message: "Domain must be maximum of 100 characters"
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

    const handleTransactionClick = (event:any) => {
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
                            <FormLabel>Purchase Order Number</FormLabel>
                            <FormControl>
                                <Input placeholder="sample" {...field} />
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
                            <FormLabel>Purchase Order Date</FormLabel>
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
                            <FormLabel>Purchase Invoice Number</FormLabel>
                            <FormControl>
                                <Input placeholder="sample" {...field} />
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
                            <FormLabel>Purchase Invoice Date</FormLabel>
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
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                                <Input placeholder="sample" {...field} />
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
                            <FormLabel>Branch Name</FormLabel>
                            <FormControl>
                                <Input placeholder="sample" {...field} />
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
                        <FormItem>
                            <FormLabel>Amount Received</FormLabel>
                            <FormControl>
                                <Input type='number' placeholder="sample" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`transactionDetails.${index}.remarks`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                                <Textarea placeholder="sample" {...field} />
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
                            <div className="">
                                <FormField
                                    control={form.control}
                                    name="projectTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="shadcn" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="principalInvestigator"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Principal Investigator</FormLabel>
                                            <FormControl>
                                                <Input placeholder="shadcn" {...field} autoComplete='off' />
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
                                            <FormLabel>Co-Investigators</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="shadcn" {...field} autoComplete='off' />
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
                                            <FormLabel>Funding Agency</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="shadcn" {...field} />
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
                                            <FormLabel>Funding Agency Type</FormLabel>
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
                                            <FormLabel>Budget Amount</FormLabel>
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
                                            <FormLabel>Grant Sanctioned Amount</FormLabel>
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
                                            <FormLabel>Start Date</FormLabel>
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
                                            <FormLabel>End Date</FormLabel>
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
                                            <FormLabel>Total Grant Recieved </FormLabel>
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
                                            <FormLabel>Domain </FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="shadcn" {...field} />
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
                                            <FormLabel>Area of Expertise </FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder="shadcn" {...field} />
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
                                            <FormLabel>Description </FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="description max 1000 chars" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                            {/* Transaction DETAILS */}
                            <h2 className='my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Transaction Details
                            </h2>

                            <Button size={'lg'} onClick={handleTransactionClick}> Add Transaction </Button>

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
                                            <FormLabel>Sanctioned Order </FormLabel>
                                            <FormControl>
                                                <Input
                                                    accept=".pdf, .docx"
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
                                            <FormLabel>Transaction Proof </FormLabel>
                                            <FormControl>
                                                <Input
                                                    accept=".pdf, .docx"
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
                                            <FormLabel>Completion Certificate </FormLabel>
                                            <FormControl>
                                                <Input
                                                    accept=".pdf, .docx"
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
                                            <FormLabel>Supporting Documents </FormLabel>
                                            <FormControl>
                                                <Input
                                                    accept=".pdf, .docx"
                                                    type="file"
                                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>

            </div>
        </div>
    )
}

export default ConsultancyForm