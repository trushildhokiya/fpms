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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BookUser, FileArchive } from 'lucide-react'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { ToastAction } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import { useNavigate } from 'react-router-dom'


type Props = {}

interface ResearchData {
    _id: string,
    name: string;
    department: string;
    designation: string;
    contact: number;
    email: string;
    googleScholarId: string;
    googleScholarUrl: string;
    scopusId: string;
    scopusUrl: string;
    orcidId: string;
    hIndexGoogleScholar: string;
    hIndexScopus: string;
    citationCountGoogleScholar: number;
    citationCountScopus: number;
    iTenIndexGoogleScholar: string;
    iTenIndexScopus: string;
}


/**
 * SCHEMAS 
 */

const formSchema = z.object({
    name: z.string().min(2, {
        message: "name is required!"
    }).max(100, {
        message: "name must not exceed 100 characters"
    }),

    department: z.string().min(1, {
        message: "department is required!"
    }),

    designation: z.string().min(1, {
        message: "designation is required!"
    }).max(100, {
        message: "designation must not exceed 500 characters"
    }),

    contact: z.coerce.number({
        invalid_type_error: "Contact number is required "
    }).nonnegative({
        message: "Contact number must be a non-negative number"
    }).min(1000000000, {
        message: "Contact number must be of atleast 10 digits"
    }).max(9999999999, {
        message: "Contact number must not exceed 10 digits"
    }),

    email: z.string().min(1, {
        message: "email address is required!"
    }).email({
        message: "Invalid email address!"
    }),

    googleScholarId: z.string().min(1, {
        message: "google scholar id is required!"
    }).max(100, {
        message: "id must not exceed 100 characters"
    }),

    googleScholarUrl: z.string().min(1, {
        message: "google scholar link is required!"
    }).regex(new RegExp(/^(ftp|http|https):\/\/[^ "]+$/), {
        message: "Invalid url"
    }),

    scopusId: z.string().min(2, {
        message: "scopus id is required!"
    }).max(100, {
        message: "id must not exceed 100 characters"
    }),

    scopusUrl: z.string().min(2, {
        message: "scopus link is required!"
    }).regex(new RegExp(/^(ftp|http|https):\/\/[^ "]+$/), {
        message: "Invalid url"
    }),

    orcidId: z.string().min(2, {
        message: "orchid id is required!"
    }).max(100, {
        message: "id must not exceed 100 characters"
    }),

    hIndexGoogleScholar: z.string().min(2, {
        message: "H-Index Required"
    }),

    hIndexScopus: z.string().min(2, {
        message: "H-Index Required"
    }),

    citationCountGoogleScholar: z.coerce.number().nonnegative(),

    citationCountScopus: z.coerce.number().nonnegative(),

    iTenIndexGoogleScholar: z.string().min(2, {
        message: "i-10 Index (google scholar) is required"
    }),

    iTenIndexScopus: z.string().min(2, {
        message: "i-10 index (scopus) is required!"
    }),

});


const FacultyResearchProfile: React.FC = (props: Props) => {

    const user = useSelector((state: any) => state.user);
    const { toast } = useToast()
    const navigate = useNavigate()

    // command
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState<ResearchData>()


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

        axios.get('/common/research-profile')
            .then((res) => {
                setFormData(res.data)
                form.reset(res.data);
            })
            .catch((err) => {
                console.log(err);
            })

    }, [])

    // functions
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            department: "",
            designation: "",
            contact: 0,
            email: "",
            googleScholarId: "",
            googleScholarUrl: "",
            scopusId: "",
            scopusUrl: "",
            orcidId: "",
            hIndexGoogleScholar: "",
            hIndexScopus: "",
            citationCountGoogleScholar: 0,
            citationCountScopus: 0,
            iTenIndexGoogleScholar: "",
            iTenIndexScopus: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        
        // axios.post('/common/research-profile',values)
        // .then((res)=>{
        //     // console.log(res);
        //     if(res.data.message==='success'){

        //         toast({
        //             title: "Research profile updated successfully",
        //             description: "Your research profile information has been added/updated successfully",
        //             action: (
        //               <ToastAction className='' onClick={ ()=>{ navigate('/common/display/research-profile')}} altText="okay">Okay</ToastAction>
        //             ),
        //         })
        //         form.reset()
                
        //     }
        // })
        // .catch((err)=>{
        //     console.log(err);
        // })

        console.log(values);
        


    }


    return (
        <>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}
            <div className="container my-8">

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 ">
                    <span className="border-b-4 border-red-800 break-words ">
                        FACULTY RESEARCH PROFILE
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
                                            <FileArchive className="mr-2 h-4 w-4" />
                                            <span><a href='#researchDetails' onClick={() => setOpen(false)}>Research Details</a></span>
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

                            <div className="grid gap-6 md:grid-cols-2">

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-gray-800'>Department</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={formData?.department} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your department" />
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
                                    name="designation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Designation</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Designation" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Number</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="contact number" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type='email' placeholder="email address" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>


                            {/* BASIC DETAILS */}
                             <h2 id='researchDetails' className='my-6 pt-10 text-2xl font-AzoSans font-bold uppercase text-gray-500'>
                                Research Details
                            </h2>

                            <Alert className='bg-amber-500'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>NOTE</AlertTitle>
                                <AlertDescription>
                                    Please fill all the latest details correctly as per your knowledege.
                                </AlertDescription>
                            </Alert> 

                            <div className="grid gap-6 md:grid-cols-2">

                                
                                 <FormField
                                    control={form.control}
                                    name="googleScholarId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Google Scholar ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Google Scholar ID" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="googleScholarUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Google Scholar Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Google Scholar Url" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="scopusId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Scopus ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Scopus ID" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="scopusUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Scopus Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Scopus Link" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                <FormField
                                    control={form.control}
                                    name="orcidId"
                                    render={({ field }) => (
                                        <FormItem className='md:col-span-2'>
                                            <FormLabel>Orcid ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Orcid ID" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hIndexGoogleScholar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>H Index Goolge Scholar</FormLabel>
                                            <FormControl>
                                                <Input placeholder="H Index Goolge Scholar" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hIndexScopus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>H Index Scopus</FormLabel>
                                            <FormControl>
                                                <Input placeholder="H Index Scopus" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="citationCountGoogleScholar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Citation Count Goolge Scholar</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Citation Count Goolge Scholar" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="citationCountScopus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Citation Count Scopus</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="Citation Count Scopus" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="iTenIndexGoogleScholar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>I-10 Index Goolge Scholar</FormLabel>
                                            <FormControl>
                                                <Input placeholder="I-10 Index Goolge Scholar" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="iTenIndexScopus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>I-10 Index Scopus</FormLabel>
                                            <FormControl>
                                                <Input placeholder="I-10 Index Scopus" {...field} autoComplete='off' />
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

                <Toaster />
            </div>
        </>

    )
}

export default FacultyResearchProfile;
