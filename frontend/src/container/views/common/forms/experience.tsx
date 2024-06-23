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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AlertCircle, CalendarIcon, FileArchive, Receipt } from 'lucide-react'
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
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@radix-ui/react-toast'
import { Toaster } from '@/components/ui/toaster'
import { useNavigate } from 'react-router-dom'

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
        return !file || file.size <= 1 * 1024 * 1024;
    }, `File size must be less than 1MB`)
    .refine((file) => {
        return ACCEPTED_FILE_TYPES.includes(file.type);
    }, 'File must be a pdf'
    )


const experienceSchema = z.object({
    
    experienceType: z.string().min(1,{
        message:"experience type is required!"
    }),

    organizationName: z.string().min(1,{
        message:"organization name is required!"
    }).max(100,{
        message:"organization name must not exceed 100 characters"
    }),

    organizationAddress: z.string().min(1,{
        message:"organization name is required!"
    }).max(1000,{
         message:"organization address must not exceed 1000 characters"
    }),

    organizationUrl: z.string().min(1,{
         message:"organization website url is required!"
    }).regex( new RegExp(/^(ftp|http|https):\/\/[^ "]+$/),{
        message:"Invalid url"
    }),

    designation: z.string().min(1,{
        message:"designation is required!"
    }).max(1000,{
         message:"designation must not exceed 1000 characters"
    }),

    fromDate: z.date(),
    toDate: z.date(),
    experienceIndustry: z.string().min(1, {
        message: "Experience Industry required!"
    }),

    experienceProof: pdfFileSchema

})

const formSchema = z.object({

    experienceDetails: z.array(experienceSchema).nonempty(),

});

const ExperienceForm = (props: Props) => {

    const user = useSelector((state: any) => state.user)
    const {toast} = useToast()
    const navigate = useNavigate()
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
            experienceDetails: [],
        },
    })

    const { control, handleSubmit, formState: { errors } } = form;
    const { fields, append } = useFieldArray({
        control,
        name: "experienceDetails"
    });

    function onSubmit(values: z.infer<typeof formSchema>) {

        axios.post('/common/experience',values,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        .then((res)=>{
            // console.log(res);
            if(res.data.message==='success'){

                toast({
                    title: "Experience updated successfully",
                    description: "Your experience data has been added/updated successfully",
                    action: (
                      <ToastAction className='bg-emerald-500' onClick={()=>{ navigate('/common/display/experience')}} altText="okay">Okay</ToastAction>
                    ),
                })
                form.reset()
                
            }
        })
        .catch((err)=>{
            console.log(err);  
        })

        // console.log(values)
    }

    const handleExperienceClick = (event: any) => {
        append({
            experienceType: '',
            organizationName: '',
            organizationAddress: '',
            organizationUrl: '',
            designation: '',
            fromDate: new Date(),
            toDate: new Date(),
            experienceIndustry: '',
            experienceProof: new File([], ''),
        });

        event.preventDefault()
    };

    const renderExperienceBlock = (index: number) => (
        <div key={index}>
            <Separator className='my-8 bg-red-800' />
            <div className="">

                <div className="grid md:grid-cols-2 gap-6 my-4">

                    <FormField
                        control={form.control}
                        name={`experienceDetails.${index}.experienceType`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-gray-800'>Experience Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select experience type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Current">Current</SelectItem>
                                        <SelectItem value="Past">Past</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`experienceDetails.${index}.organizationName`}
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

                </div>


                <FormField
                    control={control}
                    name={`experienceDetails.${index}.organizationAddress`}
                    render={({ field }) => (
                        <FormItem className='my-3'>
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
                    name={`experienceDetails.${index}.organizationUrl`}
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
                    name={`experienceDetails.${index}.designation`}
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
                    name={`experienceDetails.${index}.experienceIndustry`}
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
                    name={`experienceDetails.${index}.fromDate`}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className='text-grey-800'>From Date</FormLabel>
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
                    control={control}
                    name={`experienceDetails.${index}.toDate`}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className='text-grey-800'>To Date</FormLabel>
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
                    name={`experienceDetails.${index}.experienceProof`}
                    render={({ field }) => (
                        <FormItem className='md:col-span-2'>
                            <FormLabel className='text-gray-800'>Experience Proof </FormLabel>
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

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 uppercase ">
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
                                            <span><a href='#experienceDetails' onClick={() => setOpen(false)}>Experience Details</a></span>
                                        </CommandItem>
                                    </CommandGroup>
                                </CommandList>
                            </CommandDialog>

                            {/* Experience DETAILS */}
                            <h2 id='experienceDetails' className='my-5 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Details
                            </h2>
                            <Alert className='bg-green-500'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>NOTE</AlertTitle>
                                <AlertDescription>
                                    Click the Add experience button to enter a new experience . Proof for respective experience must be in a  pdf file of maximum size 1MB.
                                </AlertDescription>
                            </Alert>


                            <Button size={'lg'} onClick={handleExperienceClick} className='text-black hover:bg-emerald-600 bg-emerald-500'> Add Experience </Button>

                            {fields.map((field, index) => (
                                renderExperienceBlock(index)
                            ))}
                            <div>
                                <Button type="submit" className='bg-red-800 hover:bg-red-700'>Submit</Button>
                            </div>
                        </form>
                    </Form>
                </div>

            </div>
            <Toaster />
        </div>
    )
}

export default ExperienceForm