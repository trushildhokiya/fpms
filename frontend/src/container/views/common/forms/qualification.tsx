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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AlertCircle, Check, ChevronsUpDown, Receipt } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
    Command,
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
import { cn } from '@/lib/utils'

type Props = {}

/**
 * SCHEMAS 
 */


const qualificationSchema = z.object({

    degree: z.string().min(1, {
        message: "degree type is required!"
    }),

    stream: z.string().min(1, {
        message: "stream is required!"
    }).max(100, {
        message: "stream must not exceed 100 characters"
    }),

    institute: z.string().min(1, {
        message: "institute name is required!"
    }).max(1000, {
        message: "institute name must not exceed 1000 characters"
    }),

    university: z.string().min(1, {
        message: "university name is required!"
    }).max(1000, {
        message: "university name must not exceed 1000 characters"
    }),

    year: z.coerce.number().min(1900).max(2300),

    class: z.string().min(1, {
        message: "class is required!"
    }).max(100, {
        message: "class must not exceed 100 characters"
    }),

    status: z.string().min(1, {
        message: "status is required!"
    }).max(100, {
        message: "status must not exceed 100 characters"
    }),

})

const degrees = [
    { label: "Bachelor's", value: "bachelor" },
    { label: "Master's", value: "master" },
    { label: "Ph.D.", value: "phd" },
    { label: "Diploma", value: "diploma" },
    { label: "Associate", value: "associate" },
    { label: "High School", value: "hsc" },
    { label: "Other", value: "other" },
] as const;

const formSchema = z.object({

    qualificationDetails: z.array(qualificationSchema).nonempty(),

});

const QualificationForm = (props: Props) => {

    const user = useSelector((state: any) => state.user)
    const { toast } = useToast()
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
            qualificationDetails: [],
        },
    })

    const { control, formState: { errors } } = form;
    const { fields, append } = useFieldArray({
        control,
        name: "qualificationDetails"
    });

    function onSubmit(values: z.infer<typeof formSchema>) {

        axios.post('/common/qualification', values)
        .then((res) => {
            // console.log(res);
            if (res.data.message === 'success') {

                toast({
                    title: "Qualification updated successfully",
                    description: "Your Qualification data has been added/updated successfully",
                    action: (
                        <ToastAction className='' onClick={() => { navigate('/common/display/qualification') }} altText="okay">Okay</ToastAction>
                    ),
                })
                form.reset()

            }
        })
        .catch((err) => {
            console.log(err);
        })

        console.log(values)
    }

    const handleExperienceClick = (event: any) => {
        append({
            degree: "",
            institute: "",
            university: "",
            stream: "",
            class: "",
            year: new Date().getFullYear(),
            status: ""
        });

        event.preventDefault()
    };

    const renderQualificationBlock = (index: number) => (
        <div key={index}>
            <Separator className='my-8 bg-red-800' />
            <div className="">

                <div className="grid md:grid-cols-2 gap-6 my-4">

                    <FormField
                        control={form.control}
                        name={`qualificationDetails.${index}.degree`}
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className='my-2'>Degree</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? degrees.find(
                                                        (degree) => degree.value === field.value
                                                    )?.label
                                                    : "Select degree"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search degree..." />
                                            <CommandList>
                                                <CommandEmpty>No degree found.</CommandEmpty>
                                                <CommandGroup>
                                                    {degrees.map((degree) => (
                                                        <CommandItem
                                                            value={degree.label}
                                                            key={degree.value}
                                                            onSelect={() => {
                                                                form.setValue(
                                                                    `qualificationDetails.${index}.degree`,
                                                                    degree.value
                                                                );
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    degree.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {degree.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`qualificationDetails.${index}.stream`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-grey-800'>Stream / Branch</FormLabel>
                                <FormControl>
                                    <Input placeholder="stream Name" autoComplete='off' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`qualificationDetails.${index}.institute`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-grey-800'>Institute</FormLabel>
                                <FormControl>
                                    <Input placeholder="institute name" autoComplete='off' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`qualificationDetails.${index}.university`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-grey-800'>University</FormLabel>
                                <FormControl>
                                    <Input placeholder="university name" autoComplete='off' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`qualificationDetails.${index}.year`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-grey-800'>Year of Passing</FormLabel>
                                <FormControl>
                                    <Input type='number' placeholder="year" autoComplete='off' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`qualificationDetails.${index}.class`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-grey-800'>Class</FormLabel>
                                <FormControl>
                                    <Input placeholder="class" autoComplete='off' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`qualificationDetails.${index}.status`}
                        render={({ field }) => (
                            <FormItem className='md:col-span-2'>
                                <FormLabel className='text-gray-800'>Experience Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="pursuing">Pursuing</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

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
                        Qualification <span className='hidden sm:inline-block'>Details</span>
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
                                    Click the Add qualification button to enter a new qualification
                                </AlertDescription>
                            </Alert>


                            <Button size={'lg'} onClick={handleExperienceClick} className='text-black hover:bg-emerald-600 bg-emerald-500'> Add Qualification </Button>

                            {fields.map((field, index) => (
                                renderQualificationBlock(index)
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

export default QualificationForm