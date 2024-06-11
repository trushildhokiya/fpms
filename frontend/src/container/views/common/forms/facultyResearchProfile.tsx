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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
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
    Name: z.string().min(2, {
        message: "Name required!"
    }).max(500, {
        message: "Name must not exceed 500 characters"
    }),

    Department: z.string().min(1, {
        message: "Journel type required!"
    }),

    Designation: z.string().min(2, {
        message: "Designation required!"
    }).max(500, {
        message: "Designation must not exceed 500 characters"
    }),

    contactInfromation: z.string()
        .min(2, { message: "Contact Information is required!" })
        .transform((value) => value.split(',').map((name) => name.trim()))
        .refine((value) => value.length >= 1 && value.length <= 10, {
            message: "Must Enter at least 1 and at most 10 Inventors.",
        }),

    googleScholarID: z.string().min(2, {
        message: "ID required!"
    }).max(100, {
        message: "ID must not exceed 100 characters"
    }),

    googleScholarLink: z.string().min(2, {
        message: "Link required!"
    }),

    scopusID: z.string().min(2, {
        message: "ID required!"
    }).max(100, {
        message: "ID must not exceed 100 characters"
    }),

    scopusLink: z.string().min(2, {
        message: "Link required!"
    }),

    orcidID: z.string().min(2, {
        message: "ID required!"
    }).max(100, {
        message: "ID must not exceed 100 characters"
    }),

    hIndexGoogleScholar: z.string().min(2, {
        message: "H-Index Required"
    }),

    hIndexScopus: z.string().min(2, {
        message: "H-Index Required"
    }),

    citationCountGoogleScholar: z.string().min(2, {
        message: "Citation Count Needed"
    }),

    citationCountScopus: z.string().min(2, {
        message: "Citation Count Needed"
    }),

    i10IndexGoogleScholar: z.string().min(2, {
        message: "I-10 Index Required"
    }),

    i10IndexScopus: z.string().min(2, {
        message: "I-10 Index Required"
    }),

});


const FacultyResearchProfile: React.FC = (props: Props) => {

    const user = useSelector((state: any) => state.user);

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
            Name: "",
            Department: "",
            Designation: "",
            contactInfromation: undefined,
            googleScholarID: "",
            googleScholarLink: "",
            scopusID: "",
            scopusLink: "",
            orcidID: "",
            hIndexGoogleScholar: "",
            hIndexScopus: "",
            citationCountGoogleScholar: "",
            citationCountScopus: "",
            i10IndexGoogleScholar: "",
            i10IndexScopus: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    const { control, handleSubmit, formState: { errors } } = form;

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

                            <FormField
                                control={form.control}
                                name="Name"
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
                                name="Department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-gray-800'>Department</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="computer">Computer</SelectItem>
                                                <SelectItem value="information technology">Information Technology</SelectItem>
                                                <SelectItem value="artificial intelligence and data science">Artificial Intelligence and Data Science</SelectItem>
                                                <SelectItem value="electronics and telecommunication">Electronics and Telecommunication</SelectItem>
                                                <SelectItem value="basic science and humanities">Basic Science and Humanities</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="Designation"
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
                                name="contactInfromation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Information</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Email, phone..." {...field} autoComplete='off' />
                                        </FormControl>
                                        <FormDescription>
                                            Write mutiple names seperated by commas(,)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">

                                <FormField
                                    control={form.control}
                                    name="googleScholarID"
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
                                    name="googleScholarLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Google Scholar Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Google Scholar Link" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="scopusID"
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
                                    name="scopusLink"
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

                            </div>

                            <FormField
                                control={form.control}
                                name="orcidID"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Orcid ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Orcid ID" {...field} autoComplete='off' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className=' grid md:grid-cols-2 grid-cols-1 gap-6'>
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
                                                <Input placeholder="Citation Count Goolge Scholar" {...field} autoComplete='off' />
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
                                                <Input placeholder="Citation Count Scopus" {...field} autoComplete='off' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="i10IndexGoogleScholar"
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
                                    name="i10IndexScopus"
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

                            <Separator className='my-5 bg-red-800' />

                            <Button type="submit" className='bg-red-800 hover:bg-red-700'>Submit</Button>
                        </form>
                    </Form>
                </div>

            </div>
        </>

    )
}

export default FacultyResearchProfile;
