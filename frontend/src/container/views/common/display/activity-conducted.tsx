import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FileDown, Pencil, Table, Trash2Icon } from 'lucide-react'
import autoTable from 'jspdf-autotable'
import { ScrollPanel } from 'primereact/scrollpanel'
import jsPDF from 'jspdf'
import Logo from '@/assets/image/logo.png'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

type Props = {}

/**
 * SCHEMAS 
 */

interface ActivityConducted {
    _id: string;
    title: string;
    organizedBy: string;
    associationWith: string;
    departmentInvolved: string[];
    facultiesInvolved: string[];
    mode: string;
    level: string;
    participants: number;
    fromDate: Date;
    toDate: Date;
    venue: string;
    remarks: string;
    invitationLetter: string;
    certificate: string;
    banner: string;
    report: string;
    photos: string;
    videoLink: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const ActivityConductedDisplay = (props: Props) => {

    // constants
    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<ActivityConducted[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const dt = useRef<any>(null);

    // funcions

    // function to convert date strings to Date objects
    const convertDates = (activity_conducteds: ActivityConducted[]) => {
        return activity_conducteds.map(activity_conducted => ({
            ...activity_conducted,
            fromDate: new Date(activity_conducted.fromDate),
            toDate: new Date(activity_conducted.toDate),
        }));
    };

    // useEffect to fetch data
    useEffect(() => {
        axios.get('/common/activity-conducted').then((res) => {
            const convertedData = convertDates(res.data);
            setData(convertedData);
            setTotalRecords(convertedData.length)
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
    const idBodyTemplate = (rowData: ActivityConducted) => {
        return <Badge className='bg-amber-400 bg-opacity-55 hover:bg-amber-300 text-amber-700'>{rowData._id}</Badge>;
    };

    const remarksBodyTemplate = (rowData: ActivityConducted) => {
        return <ScrollPanel className='w-full h-36 text-sm leading-6'>{rowData.remarks}</ScrollPanel>
    }

    const toDateBodyTemplate = (rowData: ActivityConducted) => rowData.toDate.toLocaleDateString()

    const fromDateBodyTemplate = (rowData: ActivityConducted) => rowData.fromDate.toLocaleDateString()

    const invitationLetterBodyTemplate = (rowData: ActivityConducted) => {
        const invitationLetterURL = rowData.invitationLetter ? axios.defaults.baseURL + "/" + rowData.invitationLetter.split('uploads')[1] : null;
        return invitationLetterURL ? (
            <Link target='_blank' referrerPolicy='no-referrer' to={invitationLetterURL}>
                <Button variant={'link'} className='text-indigo-800'>Download</Button>
            </Link>
        ) : (
            <Button variant={'link'} className='text-gray-400' disabled>No File</Button>
        );
    };

    const certificateBodyTemplate = (rowData: ActivityConducted) => {
        const certificateURL = rowData.certificate ? axios.defaults.baseURL + "/" + rowData.certificate.split('uploads')[1] : null;
        return certificateURL ? (
            <Link target='_blank' referrerPolicy='no-referrer' to={certificateURL}>
                <Button variant={'link'} className='text-indigo-800'>Download</Button>
            </Link>
        ) : (
            <Button variant={'link'} className='text-gray-400' disabled>No File</Button>
        );
    };

    const departmentInvolvedBodyTemplate = (rowData: ActivityConducted) => {
        return rowData.departmentInvolved.map((department: string) => (
            <Badge key={department} className='bg-purple-400 hover:bg-purple-300 bg-opacity-85 text-purple-900'>{department}</Badge>
        ));
    };

    const facultyInvolvedBodyTemplate = (rowData: ActivityConducted) => rowData.facultiesInvolved.join(", ")


    const bannerBodyTemplate = (rowData: ActivityConducted) => {
        const bannerURL = rowData.banner ? axios.defaults.baseURL + "/" + rowData.banner.split('uploads')[1] : null;
        return bannerURL ? (
            <Link target='_blank' referrerPolicy='no-referrer' to={bannerURL}>
                <Button variant={'link'} className='text-indigo-800'>Download</Button>
            </Link>
        ) : (
            <Button variant={'link'} className='text-gray-400' disabled>No File</Button>
        );
    };

    const reportBodyTemplate = (rowData: ActivityConducted) => {
        const reportURL = rowData.report ? axios.defaults.baseURL + "/" + rowData.report.split('uploads')[1] : null;
        return reportURL ? (
            <Link target='_blank' referrerPolicy='no-referrer' to={reportURL}>
                <Button variant={'link'} className='text-indigo-800'>Download</Button>
            </Link>
        ) : (
            <Button variant={'link'} className='text-gray-400' disabled>No File</Button>
        );
    };

    const photosBodyTemplate = (rowData: ActivityConducted) => {
        const photosURL = rowData.photos ? axios.defaults.baseURL + "/" + rowData.photos.split('uploads')[1] : null;
        return photosURL ? (
            <Link target='_blank' referrerPolicy='no-referrer' to={photosURL}>
                <Button variant={'link'} className='text-indigo-800'>Download</Button>
            </Link>
        ) : (
            <Button variant={'link'} className='text-gray-400' disabled>No File</Button>
        );
    };


    const URLBodyTemplate = (rowData: ActivityConducted) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={rowData.videoLink}>
                <Button variant={'link'} className='text-indigo-800' >View</Button>
            </Link>
        )
    }

    const dateFilterTemplate = (options: any) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const footerTemplate = () => {
        return "Total Records Matched: " + totalRecords; // Access total records here
    };

    // download functions
    const exportCSV = (selectionOnly: boolean) => {
        dt.current.exportCSV({ selectionOnly });
    };


    const exportPdf = () => {
        // Initialize jsPDF instance
        const doc = new jsPDF('landscape', 'in', [8.3, 11.7]);

        // define columns
        interface Column {
            header: string;
            dataKey: keyof ActivityConducted;
        }

        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'title' },
            { header: 'Activity Organized By', dataKey: 'organizedBy' },
            { header: 'In Association with', dataKey: 'associationWith' },
            { header: 'Mode', dataKey: 'mode' },
            { header: 'Level', dataKey: 'level' },
            { header: 'No. of Participants', dataKey: 'participants' },
            { header: 'From Date', dataKey: 'fromDate' },
            { header: 'To Date', dataKey: 'toDate' },
            { header: 'Venue', dataKey: 'venue' },
            { header: 'Remarks', dataKey: 'remarks' },
            { header: 'Invitation Letter', dataKey: 'invitationLetter' },
            { header: 'Certificate', dataKey: 'certificate' },
            { header: 'Banner', dataKey: 'banner' },
            { header: 'Photos', dataKey: 'report' },
            { header: 'Report', dataKey: 'photos' },
            { header: 'Video Url', dataKey: 'videoLink' },
            { header: 'Created At', dataKey: 'createdAt' },
            { header: 'Updated At', dataKey: 'updatedAt' },
            { header: '__v', dataKey: '__v' },
        ];

        // Function to add footer to each page
        const addFooter = () => {
            const pageCount = doc.getNumberOfPages();

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                doc.setFont('times');
                doc.setFontSize(10);

                const line1 = `Report generated by Faculty Profile Management System © ${new Date().getFullYear()}`;
                const line2 = `Downloaded by ${user.email} , ${new Date().toLocaleDateString()} , ${new Date().toLocaleTimeString()}`;

                const textWidth1 = doc.getStringUnitWidth(line1) * doc.getFontSize() / doc.internal.scaleFactor;
                const textWidth2 = doc.getStringUnitWidth(line2) * doc.getFontSize() / doc.internal.scaleFactor;

                const centerX1 = (doc.internal.pageSize.getWidth() - textWidth1) / 2;
                const centerX2 = (doc.internal.pageSize.getWidth() - textWidth2) / 2;

                doc.text(line1, centerX1, doc.internal.pageSize.getHeight() - 0.5);
                doc.text(line2, centerX2, doc.internal.pageSize.getHeight() - 0.3);
            }
        };

        // add background logo
        const addBackgroundImage = () => {
            const imgWidth = 3;
            const imgHeight = 3;

            const centerX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
            const centerY = (doc.internal.pageSize.getHeight() - imgHeight) / 2;

            for (let i = 1; i <= doc.getNumberOfPages(); i++) {
                doc.setPage(i);
                doc.addImage(Logo, 'PNG', centerX, centerY, imgWidth, imgHeight, undefined, "FAST");
            }
        };


        const formatField = (value: any): string => {
            if (Array.isArray(value)) {
                return value.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join(', ');
            } else if (value instanceof Date) {
                return value.toLocaleDateString();
            } else if (typeof value === 'object') {
                return JSON.stringify(value);
            } else {
                return value
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
            columnStyles: columns.reduce((acc: any, _, index) => {
                acc[index] = { cellWidth: 2 };
                return acc;
            }, {}),
            horizontalPageBreak: true,
            didDrawPage: addFooter
        });

        addBackgroundImage()

        // Save the PDF
        doc.save('activity-conducted-data.pdf');
    };


    const header = (
        <div className="flex w-full justify-end gap-6 flex-wrap font-Poppins">
            <Button className='rounded-full bg-green-600' onClick={() => exportCSV(false)}>
                <Table className='w-5 h-5 mr-2' /> Excel
            </Button>
            <Button className='rounded-full bg-red-600' onClick={() => exportPdf()}>
                <FileDown className='w-5 h-5 mr-2' /> PDF
            </Button>
        </div>
    );

    const actionBodyTemplate = (rowData: ActivityConducted) => {
        return (
            <>
                <Link to={`/common/edit/activity-conducted/${rowData._id}`}>
                    <Button size={'icon'} className='rounded-full bg-teal-500 mr-2'><Pencil className='w-5 h-5' color='#fff' /></Button>
                </Link>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size={'icon'} className='rounded-full bg-red-500 mx-2'><Trash2Icon className='w-5 h-5' color='#fff' /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                entry and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(rowData)} className='bg-red-800 text-white' >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>

        );
    };

