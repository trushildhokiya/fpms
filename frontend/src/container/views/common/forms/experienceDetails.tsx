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
const transactionSchema = z.object({
    CurrentPastExperience: z.string().min(1).max(100),
    OrganizationName: z.string().min(1).max(100),
    OrganizationAddress: z.string().min(1).max(100),
    OrganizationWebsiteLink: z.string().min(1).max(100),
    Designation: z.string().min(1).max(100),
    FromDate: z.date(),
    ToDate: z.date(),
    Experience: z.string().min(1, {
        message: "Experience type required!"
    }),
    TotalExperience: z.string().min(1).max(100),
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

    experienceDetails: z.array(transactionSchema).nonempty(),
    sanctionedOrder: pdfFileSchema,

});

const ExperienceDetailsForm = (props: Props) => {

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
            experienceDetails: undefined,
            sanctionedOrder: new File([], ''),
        },
    })

    const { control, handleSubmit, formState: { errors } } = form;
    const { fields, append } = useFieldArray({
        control,
        name: "experienceDetails"
    });

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
    }

    const handleTransactionClick = (event: any) => {
        append({
            CurrentPastExperience: '',
            OrganizationName: '',
            OrganizationAddress:  '',
            OrganizationWebsiteLink:  '',
            Designation:  '',
            FromDate: new Date(),
            ToDate: new Date(),
            Experience: '',
            TotalExperience: '',
        });

        event.preventDefault()
    };

    const renderTransactionBlock = (index: number) => (
        <div key={index}>
            <Separator className='my-8 bg-red-800' />
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name={`experienceDetails.${index}.CurrentPastExperience`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Current / Past Experience</FormLabel>
                            <FormControl>
                                <Input placeholder="Current / Past Experience" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`experienceDetails.${index}.OrganizationName`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Organization Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Organization Name" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`experienceDetails.${index}.OrganizationAddress`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Organization Address</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Organization Address" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`experienceDetails.${index}.OrganizationWebsiteLink`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Organization Website Link</FormLabel>
                            <FormControl>
                                <Input placeholder="Organization Website Link" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className='grid md:grid-cols-2 gap-6 my-4'>
                <FormField
                    control={control}
                    name={`experienceDetails.${index}.Designation`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Designation</FormLabel>
                            <FormControl>
                                <Input placeholder="Designation" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`experienceDetails.${index}.Experience`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-gray-800'>Experience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="teaching">Teaching</SelectItem>
                                    <SelectItem value="industry">Industry</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`experienceDetails.${index}.FromDate`}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className='text-grey-800'>From Date</FormLabel>
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
                    name={`experienceDetails.${index}.ToDate`}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className='text-grey-800'>To Date</FormLabel>
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
                    name={`experienceDetails.${index}.TotalExperience`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-grey-800'>Total Experience in years and months</FormLabel>
                            <FormControl>
                                <Input placeholder="Total Experience in years and months" autoComplete='off' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                        Experience <span className='hidden sm:inline-block'>Details</span>
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
                                            <Receipt className="mr-2 h-4 w-4" />
                                            <span><a href='#experienceDetails' onClick={()=>setOpen(false)}>Experience Details</a></span>
                                        </CommandItem>
                                        <CommandItem>
                                            <FileArchive className="mr-2 h-4 w-4" />
                                            <span><a href='#proofUpload' onClick={()=>setOpen(false)}>Proof Upload</a></span>
                                        </CommandItem>
                                    </CommandGroup>
                                </CommandList>
                            </CommandDialog>

                            {/* Experience DETAILS */}

                            <Alert className='bg-green-500'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>NOTE</AlertTitle>
                                <AlertDescription>
                                    Click the Add experience button to enter a new experience . Please take care that the enetered amount is not greater than the amount you have been sanctioned. The proofs for all the experience must be attached at the end of this form.
                                </AlertDescription>
                            </Alert>
                            
                             {/* Proof Upload */}
                             <div>
                                <Alert variant="default" className='bg-amber-500'>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        All proof for respective uploads must be in a single pdf file of maximum size 5MB.
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <Button size={'lg'} onClick={handleTransactionClick} className='text-black hover:bg-emerald-600 bg-emerald-500'> Add Experience </Button>

                            {fields.map((field, index) => (
                                renderTransactionBlock(index)
                            ))}
                            <div>
                                <Button type="submit" className='bg-red-800 hover:bg-red-700'>Submit</Button>
                            </div>
                        </form>
                    </Form>
                </div>

            </div>
        </div>
    )
}

export default ExperienceDetailsForm