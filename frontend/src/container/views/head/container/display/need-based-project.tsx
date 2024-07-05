import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable, DataTableExpandedRows, DataTableValueArray } from 'primereact/datatable'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileDown, Info, Table } from 'lucide-react'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import { ScrollPanel } from 'primereact/scrollpanel'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Props = {}

interface Student {
    _id: string;
    name: string;
    department: string;
    contact: number;
    email: string;
}

interface StudentData {
    project_id: string;
    student_id: string;
    name: string;
    department: string;
    contact: number;
    email: string;
}

interface Project {
    _id: string;
    projectTitle: string;
    description: string;
    outcomes: string;
    departmentInvolved: string[];
    facultiesInvolved: string[];
    institutionName: string;
    institutionAddress: string;
    institutionUrl: string;
    collaborationType: string;
    facultyCoordinatorName: string;
    facultyCoordinatorDepartment: string;
    facultyCoordinatorContact: string;
    facultyCoordinatorEmail: string;
    students: Student[];
    startDate: Date;
    endDate: Date;
    sanctionedDocuments: string;
    projectReport: string;
    completionLetter: string;
    visitDocuments: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


const NeedBasedProjectDisplay = (props: Props) => {

    // constants
    const [data, setData] = useState<Project[]>([]);
    const [studentData, setStudentData] = useState<StudentData[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const dt = useRef<any>(null);
    const dt2 = useRef<any>(null);

    // funcions

    // function to convert date strings to Date objects
    const convertDates = (projects: Project[]) => {
        return projects.map(project => ({
            ...project,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate)
        }));
    };

    const handleChange = (e: any) => {

        setTotalRecords(e.length)
        manageStudentData(e)

    }

    const manageStudentData = (data: Project[]) => {

        const rows: StudentData[] = []

        data.forEach(project => {
            // Extract main project details
            const { _id, students } = project;

            // Iterate over students and create rows
            students.forEach(student => {
                const row = {
                    project_id: _id,
                    student_id: student._id,
                    name: student.name,
                    department: student.department,
                    contact: student.contact,
                    email: student.email
                };
                rows.push(row);
            });
        });

        setStudentData(rows);

    }

    // useEffect to fetch data
    useEffect(() => {
        axios.get('/head/data/need-based-project')
            .then((res) => {
                const convertedData = convertDates(res.data);
                setData(convertedData);
                setTotalRecords(convertedData.length)
                manageStudentData(convertedData)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    useEffect(() => {

        // Function to create and append a link element for the CSS file
        const addCSS = () => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://unpkg.com/primereact/resources/themes/lara-light-cyan/theme.css';
            link.id = 'dynamic-theme'; // Adding an ID for easy removal later
            document.head.appendChild(link);
        };

        // Function to remove the link element for the CSS file
        const removeCSS = () => {
            const link = document.getElementById('dynamic-theme');
            if (link) {
                document.head.removeChild(link);
            }
        };

        // Call the function to add the CSS
        addCSS();

        // Return a cleanup function to remove the CSS when the component unmounts
        return () => {
            removeCSS();
        };
    }, []);


    // template functions
    const idBodyTemplate = (rowData: Project) => {
        return <Badge className='bg-teal-400 bg-opacity-45 hover:bg-teal-300 text-teal-800'>{rowData._id}</Badge>;
    };

    const descriptionBodyTemplate = (rowData: Project) => {
        return <ScrollPanel className='w-full h-36 text-sm leading-6'>{rowData.description}</ScrollPanel>
    }

    const outcomeBodyTemplate = (rowData: Project) => {
        return <ScrollPanel className='w-full h-36 text-sm leading-6'>{rowData.outcomes}</ScrollPanel>
    }

    const departmentInvolvedBodyTemplate = (rowData: Project) => {
        return rowData.departmentInvolved.map((department: string) => (
            <Badge key={department} className='bg-fuchsia-800 bg-opacity-85 text-fuchsia-200'>{department}</Badge>
        ));
    };

    const facultyInvolvedBodyTemplate = (rowData: Project) => rowData.facultiesInvolved.join(", ")

    const urlBodyTemplate = (rowData: Project) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={rowData.institutionUrl}>
                <Button variant={'link'} className='text-indigo-800 ' >View website</Button>
            </Link>
        )
    }

    const collaborationBodyTemplate = (rowData: Project) => {
        return <Badge className='bg-orange-400 bg-opacity-45 text-orange-800 hover:bg-orange-300'>{rowData.collaborationType}</Badge>
    }

    const startDateBodyTemplate = (rowData: Project) => rowData.startDate.toLocaleDateString()

    const endDateBodyTemplate = (rowData: Project) => rowData.endDate.toLocaleDateString()


    const sanctionedBodyTemplate = (rowData: Project) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.sanctionedDocuments.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const reportBodyTemplate = (rowData: Project) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.projectReport.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const completionBodyTemplate = (rowData: Project) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.completionLetter.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const visitBodyTemplate = (rowData: Project) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.visitDocuments.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }


    const dateFilterTemplate = (options: any) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const footerTemplate = () => {
        return "Total Records Matched: " + totalRecords; // Access total records here
    };

    const projectIDBodyTemplate = (rowData: StudentData) => {
        return <Badge className='bg-orange-400 bg-opacity-45 text-orange-800 hover:bg-orange-300'>{rowData.project_id}</Badge>
    }

    const studentIDBodyTemplate = (rowData: StudentData) => {
        return <Badge className='bg-red-400 bg-opacity-45 text-red-800 hover:bg-red-300'>{rowData.student_id}</Badge>
    }

    const subIdBodyTemplate = (rowData: Project) => {
        return <Badge className='bg-red-400 bg-opacity-45 text-red-800 hover:bg-red-300'>{rowData._id}</Badge>
    }

    // download functions for main table
    const exportCSV = (selectionOnly: boolean) => {
        dt.current.exportCSV({ selectionOnly });
    };


    const exportPdf = () => {
        // Initialize jsPDF instance
        const doc = new jsPDF('landscape', 'in', [20, 50]);

        // Column definitions
        interface Column {
            header: string;
            dataKey: keyof Project;
        }

        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'projectTitle' },
            { header: 'Description', dataKey: 'description' },
            { header: 'Outcomes', dataKey: 'outcomes' },
            { header: 'Department Involved', dataKey: 'departmentInvolved' },
            { header: 'Faculties Involved', dataKey: 'facultiesInvolved' },
            { header: 'Institution Name', dataKey: 'institutionName' },
            { header: 'Institution Address', dataKey: 'institutionAddress' },
            { header: 'Institution URL', dataKey: 'institutionUrl' },
            { header: 'Collaboration Type', dataKey: 'collaborationType' },
            { header: 'Faculty Coordinator Name', dataKey: 'facultyCoordinatorName' },
            { header: 'Faculty Coordinator Department', dataKey: 'facultyCoordinatorDepartment' },
            { header: 'Faculty Coordinator Contact', dataKey: 'facultyCoordinatorContact' },
            { header: 'Faculty Coordinator Email', dataKey: 'facultyCoordinatorEmail' },
            { header: 'Students', dataKey: 'students' },
            { header: 'Start Date', dataKey: 'startDate' },
            { header: 'End Date', dataKey: 'endDate' },
            { header: 'Sanctioned Documents', dataKey: 'sanctionedDocuments' },
            { header: 'Project Report', dataKey: 'projectReport' },
            { header: 'Completion Letter', dataKey: 'completionLetter' },
            { header: 'Visit Documents', dataKey: 'visitDocuments' },
            { header: 'Created At', dataKey: 'createdAt' },
            { header: 'Updated At', dataKey: 'updatedAt' },
            { header: '__v', dataKey: '__v' },
        ];

