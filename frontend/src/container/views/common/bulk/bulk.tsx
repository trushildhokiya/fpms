import * as React from "react";
import FacultyNavbar from "@/components/navbar/FacultyNavbar";
import HeadNavbar from "@/components/navbar/HeadNavbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from 'react-redux';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DrawerTrigger, DrawerContent, Drawer, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useMediaQuery } from "react-responsive"
import { useState } from "react";
import { Download, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Dropzone, FileMosaic, ExtFile } from "@files-ui/react";
import jsonFile from 'jsonfile'

type Form = {
    value: string;
    label: string;
}

const forms: Form[] = [
    {
        value: "journal",
        label: "Journal",
    },
    {
        value: "conference",
        label: "Conference",
    },
    {
        value: "book",
        label: "Books",
    },
    {
        value: "book-chapter",
        label: "Book Chapter",
    },
    {
        value: "patent",
        label: "Patents",
    },
    {
        value: "copyright",
        label: "Copyrights",
    },
    {
        value: "award-honors",
        label: "Awards Honors",
    },
    {
        value: "consultancy",
        label: "Consultancy",
    },
    {
        value: "projects",
        label: "Project (Major/Minor)",
    },
    {
        value: "need-based-project",
        label: "Need Based Projects",
    },
]

export function ComboBoxResponsive(props: any) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery({
        query: "(min-width: 768px)"
    });

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="md:w-[50%] w-full">
                        {props.selectedStatus ? <>{props.selectedStatus.label}</> : <>Select form type</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <StatusList setOpen={setOpen} setSelectedStatus={props.setSelectedStatus} />
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTitle className="hidden">Hello</DrawerTitle>
            <DrawerDescription className="hidden">Command</DrawerDescription>
            <DrawerTrigger asChild>
                <Button variant="outline" className="md:w-[50%] w-full">
                    {props.selectedStatus ? <>{props.selectedStatus.label}</> : <>Select form type</>}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <StatusList setOpen={setOpen} setSelectedStatus={props.setSelectedStatus} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function StatusList({
    setOpen,
    setSelectedStatus,
}: {
    setOpen: (open: boolean) => void
    setSelectedStatus: (status: Form | null) => void
}) {
    return (
        <Command>
            <CommandInput placeholder="Filter forms..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {forms.map((form) => (
                        <CommandItem
                            key={form.value}
                            value={form.value}
                            onSelect={(value) => {
                                setSelectedStatus(
                                    forms.find((priority) => priority.value === value) || null
                                )
                                setOpen(false)
                            }}
                            disabled={form.value === "projects" || form.value==="need-based-project" || form.value==="consultancy"}
                        >
                            {form.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}

const BulkUpload = () => {
    // Constants
    const user = useSelector((state: any) => state.user);
    const [selectedStatus, setSelectedStatus] = useState<Form | null>(null);
    const [files, setFiles] = React.useState<ExtFile[]>([]);

    const updateFiles = (incommingFiles: ExtFile[]) => {

        setFiles(incommingFiles);
    };

    const removeFile = (id: string | number | undefined) => {
        setFiles(files.filter((x: ExtFile) => x.id !== id));
    };

    const handleUpload = async () => {

        if (files.length == 0) {
            console.error("No files found")
            return
        }

        if(files[0].type!='application/json'){
            console.error("Invalid file type found")
            return
        }

        if(!selectedStatus){
            console.error("No form type entered")
            return
        }

        let data = await files[0].file!.text()
        data = JSON.parse(data)
        console.log(data);
        

    };




    const handleDownload = () => {
        if (selectedStatus) {
            // Example: Replace with your actual file path in the public folder
            const filePath = `/src/utils/data/${selectedStatus.value}.json`;

            // Create a link element
            const link = document.createElement('a');
            link.href = filePath;
            link.setAttribute('download', `${selectedStatus.value}.json`);

            // Append the link to the body
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up: Remove the link from the body
            document.body.removeChild(link);
        } else {
            console.log("No form type selected.");
        }

    }

    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container font-Poppins my-10">
                <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                    Bulk Upload
                </h1>

                <Card className='my-10'>
                    <CardHeader>
                        <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Download JSON</CardTitle>
                        <CardDescription>Download sample JSON for bulk upload, edit, and upload again.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="w-full">
                                <ComboBoxResponsive setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus} />
                            </div>
                            <div className="flex justify-end w-full">
                                <Button className=" md:w-[50%] w-full bg-red-800" size={"lg"} onClick={handleDownload}><Download className="mr-2 w-6 h-6" />Download</Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link to='https://jsoneditoronline.org/' referrerPolicy="no-referrer" target="_blank">
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500 animate-pulse" />
                                <AlertTitle>Support</AlertTitle>
                                <AlertDescription className="text-sm leading-6 font-Poppins text-gray-700 my-3">
                                    To edit the json files you can use any json editor.We suggest using json editor online for ease of editing and provides different views of data and dimple interface.Click here to open json editor online
                                </AlertDescription>
                            </Alert>
                        </Link>
                    </CardFooter>
                </Card>

                <div className="my-10 w-full ">
                    <Dropzone
                        onChange={updateFiles}
                        value={files}
                        className="font-Poppins text-sm"
                        color="#910904"
                        accept="application/json"
                        maxFileSize={5 * 1024 * 1024} // 5MB
                        maxFiles={1}
                        actionButtons={{
                            position: "after",
                            cleanButton: { style: { backgroundColor: "#ff8175" } },
                            uploadButton: { style: { textTransform: "uppercase", backgroundColor: "#32a852" }, onClick: handleUpload, label: "Submit" },
                        }}
                        footerConfig={{ customMessage: "Only JSON files upto 5MB are allowed" }}
                        label={"📃 Drop Files here"}
                        behaviour="replace"
                    >
                        {files.map((file: ExtFile) => (
                            <FileMosaic key={file.id} {...file} onDelete={removeFile} info preview smartImgFit='orientation' />
                        ))}
                    </Dropzone>
                </div>

            </div>
        </div>
    );
}

export default BulkUpload;
