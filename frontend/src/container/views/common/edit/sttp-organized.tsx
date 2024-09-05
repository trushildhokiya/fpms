//@ts-nocheck
import FacultyNavbar from "@/components/navbar/FacultyNavbar";
import HeadNavbar from "@/components/navbar/HeadNavbar";
import { useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookUser, CalendarIcon, FileArchive } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import axios from 'axios'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { useNavigate, useParams } from "react-router-dom";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Props = {};
interface STTPOrganized {
    _id: string;
    title: string;
    type: string;
    departmentInvolved: string[];
    facultiesInvolved: string[];
    principalInvestigator: string;
    coInvestigator: string;
    coordinator: string;
    coCoordinator: string;  // Corrected typo
    organizedBy: string;
    associationWith: string;
    venue: string;
    mode: string;
    fromDate: Date;
    toDate: Date;
    totalDays: number;
    level: string;
    remarks: string;
    fundingReceived: string; // Corrected typo
    fundingAgencyType: string;
    fundingAgency: string;
    sanctionedAmount: number;
    receivedAmount: number; // Corrected typo
    fundSanctionedLetter: string;
    utilizationCertificate: string;
    banner: string;
    schedule: string;
    certificate: string;
    supportingDocuments: string;
    report: string;
    photos: string;
    videoUrl: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


/**
 * SCHEMAS
 */
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const pdfFileSchema = z
    .instanceof(File)
    .refine((file) => {
        return !file || file.size <= 5 * 1024 * 1024;
    }, `File size must be less than 5MB`)
    .refine((file) => {
        return ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a pdf");

const formSchema = z.object({
    _id: z.string().optional(),

    title: z.string().min(1, {
        message: "Title is required!"
    }).max(300, {
        message: "Title must not exceed 300 characters"
    }),
    facultiesInvolved: z
        .string({
            invalid_type_error: "Faculties Somaiya ID is required!",
        })
        .transform((value) => value.split(",").map((email) => email.trim()))
        .refine(
            (emails) =>
                emails.every((email) => z.string().email().safeParse(email).success),
            {
                message: "Each faculty email must be a valid email address",
            }
        ),

    departmentInvolved: z.array(z.string()).nonempty(),

    type: z.string().min(1, {
        message: "Type is required!",
    }),

    principalInvestigator: z
        .string()
        .min(1, {
            message: "Principal Investigator is required!",
        })
        .max(100, {
            message: "Principal Investigator must not exceed 100 characters",
        }),

    coInvestigator: z
        .string()
        .min(1, {
            message: "Co-investigator is required!",
        })
        .max(100, {
            message: "Co-investigator must not exceed 100 characters",
        }),

    coordinator: z
        .string()
        .min(1, {
            message: "Coordinator is required!",
        })
        .max(100, {
            message: "Coordinator must not exceed 100 characters",
        }),

    coCoordinator: z
        .string()
        .min(1, {
            message: "Co-coordinator is required!",
        })
        .max(100, {
            message: "Co-coordinator must not exceed 100 characters",
        }),

    organizedBy: z
        .string()
        .min(1, {
            message: "Organized by is required!",
        })
        .max(100, {
            message: "Organized by must not exceed 100 characters",
        }),

    associationWith: z
        .string()
        .min(1, {
            message: "Association with is required!",
        })
        .max(100, {
            message: "Association with must not exceed 100 characters",
        }),

    venue: z
        .string()
        .min(1, {
            message: "Venue is required!",
        })
        .max(100, {
            message: "Venue must not exceed 100 characters",
        }),

    mode: z.string().min(1, {
        message: "Mode is required!",
    }),

    fromDate: z.date(),
    toDate: z.date(),
    totalDays: z.coerce.number().nonnegative(),

    level: z.string().min(1, {
        message: "Level is required!",
    }),

    fundingReceived: z.string().min(1, {
        message: "Funding status is required!",
    }),

    fundingAgency: z
        .string()
        .min(1, {
            message: "Funding Agency is required!",
        })
        .max(100, {
            message: "Funding Agency must not exceed 100 characters",
        }),

    fundingAgencyType: z.string().min(1, {
        message: "Funding agency type is required!",
    }),

    sanctionedAmount: z.coerce.number().nonnegative(),
    receivedAmount: z.coerce.number().nonnegative(),

    remarks: z
        .string()
        .min(1, {
            message: "Remarks is required!",
        })
        .max(200, {
            message: "Remarks must not exceed 200 characters",
        }),

    videoUrl: z.string().min(1).url({
        message: "Not a valid URL",
    }),

    fundSanctionedLetter: z.union([pdfFileSchema, z.any().optional()]),
    utilizationCertificate: z.union([pdfFileSchema, z.any().optional()]),
    banner: z.union([pdfFileSchema, z.any().optional()]),
    schedule: z.union([pdfFileSchema, z.any().optional()]),
    certificate: z.union([pdfFileSchema, z.any().optional()]),
    supportingDocuments: z.union([pdfFileSchema, z.any().optional()]),
    report: z.union([pdfFileSchema, z.any().optional()]),
    photos: z.union([pdfFileSchema, z.any().optional()]),

}).refine((data) => new Date(data.toDate) > new Date(data.fromDate), {
    message: "End date must be greater than start date",
    path: ["toDate"], // Field to which the error will be attached
});

const SttpOrganizedEdit = (props: Props) => {

    const user = useSelector((state: any) => state.user);
    const { toast } = useToast()
    const { id } = useParams()
    const navigate = useNavigate()
    
    const departments = [
        "Computer",
        "Information Technology",
        "Artificial Intelligence and Data Science",
        "Electronics and Telecommunication",
        "Basic Science and Humanities",
    ];

    useEffect(() => {
        // Fetch the  data
        axios
            .get(`/common/sttp-organized/${id}`)
            .then((res) => {
                const data: STTPOrganized = res.data
                form.reset({
                    ...data,
                    fromDate: new Date(data.fromDate),
                    facultiesInvolved: data.facultiesInvolved.join(', '),
                    toDate: new Date(data.toDate),
                })
            })
            .catch((err) => {
                console.error("Error fetching  data:", err);
            });
    }, []);

    // command
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // functions
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            type: "",
            facultiesInvolved: [],
            departmentInvolved: [],
            principalInvestigator: "",
            coInvestigator: "",
            coordinator: "",
            coCoordinator: "",
            organizedBy: "",
            associationWith: "",
            venue: "",
            mode: "",
            fromDate: new Date(),
            toDate: new Date(),
            totalDays: 0,
            level: "",
            fundingReceived: "",
            fundingAgency: "",
            fundingAgencyType: "",
            sanctionedAmount: 0,
            receivedAmount: 0,
            remarks: "",
            videoUrl: "",
            fundSanctionedLetter: new File([], ""),
            utilizationCertificate: new File([], ""),
            banner: new File([], ""),
            schedule: new File([], ""),
            certificate: new File([], ""),
            supportingDocuments: new File([], ""),
            report: new File([], ""),
            photos: new File([], ""),
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        axios.put("/common/sttp-organized", values, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {

                if (res.data.message === "success") {
                    toast({
                        title: "STTP/FDP added successfully",
                        description:
                            "Your STTP/FDP information has been added successfully",
                        action: <ToastAction className='' onClick={()=>navigate('/common/display/sttp-organized')} altText="okay">Okay</ToastAction>,
                    });
                    form.reset();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            {user.role === "Faculty" ? <FacultyNavbar /> : <HeadNavbar />}
            <div className="container my-8">
                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 uppercase">
                    <span className="border-b-4 border-red-800 break-words ">
                        STTP/FDP <span className="hidden md:inline-block">Organized</span>
                    </span>
                </h1>


                {/* COMMAND DIALOG  */}
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem>
                                <BookUser className="mr-2 h-4 w-4" />
                                <span>
                                    <a href="#basicDetails" onClick={() => setOpen(false)}>
                                        Basic Details
                                    </a>
                                </span>
                            </CommandItem>
                            <CommandItem>
                                <BookUser className="mr-2 h-4 w-4" />
                                <span>
                                    <a href="#fundingDetails" onClick={() => setOpen(false)}>
                                        Funding Details
                                    </a>
                                </span>
                            </CommandItem>
                            <CommandItem>
                                <FileArchive className="mr-2 h-4 w-4" />
                                <span>
                                    <a href="#proofUpload" onClick={() => setOpen(false)}>
                                        Proof Upload
                                    </a>
                                </span>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>

                {/* FORM */}

                <div className="p-2 font-Poppins text-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* BASIC DETAILS */}
                            <h2
                                id="basicDetails"
                                className="my-5 text-2xl font-AzoSans font-bold uppercase text-gray-500"
                            >
                                Basic Details
                            </h2>

                            <Alert className="bg-sky-500">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>NOTE</AlertTitle>
                                <AlertDescription>
                                    Please fill all the details correctly as per your knowledege.
                                    Also read all instructions given under specific fields in the
                                    form
                                </AlertDescription>
                            </Alert>

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-800">
                                            STTP/FDP Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="STTP/FDP Title"
                                                {...field}
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-800">Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="sttp">STTP</SelectItem>
                                                <SelectItem value="fdp"> FDP </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="facultiesInvolved"
                                render={({ field }) => (
                                    <FormItem className="my-4">
                                        <FormLabel className="text-gray-800">
                                            Faculties Involved Somaiya Mail Address
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="eg: maxmiller@somaiya.edu, david@somaiya.edu"
                                                {...field}
                                                autoComplete="off"
                                            />
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
                                    <FormItem className="">
                                        <FormLabel className="text-gray-800">
                                            Department Involved
                                        </FormLabel>
                                        <FormControl>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full overflow-hidden"
                                                    >
                                                        {field.value?.length > 0
                                                            ? field.value.join(", ")
                                                            : "Select Involved Departments"}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="">
                                                    <DropdownMenuLabel>
                                                        Select Departments
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {departments.map((option) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={option}
                                                            checked={field.value?.includes(option)}
                                                            onCheckedChange={() => {
                                                                const newValue = field.value?.includes(option)
                                                                    ? field.value.filter((val) => val !== option)
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

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="principalInvestigator"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Principal Investigator
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="principal investigator"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coInvestigator"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Co-Investigator
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="co-investigator"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coordinator"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Coordinator
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="coordinator"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coCoordinator"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Co-Coordinator
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="co-coordinator"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="organizedBy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Organized By
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Organized By ..."
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="associationWith"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Association With
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="association with ..."
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="venue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">Venue</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="venue"
                                                    {...field}
                                                    autoComplete="off"
                                                />
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
                                            <FormLabel className="text-gray-800">Mode</FormLabel>
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
                                    name="fromDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-grey-800">From Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""
                                                            }`}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
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
                                            <FormLabel className="text-grey-800">To Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""
                                                            }`}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
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
                                    name="totalDays"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Number of Days
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="venue"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">Level</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="international">
                                                        International
                                                    </SelectItem>
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
                                    name="remarks"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel className="text-gray-800">Remarks</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="remarks (NA if not)"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator className="bg-red-800" />

                            {/* FUNDING DETAILS */}
                            <h2
                                id="fundingDetails"
                                className="my-5 text-2xl font-AzoSans font-bold uppercase text-gray-500"
                            >
                                Funding Details
                            </h2>

                            <Alert className="bg-lime-500">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>NOTE</AlertTitle>
                                <AlertDescription>
                                    Please fill all the funding details correctly as per your
                                    knowledge. Also read all instructions given under specific
                                    fields in the form.
                                </AlertDescription>
                            </Alert>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="fundingReceived"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Funding Recieved
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="yes">Yes</SelectItem>
                                                    <SelectItem value="no">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fundingAgencyType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Funding Agency Type
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="government">Government</SelectItem>
                                                    <SelectItem value="private">Private</SelectItem>
                                                    <SelectItem value="na">Not Applicable</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fundingAgency"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel className="text-gray-800">
                                                Funding Agency
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="funding Agency"
                                                    {...field}
                                                    autoComplete="off"
                                                />
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
                                            <FormLabel className="text-gray-800">
                                                Sanctioned Fund Amount
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="venue"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="receivedAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Fund Amount Recieved
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="venue"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* PROOF UPLOADS */}
                            <Separator className="bg-red-800" />
                            <h2
                                id="proofUpload"
                                className="my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500"
                            >
                                Proof Uploads
                            </h2>
                            <div>
                                <Alert variant="default" className="bg-amber-500">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>NOTE</AlertTitle>
                                    <AlertDescription>
                                        STTP/FDP uploads must be in a single pdf file of maximum
                                        size 5MB.
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="fundSanctionedLetter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Upload Fund Sanctioned Letter
                                            </FormLabel>
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
                                    name="utilizationCertificate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Upload Utilization Certificate
                                            </FormLabel>
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
                                        <FormItem className="">
                                            <FormLabel className="text-gray-800">
                                                Upload Banner
                                            </FormLabel>
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
                                    name="schedule"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">
                                                Upload Schedule of Organizer
                                            </FormLabel>
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
                                            <FormLabel className="text-gray-800">
                                                Upload Certificate / LOA
                                            </FormLabel>
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
                                        <FormItem className="">
                                            <FormLabel className="text-gray-800">
                                                Upload Supporting Documents
                                            </FormLabel>
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
                                        <FormItem className="">
                                            <FormLabel className="text-gray-800">
                                                Upload Report
                                            </FormLabel>
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
                                        <FormItem className="">
                                            <FormLabel className="text-gray-800">
                                                Upload Photos
                                            </FormLabel>
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
                                    name="videoUrl"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel className="text-gray-800">Video Url</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="video url"
                                                    {...field}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="bg-red-800 hover:bg-red-700">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
                <Toaster />
            </div>
        </>
    );
};

export default SttpOrganizedEdit;
