/**
 * IMPORTS
 */
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, BookUser, CalendarIcon, FileArchive } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ToastAction } from "@/components/ui/toast";
import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type Props = {};

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
  }, 'File must be a pdf'
  )

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "research paper title is required!",
    })
    .max(300, {
      message: "research paper title must not exceed 300 characters",
    }),

  authors: z
    .string({
      invalid_type_error: "Authors Name Required!",
    })
    .transform((value) => value.split(",").map((name) => name.trim())),

  authorsAffiliation: z
    .string({
      invalid_type_error: "Authors affiliation is required!",
    })
    .transform((value) => value.split(",").map((name) => name.trim())),

  departmentInvolved: z.array(z.string()).nonempty(),

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

  nationalInternational: z.string().min(1, {
    message: "Conference type is required",
  }),

  conferenceName: z.string().min(1).max(100),
  venue: z.string().min(1).max(100),
  organizer: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  fromDate: z.date(),
  toDate: z.date(),
  paperStatus: z.string().min(1).max(100),

  publicationDate: z.union([z.date(), z.date().optional()]),
  issn: z.union([z.string().min(1).max(100), z.string().optional()]),
  impactFactor: z.union([z.coerce.number().optional(), z.coerce.number().nonnegative()]),
  pageNo: z.union([z.string().optional(), z.string().min(1).max(100)]),
  yearOfPublication: z.union([z.coerce.number().optional(), z.coerce.number().min(1800).max(2300).nonnegative()]),
  doi: z.union([z.string().optional(), z.string().min(1).max(300)]),
  indexing: z.union([z.array(z.string()).optional(), z.array(z.string()).nonempty()]),

  paperUrl: z.union([z.string().optional(), z.string().min(1).max(100)]),
  citationCount: z.union([z.coerce.number().optional(), z.coerce.number().nonnegative()]),
  paper: z.union([pdfFileSchema.optional(), pdfFileSchema]),
  certificate: z.union([pdfFileSchema.optional(), pdfFileSchema]),

}).refine((data) => data.toDate > data.fromDate, {
  message: "End date must be greater than start date",
  path: ["toDate"], // Field to which the error will be attached
})
  .superRefine((data, ctx) => {
    // Example: Making certain fields required if paperStatus is "published"
    console.log(data);

    if (data.paperStatus === "presented and published") {

      // Validate publicationDate
      if (!data.publicationDate) {
        ctx.addIssue({
          code: "custom",
          path: ["publicationDate"],
          message: "Publication date is required when paper is published",
        });
      }

      // Validate ISSN (if you want to apply additional rules here)
      if (!data.issn) {
        ctx.addIssue({
          code: "custom",
          path: ["issn"],
          message: "ISSN is required when paper is published",
        });
      }

      // Validate impactFactor
      if (!data.impactFactor) {
        ctx.addIssue({
          code: "custom",
          path: ["impactFactor"],
          message: "Impact factor is required when paper is published",
        });
      }

      // Validate pageNo
      if (!data.pageNo) {
        ctx.addIssue({
          code: "custom",
          path: ["pageNo"],
          message: "Page number is required when paper is published",
        });
      }

      // Validate yearOfPublication
      if (!data.yearOfPublication) {
        ctx.addIssue({
          code: "custom",
          path: ["yearOfPublication"],
          message: "Year of publication is required when paper is published",
        });
      }

      // Validate DOI
      if (!data.doi) {
        ctx.addIssue({
          code: "custom",
          path: ["doi"],
          message: "DOIis required when paper is published",
        });
      }

      // Validate indexing
      if (!data.indexing || data.indexing.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["indexing"],
          message: "At least one indexing option is required when paper is published",
        });
      }

      // Validate paperUrl
      if (!data.paperUrl) {
        ctx.addIssue({
          code: "custom",
          path: ["paperUrl"],
          message: "Paper URL must be entered when paper is published",
        });
      }

      // Validate citationCount
      if (!data.citationCount) {
        ctx.addIssue({
          code: "custom",
          path: ["citationCount"],
          message: "Citation count is required when paper is published",
        });
      }

      // Validate paper file
      if (!(data.paper instanceof File)) {
        ctx.addIssue({
          code: "custom",
          path: ["paper"],
          message: "Paper file is required when paper is published",
        });
      }

      // Validate certificate file
      if (!(data.certificate instanceof File)) {
        ctx.addIssue({
          code: "custom",
          path: ["certificate"],
          message: "Certificate file is required when paper is published",
        });
      }
    }
  });


