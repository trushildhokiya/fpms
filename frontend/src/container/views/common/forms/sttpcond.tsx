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
import { AlertCircle, CalendarIcon } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

    const imageFileSchema = z.instanceof(File);

    const sttpSchema = z.object({
        sttpTitle: z.string()
          .min(2, { message: "STTP / FDP Title is required and must be at least 2 characters" })
          .max(100, { message: "STTP / FDP Title must not exceed 100 characters" }),
        
        type: z.enum(["STTP", "FDP"], { 
          required_error: "Type is required" 
        }),
        
        organizedBy: z.string()
          .min(2, { message: "Organizer is required and must be at least 2 characters" })
          .max(100, { message: "Organizer must not exceed 100 characters" }),
        
        inAssociationWith: z.string()
          .max(100, { message: "In Association With must not exceed 100 characters" })
          .optional(),
        
        venue: z.string()
          .min(2, { message: "Venue is required and must be at least 2 characters" })
          .max(100, { message: "Venue must not exceed 100 characters" }),
        
        mode: z.enum(["Online", "Offline"], { 
          required_error: "Mode is required" 
        }),
        
        fromDate: z.date(),
        toDate: z.date(),
        
        noOfDays: z.string()
          .min(1, { message: "Number of days must be at least 1" }),

        title: z.string()
        .min(2, { message: "Title is required and must be at least 2 characters" })
        .max(100, { message: "Title must not exceed 100 characters" }),
        
        level: z.enum(["International", "National", "Regional"], { 
          required_error: "Level is required" 
        }),
        
        remarks: z.string()
          .max(500, { message: "Remarks must not exceed 500 characters" })
          .optional(),
        
        uploadCertificate: pdfFileSchema,
        uploadInvitation: pdfFileSchema,
        uploadPhotos: z.array(imageFileSchema).optional(),

      }).refine(data => new Date(data.toDate) > new Date(data.fromDate), {
        message: "End date must be greater than start date",
        path: ["toDate"], // Field to which the error will be attached
      });  

const Sttpcond = (props: Props) => {

    const user = useSelector((state: any) => state.user)

    // command
    const [open, setOpen] = useState(false)
    const [uploadPhotos, setUploadPhotos] = useState<File[]>([]);

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
        resolver: zodResolver(sttpSchema),
        defaultValues: {
          sttpTitle: "",
          type: "",
          organizedBy: "",
          inAssociationWith: "",
          venue: "",
          mode: "",
          fromDate: undefined,
          toDate: undefined,
          noOfDays: "",
          title: "",
          level: "",
          remarks: "",
          uploadCertificate: new File([], ''),
          uploadInvitation: new File([], ''),
          uploadPhotos: [],
        },
      });

    const { control, handleSubmit, formState: { errors } } = form;

    function onSubmit(values: z.infer<typeof sttpSchema>) {

        console.log(values)
    }


    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container my-8">

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 ">
                    <span className="border-b-4 border-red-800 break-words ">
                        STTP / FDP <span className='hidden sm:inline-block'>CONDUCTED</span>
                    </span>
                </h1>

                <Alert className='bg-sky-500'>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>NOTE</AlertTitle>
                    <AlertDescription>
                        Please fill all the details correctly as per your knowledege. Also read all instructions given under specific fields in the form
                    </AlertDescription>
                </Alert>

                <div className="p-2 font-Poppins text-xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => console.log(data))} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="sttpTitle"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                            <FormLabel className='text-gray-800'>STTP / FDP Title</FormLabel>
                            <FormControl>
                                <Input placeholder="STTP / FDP Title" {...field} autoComplete='off' />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />


                        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormLabel className='text-gray-800'>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="STTP">STTP</SelectItem>
                                            <SelectItem value="FDP">FDP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                        control={form.control}
                        name="organizedBy"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                            <FormLabel className='text-gray-800'>STTP Organized by</FormLabel>
                            <FormControl>
                                <Input placeholder="Organizer" {...field} autoComplete='off' />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="inAssociationWith"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                            <FormLabel className='text-gray-800'>In Association with</FormLabel>
                            <FormControl>
                                <Input placeholder="In Association with" {...field} autoComplete='off' />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="venue"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                            <FormLabel className='text-gray-800'>Venue</FormLabel>
                            <FormControl>
                                <Input placeholder="Venue" {...field} autoComplete='off' />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="mode"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormLabel className='text-gray-800'>Mode</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a mode" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Online">Online</SelectItem>
                                            <SelectItem value="Offline">Offline</SelectItem>
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
                                <FormItem className='mt-2'>
                                    <FormLabel className='text-gray-800'>Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="National">National</SelectItem>
                                            <SelectItem value="International">International</SelectItem>
                                            <SelectItem value="Regional">Regional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='fromDate'
                            render={({ field }) => (
                                <FormItem className="flex flex-col mt-2">
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
                            name='toDate'
                            render={({ field }) => (
                                <FormItem className="flex flex-col mt-2">
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
                        name="noOfDays"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                            <FormLabel className='text-gray-800'>No. of Days</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="No. of Days" {...field} autoComplete='off' />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />


                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                <FormLabel className='text-gray-800'>Title of Session Conducted</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title of Session Conducted" {...field} autoComplete='off' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="uploadCertificate"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
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
                        
                        <FormField
                            control={form.control}
                            name="uploadInvitation"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormLabel className='text-gray-800'>Upload Invitation Letter</FormLabel>
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
                            name="uploadPhotos"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormLabel className='text-gray-800'>Upload Photos</FormLabel>
                                    <FormControl>
                                        <Input
                                            accept=".jpg,.jpeg,.png"
                                            type="file"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                field.onChange(files)
                                                setUploadPhotos(files)
                                            }
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        </div>

                        <div className='grid grid-cols-5 max-lg:grid-cols-4 max-md:grid-cols-2 gap-4'>
                            {uploadPhotos.map((img, index) => (
                            <img 
                                key={index}
                                src={URL.createObjectURL(img)} 
                                className='max-w-[200px] max-h-[100px] max-lg:max-w-[150px] max-lg:max-h-[75px] m-2'
                            />
                            ))}
                        </div>


                        <FormField
                            control={control}
                            name="remarks"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormLabel className='text-grey-800'>Remarks</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Remarks ( if any ) " autoComplete='off' {...field} />
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
        </div>
    )
}

export default Sttpcond