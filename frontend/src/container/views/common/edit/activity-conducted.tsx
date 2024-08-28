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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AlertCircle, BookUser, CalendarIcon, FileArchive } from 'lucide-react'
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
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

type Props = {}

/**
 * SCHEMAS 
 */

interface ActivityConducted {
  _id: string;
  title: string;
  organizedBy: string;
  associationWith: string;
  mode: string;
  level: string;
  participants: number;
  fromDate: Date;
  toDate: Date;
  venue: string;
  remarks: string;
  invitationLetter: string;
  certificate: string;
  banner: string;
  report: string;
  photos: string;
  videoLink: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
    _id: z.string().optional(),
    title: z.string().min(1, {
        message: "Activity title is required!"
    }).max(100, {
        message: "Activity title must not exceed 100 characters"
    }),

    organizedBy: z.string().min(1, {
        message: "Organized by is required!"
    }).max(100, {
        message: "Organized by must not exceed 100 characters"
    }),

    associationWith: z.string().min(1, {
        message: "Association with is required!"
    }).max(100, {
        message: "Association with must not exceed 100 characters"
    }),

    mode: z.string().min(1, {
        message: "mode is required!"
    }),

    level: z.string().min(1, {
        message: "level is required!"
    }),

    participants: z.coerce.number().nonnegative(),

    fromDate: z.date(),
    toDate: z.date(),

    venue: z.string().min(1).max(100),
    remarks: z.string().min(1).max(100),

    invitationLetter: z.union([pdfFileSchema, z.any().optional()]),
    certificate: z.union([pdfFileSchema, z.any().optional()]),
    banner: z.union([pdfFileSchema, z.any().optional()]),
    report: z.union([pdfFileSchema, z.any().optional()]),
    photos: z.union([pdfFileSchema, z.any().optional()]),

    videoLink: z.string().min(1).url({
        message: "Invalid url"
    })

}).refine((data) => new Date(data.toDate) > new Date(data.fromDate), {
    message: "End Date must be greater than start date",
    path: ['toDate']
}) // Field to which the error will be attached);

const ActivityConductedEdit = (props: Props) => {

    const user = useSelector((state: any) => state.user)
    const [open, setOpen] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()
    const { toast }= useToast()
    
    //functions
    //key-board events
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


    // Fetch the project data
    useEffect(() => {
      axios
          .get(`/common/activity-conducted/${id}`)
          .then((res) => {
              const data: ActivityConducted = res.data
              form.reset({
                  ...data,
                  fromDate: new Date(data.fromDate),
                  toDate: new Date(data.toDate),
              })
          })
          .catch((err) => {
              console.error("Error fetching Activity Conducted data:", err);
          });
  }, []);


    // form schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: "",
            title: "",
            organizedBy: "",
            associationWith: "",
            mode: "",
            level: "",
            participants: 0,
            fromDate: new Date(),
            toDate: new Date(),
            venue: "",
            remarks: "",
            invitationLetter: new File([], ''),
            certificate: new File([], ''),
            banner: new File([], ''),
            report: new File([], ''),
            photos: new File([], ''),
            videoLink: "",
        },
    })

    //Posting the updates 
    function onSubmit(values: z.infer<typeof formSchema>) {
        axios.put("/common/activity-conducted", values, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            if (res.data.message === "success") {
                toast({
                    title: "Activities Conducted updated successfully",
                    description:
                        "Your conducted activities information has been updated successfully",
                    action: (
                      <ToastAction className='' onClick={() => { navigate('/common/display/activity-conducted') }} altText="okay">Okay</ToastAction>
                    ),
                });
                form.reset();
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container my-8">

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 uppercase ">
                    <span className="border-b-4 border-red-800 break-words ">
                        ACTIVITY <span className='hidden sm:inline-block'>CONDUCTED</span>
                    </span>
                </h1>



                {/* FORM */}
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

                              {/* ID HIDDEN */}
                              <FormField 
                                control={form.control} 
                                name={`_id`} 
                                render={({ field }) => (
                                  <FormItem className='hidden'>
                                    <FormLabel className='text-grey-800'>ID</FormLabel>
                                    <FormControl>
                                      <Input placeholder="ID" autoComplete='off' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            <div>

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className='my-4'>
                                            <FormLabel className='text-gray-800'>Activity Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Activity title" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                
                            </div>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">

                            <FormField
                                    control={form.control}
                                    name="organizedBy"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Activity Organized By</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Activity Organized By" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="associationWith"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>In Association with</FormLabel>
                                            <FormControl>
                                                <Input placeholder="In Association with.." {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="mode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Activity Conducted Mode</FormLabel>
                                            <Select 
                                              onValueChange={field.onChange} 
                                              defaultValue={field.value}
                                              value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a mode" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="online">Online</SelectItem>
                                                    <SelectItem value="offline">Offline</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Activity Conducted Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="international">International</SelectItem>
                                                    <SelectItem value="national">National</SelectItem>
                                                    <SelectItem value="state">State</SelectItem>
                                                    <SelectItem value="regional">Regional</SelectItem>
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
                                    control={form.control}

                                    name="toDate"
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
                                    name="participants"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>No of participants attended</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Participants Attended" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="venue"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel className='text-gray-800'>Venue </FormLabel>
                                            <FormControl>
                                                <Input placeholder="venue" type="text" autoComplete='off' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="remarks"
                                    render={({ field }) => (
                                        <FormItem className='md:col-span-2'>
                                            <FormLabel className='text-gray-800'>Remarks </FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="remarks( NA if not )" autoComplete='off' {...field} />
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
                                    name="invitationLetter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Upload Invitation Letter </FormLabel>
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
                                    name="certificate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Upload Completion Certificate / LOA </FormLabel>
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
                                    name="banner"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Upload Banner </FormLabel>
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
                                    name="report"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Upload Report </FormLabel>
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
                                    name="photos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Upload Photos </FormLabel>
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
                                    name="videoLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Video Url</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="url"
                                                    placeholder="Enter video link"
                                                    {...field}
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

export default ActivityConductedEdit