    const handleDelete = (rowData: ActivityConducted) => {
        axios.delete('/common/activity-conducted', {
            data: {
                activity_conducted_id: rowData._id
            }
        })
            .then((res) => {
                if (res.data.message === 'success') {
                    window.location.reload()
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }


    return (
        <div>
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container font-Poppins my-10">

                <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                    Activities Conducted Details
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>My Conducted Activities</CardTitle>
                            <CardDescription>Conducted Activities details of the faculty is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>
                            <DataTable exportFilename='my-activity-conducted' ref={dt} header={header} footer={footerTemplate} value={data} scrollable removableSort sortMode='multiple' paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]} onValueChange={(e) => setTotalRecords(e.length)} showGridlines size='large'>
                                <Column field="_id" style={{ minWidth: '250px' }} body={idBodyTemplate} header="ID"></Column>
                                <Column field="title" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Title' sortable header="Title"></Column>
                                <Column field="departmentInvolved" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by department' header="Departments Involved" body={departmentInvolvedBodyTemplate}></Column>
                                <Column field="facultiesInvolved" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by faculty' header="Faculties Involved" body={facultyInvolvedBodyTemplate}></Column>
                                <Column field="organizedBy" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Organized By' sortable header="Activity Organized By"></Column>
                                <Column field="associationWith" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Association with' sortable header="In Association With"></Column>
                                <Column field="mode" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Mode' sortable header="Mode"></Column>
                                <Column field="level" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Level' sortable header="Level"></Column>
                                <Column field="participants" style={{ minWidth: '250px' }} header="No. of Participants"></Column>
                                <Column field="from date" style={{ minWidth: '250px' }} dataType='date' filter filterPlaceholder='Search by From Date' filterElement={dateFilterTemplate} header="From Date" body={fromDateBodyTemplate}></Column>
                                <Column field="to date" style={{ minWidth: '250px' }} dataType='date' filter filterPlaceholder='Search by To Date' filterElement={dateFilterTemplate} header="To Date" body={toDateBodyTemplate}></Column>
                                <Column field="venue" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Venue' sortable header="Venue"></Column>
                                <Column field="remarks" style={{ minWidth: '250px' }} header="Remarks" body={remarksBodyTemplate}></Column>
                                <Column field="invitationLetter" style={{ minWidth: '250px' }} header="Invitation Letter" body={invitationLetterBodyTemplate}></Column>
                                <Column field="certificate" style={{ minWidth: '250px' }} header="Certificate" body={certificateBodyTemplate}></Column>
                                <Column field="banner" style={{ minWidth: '250px' }} header="Banner" body={bannerBodyTemplate}></Column>
                                <Column field="report" style={{ minWidth: '250px' }} header="Report" body={reportBodyTemplate}></Column>
                                <Column field="photos" style={{ minWidth: '250px' }} header="Photos" body={photosBodyTemplate}></Column>
                                <Column field="videoLink" style={{ minWidth: '200px' }} body={URLBodyTemplate} header="Video Url"></Column>
                                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} header="Actions"></Column>
                            </DataTable>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ActivityConductedDisplay