const ConferenceForm: React.FC = (props: Props) => {
  const user = useSelector((state: any) => state.user);
  const { toast } = useToast();

  //constants
  const indexingOptions = [
    "Scopus",
    "Web of Science",
    "SCI",
    "UGC CARE-I",
    "UGC CARE-II",
    "others",
  ];

  const departments = [
    "Computer",
    "Information Technology",
    "Artificial Intelligence and Data Science",
    "Electronics and Telecommunication",
    "Basic Science and Humanities",
  ];

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
      authors: [],
      authorsAffiliation: [],
      facultiesInvolved: [],
      departmentInvolved: [],
      nationalInternational: "",
      conferenceName: "",
      venue: "",
      organizer: "",
      role: "",
      fromDate: new Date(),
      toDate: new Date(),
      paperStatus: "",
      publicationDate: new Date(),
      issn: "",
      impactFactor: 0,
      pageNo: "",
      yearOfPublication: 0,
      doi: "",
      indexing: [], // default empty array
      paperUrl: "",
      citationCount: 0,
      paper: undefined,
      certificate: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post("/common/conference", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.message === "success") {
          toast({
            title: "Conference added successfully",
            description:
              "Your Conference information has been added successfully",
            action: <ToastAction altText="okay">Okay</ToastAction>,
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
      {user.role === "Faculty" ? <FacultyNavbar /> : <HeadNavbar />}

      <div className="container my-8">
        <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 ">
          <span className="border-b-4 border-red-800 break-words uppercase ">
            CONFERENCE <span className="hidden sm:inline-block">PUBLICATION</span>
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
                      <span>
                        <a href="#basicDetails" onClick={() => setOpen(false)}>
                          Basic Details
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

              <div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="my-4">
                      <FormLabel className="text-gray-800">
                        Research Paper Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="research paper title"
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
                  name="authors"
                  render={({ field }) => (
                    <FormItem className=" my-4">
                      <FormLabel className="text-gray-800">Authors</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="eg: John Smith, David Fawling"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription>
                        Write mutiple names seperated by commas(,)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorsAffiliation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Authors Affiliations
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="eg: John Smith, David Fawling"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription>
                        Write mutiple names seperated by commas(,)
                      </FormDescription>
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
                                    ? field.value.filter(
                                      (val) => val !== option
                                    )
                                    : [...(field.value || []), option];
                                  field.onChange(newValue);
                                }}
                              >
                                {option=="Computer"? "Computer Engineering" : option}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Conferenec Details */}
              <h2
                id="conferenceDetails"
                className="my-5 pt-7 text-2xl font-AzoSans font-bold uppercase text-gray-500"
              >
                Conference Details
              </h2>

              <Alert className="bg-amber-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>NOTE</AlertTitle>
                <AlertDescription>
                  Please fill all the details correctly as per your knowledege.
                  Also read all instructions given under specific fields in the
                  form
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="nationalInternational"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Conference type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select conference type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="National">National</SelectItem>
                          <SelectItem value="International">
                            International
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conferenceName"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">
                        Conference Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="conference name"
                          autoComplete="off"
                          {...field}
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
                    <FormItem className="">
                      <FormLabel className="text-gray-800">Venue</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="venue"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizer"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">Organizer</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="organizer"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="presenter">Presenter</SelectItem>
                          <SelectItem value="attendee">Attendee</SelectItem>
                          <SelectItem value="speaker">Speaker</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paperStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Paper Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="presented">
                            Paper Presented
                          </SelectItem>
                          <SelectItem value="presented and published">
                            Paper Presented and Published
                          </SelectItem>
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
                  name="publicationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:col-span-2">
                      <FormLabel className="text-grey-800">
                        Publication Date
                      </FormLabel>
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
                  name="issn"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">
                        ISSN/ISBN Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="ISSN/ISBN Number"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="impactFactor"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">
                        Impact Factor
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="impactFactor"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pageNo"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">
                        Page No (From-to)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="eg: 12-44"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearOfPublication"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">
                        Year of Publication
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="eg:2003"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doi"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">
                        Digital Object Identifier
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Digital Object Identifier"
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
                  name="indexing"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">Indexing</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">
                              {field.value?.length && field.value.length > 0 ? field.value.join(", ") : "Select indexing options"}
                            </Button>

                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="">
                            <DropdownMenuLabel>
                              Indexing Options
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {indexingOptions.map((option) => (
                              <DropdownMenuCheckboxItem
                                key={option}
                                checked={field.value?.includes(option)}
                                onCheckedChange={() => {
                                  const newValue = field.value?.includes(option)
                                    ? field.value.filter(
                                      (val) => val !== option
                                    )
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

                <FormField
                  control={form.control}
                  name="paperUrl"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">
                        Full Paper Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Full Paper Link"
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
                  name="citationCount"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">
                        Citation Count
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Citation Count"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Document Upload */}
              <h2
                id="proofUpload"
                className="my-6 pt-8 text-2xl font-AzoSans font-bold uppercase text-gray-500"
              >
                Proof Upload
              </h2>
              <div>
                <Alert variant="default" className="bg-amber-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>NOTE</AlertTitle>
                  <AlertDescription>
                    Documents must be in a single pdf file of maximum size 5MB.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="paper"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Upload Paper
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
                        Upload Certificate
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
              </div>

              <Button type="submit" className="bg-red-800 hover:bg-red-700">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ConferenceForm;