        // Function to format complex fields as strings
        const formatField = (value: any): string => {
            if (Array.isArray(value)) {
                return value.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join(', ');
            } else if (value instanceof Date) {
                return value.toISOString();
            } else if (typeof value === 'object') {
                return JSON.stringify(value);
            } else {
                return value.toString();
            }
        };

        // Add autoTable content to the PDF
        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: data.map(row => columns.map(col => formatField(row[col.dataKey]))),
            styles: {
                overflow: 'linebreak',
                font: 'times',
                cellPadding: 0.2,
            },
            columnStyles: {
                2: { cellWidth: 10 },
                3: { cellWidth: 10 },
                14: { cellWidth: 10 },
            },
            horizontalPageBreak: true
        });

        // Save the PDF
        doc.save('need-based-projects-data.pdf');
    };


    // download functions for student table
    const exportCSV02 = (selectionOnly: boolean) => {
        dt2.current.exportCSV({ selectionOnly });
    };


    const header = (
        <div className="flex w-full justify-end gap-6 font-Poppins flex-wrap">
            <Button className='rounded-full bg-green-600' onClick={() => exportCSV(false)}>
                <Table className='w-5 h-5 mr-2' /> Download
            </Button>
            <Button className='rounded-full bg-red-600' onClick={() => exportPdf()}>
                <FileDown className='w-5 h-5 mr-2' /> Download
            </Button>
        </div>
    );

    const headerStudent = (
        <div className="flex w-full justify-end gap-6 font-Poppins flex-wrap">
            <Button className='rounded-full bg-green-600' onClick={() => exportCSV02(false)}>
                <Table className='w-5 h-5 mr-2' /> Download
            </Button>

        </div>
    );


    // expand functions

    const allowExpansion = (rowData: Project) => {
        return rowData.students.length > 0;
    }

    const rowExpansionTemplate = (data: Project) => {
        return (
            <div className="p-3">
                <h5 className='text-base text-red-800 my-5 font-semibold'>Students for {data.projectTitle}</h5>
                <DataTable removableSort value={data.students} tableStyle={{ maxWidth: '1250px', maxBlockSize: "250px" }}>
                    <Column field="_id" body={subIdBodyTemplate} header="Id" filter filterPlaceholder='search by id' sortable></Column>
                    <Column field="name" header="Name" filter filterPlaceholder='search by name' sortable></Column>
                    <Column field="department" header="Department" filter filterPlaceholder='search by department' sortable></Column>
                    <Column field="contact" header="Contact" dataType='numeric' filter filterPlaceholder='search by contact' sortable></Column>
                    <Column field="email" header="Email" filter filterPlaceholder='search by email' sortable></Column>
                </DataTable>
            </div>
        );
    };


    return (
        <div>
            <HeadNavbar />

            <div className="container font-Poppins my-10">

                <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                    Project Details
                </h1>

                <div className="my-10">


                    {/* INFO DRAWER */}

                    <Alert className='border-red-800 my-5'>
                        <Info className="h-4 w-4" />
                        <AlertTitle className='text-red-800 '>Information</AlertTitle>
                        <AlertDescription>
                            <Drawer>
                                <DrawerTrigger>To generate reportings which uses both students and project data use pivot table. Click here to see a demo</DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle className='font-Poppins tracking-wide font-semibold text-red-800'>PIVOT TABLE IN EXCEL</DrawerTitle>
                                        <DrawerDescription>Follow similar steps to generate reportings</DrawerDescription>
                                    </DrawerHeader>
                                    <div className="container">
                                        <iframe className='w-full aspect-video rounded-3xl' src="https://www.youtube-nocookie.com/embed/PKZRWOB8Mo8?si=7TSidVH9uFSBGBa6" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                    </div>
                                   
                                </DrawerContent>
                            </Drawer>
                        </AlertDescription>
                    </Alert>

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Department Projects (NB)</CardTitle>
                            <CardDescription>Need based projects details of the faculty is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable
                                expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                                rowExpansionTemplate={rowExpansionTemplate}
                                exportFilename='department-need-based-projects' ref={dt} header={header} footer={footerTemplate} value={data} scrollable removableSort sortMode='multiple'
                                paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]}
                                onValueChange={handleChange} showGridlines size='large'>
                                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                                <Column field="_id" style={{ minWidth: '250px' }} body={idBodyTemplate} header="ID"></Column>
                                <Column field="projectTitle" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by title' sortable header="Title"></Column>
                                <Column field="description" style={{ minWidth: '250px' }} body={descriptionBodyTemplate} sortable header="Description"></Column>
                                <Column field="outcomes" style={{ minWidth: '250px' }} body={outcomeBodyTemplate} sortable header="Outcomes"></Column>
                                <Column field="departmentInvolved" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by department' header="Departments Involved" body={departmentInvolvedBodyTemplate}></Column>
                                <Column field="facultiesInvolved" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by faculty' header="Faculties Involved" body={facultyInvolvedBodyTemplate}></Column>
                                <Column field="institutionName"sortable  style={{ minWidth: '250px' }} filter filterPlaceholder='Search by institution' header="Institution Name"></Column>
                                <Column field="institutionAddress" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by address' header="Institution Address"></Column>
                                <Column field="institutionUrl" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by url' body={urlBodyTemplate} header="Institution URL"></Column>
                                <Column field="collaborationType" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by type' body={collaborationBodyTemplate} header="Collaboration Type"></Column>
                                <Column field="facultyCoordinatorName" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by name' sortable header="Faculty Coordinator Name"></Column>
                                <Column field="facultyCoordinatorDepartment" align={'center'} style={{ minWidth: '250px' }} filter filterPlaceholder='Search by department' sortable header="Faculty Coordinator Department"></Column>
                                <Column field="facultyCoordinatorEmail" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by email' sortable header="Faculty Coordinator Email"></Column>
                                <Column field="facultyCoordinatorContact" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by number' dataType='numeric' sortable header="Faculty Coordinator Contact"></Column>
                                <Column field="startDate" style={{ minWidth: '250px' }} align={'center'} sortable dataType='date' filter filterPlaceholder='Search by start date' filterElement={dateFilterTemplate} header="Start Date" body={startDateBodyTemplate}></Column>
                                <Column field="endDate" style={{ minWidth: '250px' }} align={'center'} sortable dataType='date' header="End Date" filter filterPlaceholder='Search by end date' filterElement={dateFilterTemplate} body={endDateBodyTemplate}></Column>
                                <Column field="sanctionedDocuments" align={'center'} style={{ minWidth: '250px' }} header="Sanctioned Documents" body={sanctionedBodyTemplate}></Column>
                                <Column field="projectReport" align={'center'} style={{ minWidth: '250px' }} header="Project Report" body={reportBodyTemplate}></Column>
                                <Column field="completionLetter" align={'center'} style={{ minWidth: '250px' }} header="Completion Letter" body={completionBodyTemplate}></Column>
                                <Column field="visitDocuments" align={'center'} style={{ minWidth: '250px' }} header="Visit Documents" body={visitBodyTemplate}></Column>
                            </DataTable>

                        </CardContent>

                    </Card>


                    <Card className='my-10'>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Students</CardTitle>
                            <CardDescription>The students the involved for above entries are listed below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable ref={dt2} header={headerStudent} exportFilename='students-nbp' removableSort value={studentData}
                                paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]}
                                sortMode='multiple' showGridlines
                            >
                                <Column style={{ minWidth: '250px' }} body={projectIDBodyTemplate} field="project_id" header="Project ID" filter filterPlaceholder='search by id' sortable></Column>
                                <Column style={{ minWidth: '250px' }} body={studentIDBodyTemplate} field="student_id" header="Student ID" filter filterPlaceholder='search by id' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="name" header="Name" filter filterPlaceholder='search by name' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="department" header="Department" filter filterPlaceholder='search by department' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="contact" header="Contact" dataType='numeric' filter filterPlaceholder='search by contact' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="email" header="Email" filter filterPlaceholder='search by email' sortable></Column>
                            </DataTable>

                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default NeedBasedProjectDisplay