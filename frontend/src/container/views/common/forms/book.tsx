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
import { AlertCircle, BookUser, FileArchive, Receipt } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ToastAction } from "@/components/ui/toast";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {};

/**
 * SCHEMAS
 */
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const pdfFileSchema = z
  .instanceof(File)
  .refine((file) => {
    return !file || file.size <= 5 * 1024 * 1024;
  }, `File Size must be less than 50 mb`)
  .refine((file) => {
    return ACCEPTED_FILE_TYPES.includes(file.type);
  }, `File Type must be of pdf`);

const formSchema = z.object({
  bookTitle: z
    .string()
    .min(1, {
      message: "Book Title is required!",
    })
    .max(100, {
      message: "Book Title must not exceed 100 characters",
    }),

  authors: z
    .string({
      invalid_type_error: "Authors name is required!",
    })
    .transform((value) => value.split(",").map((name) => name.trim())),

  authorsAffiliation: z
    .string({
      invalid_type_error: "authors affiliations is required!",
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

  publisherName: z
    .string()
    .min(2, {
      message: "Publisher Title required!",
    })
    .max(100, {
      message: "Publisher Title must not exceed 100 characters",
    }),

  nationalInternational: z.string().min(1, {
    message: "Publisher type required!",
  }),

  issn: z
    .string()
    .min(1, {
      message: "ISSN / ISBN Number Required",
    })
    .max(100, {
      message: "ISSN / ISBN Number exceed!",
    }),

  impactFactor: z.coerce.number().nonnegative(),

  yearOfPublication: z.coerce.number().min(1900).max(2300),

  doi: z
    .string()
    .min(2, {
      message: "Digital Object Identifier required!",
    })
    .max(100, {
      message: "Digital Object Identifier must not exceed 100 characters",
    }),

  intendedAudience: z
    .string()
    .min(1, {
      message: "Intended audience is Required!",
    })
    .max(100, {
      message: "Field count exceeded",
    }),

  description: z.string().min(1).max(1000),

  indexing: z.array(z.string()).nonempty(),

  bookUrl: z
    .string()
    .min(10, {
      message: "Paper Link Required!",
    })
    .max(500, {
      message: "Paper Link exceeded",
    })
    .regex(new RegExp(/^(ftp|http|https):\/\/[^ "]+$/), {
      message: "Invalid url",
    }),

  citationCount: z.coerce.number().nonnegative().optional(),

  proof: pdfFileSchema,
});

const BookForm: React.FC = (props: Props) => {
  const user = useSelector((state: any) => state.user);
  const { toast } = useToast();

  //constants
  const indexingOptions = [
    "Scopus",
    "Web of Science",
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
      bookTitle: "",
      publisherName: "",
      authors: [""],
      authorsAffiliation: [""],
      facultiesInvolved: [],
      departmentInvolved: [],
      nationalInternational: "",
      issn: "",
      impactFactor: 0,
      yearOfPublication: new Date().getFullYear(),
      doi: "",
      intendedAudience: "",
      description: "",
      indexing: [],
      bookUrl: "",
      citationCount: 0,
      proof: new File([], ""),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    axios
      .post("/common/book", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.message === "success") {
          toast({
            title: "Book updated successfully",
            description:
              "Your Book information has been added/updated successfully",
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
          <span className="border-b-4 border-red-800 break-words ">
            BOOK <span className="hidden sm:inline-block">PUBLICATIONS</span>
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
                      <Receipt className="mr-2 h-4 w-4" />
                      <span>
                        <a href="#bookDetails" onClick={() => setOpen(false)}>
                          Book Publication Details
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
                  name="bookTitle"
                  render={({ field }) => (
                    <FormItem className="my-4">
                      <FormLabel className="text-gray-800">
                        Book Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Book title"
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
                    <FormItem>
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
              </div>

              {/* BASIC DETAILS */}
              <Separator className="bg-red-800 mt-6" />
              <h2
                id="bookDetails"
                className="my-5  text-2xl font-AzoSans font-bold uppercase text-gray-500"
              >
                Book Publication Details
              </h2>

              <Alert className="bg-emerald-500">
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
                  name="publisherName"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">
                        Publisher Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Publisher title"
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
                  name="nationalInternational"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Journel Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="national">National</SelectItem>
                          <SelectItem value="international">
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
                  name="issn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        ISSN / ISBN Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="ISSN / ISBN Number"
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
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Impact Factor
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Impact Factor"
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
                  name="intendedAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Intended Audience
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience  type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="engineering students">
                            Engineering Students
                          </SelectItem>
                          <SelectItem value="researchers">
                            Researchers
                          </SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
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
                              {field.value?.length > 0
                                ? field.value.join(", ")
                                : "Select indexing options"}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-gray-800">
                        Description{" "}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="description must not exceed 1000 characters"
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
                  name="bookUrl"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-gray-800">Book Link</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Book Link"
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

              <Separator className="my-5 bg-red-800" />

              {/* Document Upload */}
              <h2
                id="proofUpload"
                className="my-6 text-2xl font-AzoSans font-bold uppercase text-gray-500"
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

              <div className="grid md:grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="proof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Upload Proof
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

export default BookForm;
