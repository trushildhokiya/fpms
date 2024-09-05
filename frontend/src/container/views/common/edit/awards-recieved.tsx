import FacultyNavbar from "@/components/navbar/FacultyNavbar";
import HeadNavbar from "@/components/navbar/HeadNavbar";
import { useSelector } from "react-redux";
import { date, z } from "zod";
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
import { useNavigate, useParams } from 'react-router-dom'

type Props = {};

/**
 * SCHEMAS
 */

interface AwardRecieved {
  _id: string;
  title: string;
  organization: string;
  venue: string;
  type: string;
  date: Date;
  level: string;
  remarks: string;
  certificate: string;
  photos: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  title: z
    .string()
    .min(2, {
      message: "Title is required!",
    })
    .max(100, {
      message: "Title must not exceed 100 characters",
    }),

  organization: z
    .string()
    .min(2, {
      message: "Awardee Organization is required!",
    })
    .max(100, {
      message: "Awardee Organization must not exceed 100 characters",
    }),

  venue: z
    .string()
    .min(2, {
      message: "Venue is required!",
    })
    .max(100, {
      message: "Venue must not exceed 100 characters",
    }),

  type: z.string().min(1, {
    message: "Type is required",
  }),

  date: z.date(),

  level: z.string().min(1, {
    message: "Level is required!",
  }),

  remarks: z
    .string()
    .min(1, {
      message: "Remark is required!",
    })
    .max(200, {
      message: "Remark must not exceed 200 characters",
    }),

  certificate: z.union([pdfFileSchema, z.any().optional()]),
  photos: z.union([pdfFileSchema, z.any().optional()]),
  videoUrl: z.string().min(1).url({
    message: "Invalid url",
  }),
});

const AwardRecievedEditForm = (props: Props) => {
  const user = useSelector((state: any) => state.user);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { id } = useParams()
    const navigate = useNavigate()

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

  // Fetch the Award Recieved data
  useEffect(() => {
    axios
        .get(`/common/awards-recieved/${id}`)
        .then((res) => {
            const data: AwardRecieved = res.data
            form.reset({
              ...data,
              date:new Date(data.date)
            })
        })
        .catch((err) => {
            console.error("Error fetching Awards Recieved data:", err);
        });
}, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      title: "",
      venue: "",
      organization: "",
      type: "",
      date: new Date(),
      level: "",
      remarks: "",
      certificate: new File([], ""),
      photos: new File([], ""),
      videoUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.put('/common/awards-recieved', values, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  })
      .then((res) => {
          if (res.data.message === 'success') {

              toast({
                  title: "Awards Recieved updated successfully",
                  description: "Your Awards Recieved information has been updated successfully",
                  action: (
                      <ToastAction className='' onClick={() => { navigate('/common/display/awards-recieved') }} altText="okay">Okay</ToastAction>
                  ),
              })
              form.reset()
          }
      })
      .catch((err) => {
          console.error(err);
      })
  }

  return (
    <>
      {user.role === "Faculty" ? <FacultyNavbar /> : <HeadNavbar />}
      <div className="container my-8">
        <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 ">
          <span className="border-b-4 border-red-800 break-words uppercase">
            Awards / Recognition{" "}
            <span className="hidden md:inline-block">Received</span>
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

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Award Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Award Title"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
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
                          <SelectItem value="award">Award</SelectItem>
                          <SelectItem value="recognition">
                            Recognition
                          </SelectItem>
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
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800">
                        Awardee Organization
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Awardee Organization"
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:col-span-2">
                      <FormLabel className="text-grey-800">Date</FormLabel>
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
                  name="remarks"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-gray-800">Remarks</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Remarks ( NA if not )"
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
                    Documents must be in a single pdf file of maximum size 5MB.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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

                <FormField
                  control={form.control}
                  name="photos"
                  render={({ field }) => (
                    <FormItem>
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
                          placeholder="video link"
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
      </div>
      <Toaster />
    </>
  );
};

export default AwardRecievedEditForm;
