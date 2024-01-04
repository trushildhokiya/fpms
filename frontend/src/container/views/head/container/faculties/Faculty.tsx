import HeadNavbar from "@/components/navbar/HeadNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, BadgeX } from "lucide-react"
import axios from "axios";
import { getDecodedToken } from "@/utils/functions/authFunctions";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"

const FormSchema = z.object({
    isCoordinator: z.boolean().default(false).optional(),
})

const Faculty = () => {

    interface facultyInterface {

        profileImage: string,
        email: string,
        department: string,
        tags: string[],
        verified: boolean

    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            isCoordinator: false,
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>, option:any) {
        console.log(option);
        
        console.log(data);
        
    }


    const [data, setData] = useState<facultyInterface[]>([])
    const { email } = getDecodedToken()
    const { toast } = useToast()

    useEffect(() => {

        getFacultiesList()

    }, [])

    const getFacultiesList: Function = () => {

        axios.get('/head/faculties', {
            headers: {
                'token': localStorage.getItem('token'),
                'email': email
            }
        })
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {

                toast({
                    title: 'Something went wrong!',
                    description: err.response.data.message,
                    variant: 'destructive',
                    action: <ToastAction altText="Okay">Okay</ToastAction>,
                })
            })
    }

    const dt = useRef<any>(null)

    const profileImageTemplate = (option: any) => {
        return (
            <>
                <Avatar>
                    <AvatarImage src={option.profileImage} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </>
        )
    }

    const tagsTemplate = (option: any) => {
        return (
            <>
                {
                    option.tags.map((item: string, index: number) => {
                        return (
                            <div className="my-1 " key={index}>
                                <Badge className={`${item === 'active' || item === 'complete profile' ? 'bg-emerald-500' : 'bg-rose-500'}`}> {item} </Badge>
                            </div>
                        )
                    })
                }
            </>
        )
    }

    const verifiedTemplate = (option: any) => {
        return (
            <>
                {option.verified ? <BadgeCheck color="#00a303" /> : <BadgeX color="#c80404" />}
            </>
        )
    }

    const approvalTemplate = (option: any) => {

        return (
            <>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='outline' className="border-red-800 text-red-800">Toggle</Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>

                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                By continuing this action. You categorize the requester as the faculty of you department and toggle the account activation for the requester.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <Form {...form}>
                            <form onSubmit={(e) => form.handleSubmit((data) => onSubmit(data, option))(e)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="isCoordinator"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Is the faculty a Research Coordinator
                                                </FormLabel>
                                                <FormDescription>
                                                    Select the checkbox if the faculty is the research coordinator of your department
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end">
                                    <AlertDialogCancel className="mx-2">Cancel</AlertDialogCancel>
                                    <Button type="submit" className="mx-2 bg-red-800">Submit</Button>
                                </div>
                            </form>

                        </Form>

                    </AlertDialogContent>
                </AlertDialog>

            </>
        )
    }


    const exportCSV = (selectionOnly: boolean) => {
        dt.current.exportCSV({ selectionOnly });
    };


    return (
        <div>
            <HeadNavbar />
            <div className="container">

                <Card className="my-10">
                    {
                        data.length > 0
                            ?
                            <>

                                <CardHeader>
                                    <CardTitle className="font-AzoSans text-2xl md:text-4xl text-red-800 uppercase">
                                        Faculty List
                                    </CardTitle>
                                    <CardDescription className="flex justify-end mx-4">
                                        <Button className="bg-red-800" onClick={() => exportCSV(false)} > Download </Button>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="my-2">
                                    <DataTable ref={dt} value={data} size="large" paginator rows={5} filterDisplay="row" >
                                        <Column field="profileImage" header="Image" body={profileImageTemplate}></Column>
                                        <Column field="email" header="Email" filter filterPlaceholder="Seach By Email"></Column>
                                        <Column field="department" header="Department"></Column>
                                        <Column field="tags" header="Tags" body={tagsTemplate} filter filterPlaceholder="Select tags"></Column>
                                        <Column field="verified" header="Verified" body={verifiedTemplate} filter filterPlaceholder="Filter by verification (T/F)" dataType="boolean"></Column>
                                        <Column field='approval' header='Toggle Approval' body={approvalTemplate}></Column>
                                    </DataTable>
                                </CardContent>

                            </>
                            :
                            <CardHeader>
                                <CardTitle className="font-AzoSans text-2xl md:text-4xl text-red-800 uppercase">
                                    Faculty List
                                </CardTitle>
                                <CardContent className="text-2xl font-OpenSans font-bold text-gray-600">
                                    <p className="my-10">
                                        No Records Found
                                    </p>
                                </CardContent>
                            </CardHeader>
                    }
                </Card>

            </div>
            <Toaster />
        </div>
    )
}

export default Faculty