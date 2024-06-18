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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookUser, CalendarIcon, FileArchive } from "lucide-react";
import countries from "./countries";
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
  }, "File must be a pdf");

const formSchema = z
  .object({
    title: z
      .string()
      .min(2, {
        message: "Patent Title required!",
      })
      .max(100, {
        message: "Patent Title must not exceed 100 characters",
      }),

    inventors: z
      .string({
        invalid_type_error: "Inventors name is required!",
      })
      .transform((value) => value.split(",").map((name) => name.trim())),

    affiliationInventors: z
      .string({
        invalid_type_error: "Inventors affiliation is required!",
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
      message: "This field must be marked",
    }),

    country: z.string().min(1, { message: "Country is required" }),

    applicationNumber: z
      .string()
      .min(2, {
        message: "Patent Application Number required!",
      })
      .max(100, {
        message: "Patent Application Number must not exceed 100 characters",
      }),

    filingDate: z.date(),
    grantDate: z.date(),
    patentCertificate: pdfFileSchema,
  })
  .refine((data) => new Date(data.grantDate) > new Date(data.filingDate), {
    message: "End date must be greater than start date",
    path: ["endDate"], // Field to which the error will be attached
  });

const PatentForm = (props: Props) => {
  const user = useSelector((state: any) => state.user);
  const { toast } = useToast();

  //constants

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
      inventors: [""],
      affiliationInventors: [""],
      departmentInvolved: [],
      facultiesInvolved: [],
      nationalInternational: "",
      country: "",
      applicationNumber: "",
      filingDate: new Date(),
      grantDate: new Date(),
      patentCertificate: new File([], ""),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    axios
      .post("/common/patent", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.message === "success") {
          toast({
            title: "Patent updated successfully",
            description:
              "Your Patent information has been added/updated successfully",
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
    <>
      {user.role === "Faculty" ? <FacultyNavbar /> : <HeadNavbar />}
      <div className="container my-8">
        <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 ">
          <span className="border-b-4 border-red-800 break-words ">
            PATENT <span className="hidden md:inline-block">DETAILS</span>
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

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      Patent Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Title"
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
                name="inventors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Inventors</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Inventor Names"
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
                name="affiliationInventors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      Affiliation Inventors
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Affiliation Inventor Names"
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

              <FormField
                control={form.control}
                name="applicationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      Patent Application Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Patent Application Number"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="nationalInternational"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Patent Type
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
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="filingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-grey-800">
                        Filing Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
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
                  name="grantDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-grey-800">
                        Grant Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
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
              </div>

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
                    Patent Certificate must be in a single pdf file of maximum
                    size 5MB.
                  </AlertDescription>
                </Alert>
              </div>

              <FormField
                control={form.control}
                name="patentCertificate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">
                      Patent Certificate
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

export default PatentForm;
