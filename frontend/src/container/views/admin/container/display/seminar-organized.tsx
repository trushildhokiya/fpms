import AdminNavbar from '@/components/navbar/AdminNavbar'
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
import { FileDown, Table, } from 'lucide-react'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import Logo from '@/assets/image/logo.png'

interface SeminarOrganized {
    _id: string;
    title: string;
    facultiesInvolved: string[];
    departmentInvolved: string[];
    type: string;
    organizedBy: string;
    associationWith: string;
    venue: string;
    mode: string;
    fromDate: Date;
    toDate: Date;
    level: string;
    facultiesCount: number;
    studentsCount: number;
    participants: number;
    fundingReceived: string;
    fundingAgency: string;
    fundingAgencyType: string;
    sanctionedAmount: number;
    receivedAmount: number;
    remarks: string;
    videoUrl: string;
    utilizationCertificate: string;
    banner: string;
    schedule: string;
    certificate: string;
    supportingDocuments: string;
    report: string;
    photos: string;
    fundSanctionedLetter: string;
    invitationLetter: string;
    speakerCertificate: string;
    organizerCertificate: string;
    organizerLOA: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


const AdminSeminarOrganizedDisplay = () => {

    // constants
    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<SeminarOrganized[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const dt = useRef<any>(null);

    // funcions

    // function to convert date strings to Date objects
    const convertDates = (seminarOrganized: SeminarOrganized[]) => {
        return seminarOrganized.map(seminar => ({
            ...seminar,
            fromDate: new Date(seminar.fromDate),
            toDate: new Date(seminar.toDate)
        }));
    };

    // useEffect to fetch data
    useEffect(() => {
        axios.get('/admin/data/seminar-organized')
            .then((res) => {
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

    const idBodyTemplate = (rowData: SeminarOrganized) => {
        return <Badge className='bg-amber-400 bg-opacity-55 hover:bg-amber-300 text-amber-700'>{rowData._id}</Badge>;
    };

    const remarksBodyTemplate = (rowData: SeminarOrganized) => {
        return (
            <span className="remarks-text">
                {rowData.remarks}
            </span>
        );
    };

    const fromDateBodyTemplate = (rowData: SeminarOrganized) => rowData.fromDate.toLocaleDateString();

    const toDateBodyTemplate = (rowData: SeminarOrganized) => rowData.toDate.toLocaleDateString();

    const uploadFundSanctionedLetterBodyTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.fundSanctionedLetter.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Fund Sanctioned Letter</Button>
            </Link>
        );
    };

    const uploadUtilizationCertificateBodyTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.utilizationCertificate.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Utilization Certificate</Button>
            </Link>
        );
    };

    const uploadBannerBodyTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.banner.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Banner</Button>
            </Link>
        );
    };

    const uploadScheduleBodyTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.schedule.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Schedule</Button>
            </Link>
        );
    };

    const uploadCertificateLOABodyTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.certificate.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Certificate LOA</Button>
            </Link>
        );
    };

    const departmentInvolvedBodyTemplate = (rowData: SeminarOrganized) => {
        return rowData.departmentInvolved.map((department: string) => (
            <Badge key={department} className='bg-purple-400 hover:bg-purple-300 bg-opacity-85 text-purple-900'>{department}</Badge>
        ));
    };

    const facultyInvolvedBodyTemplate = (rowData: SeminarOrganized) => rowData.facultiesInvolved.join(", ")


    const uploadSupportingDocumentsBodyTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.supportingDocuments.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Supporting Documents</Button>
            </Link>
        );
    };

    const uploadReportBodyTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.report.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Report</Button>
            </Link>
        );
    };

    const uploadPhotosBodyTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.photos.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Photos</Button>
            </Link>
        );
    };

    const videoUrlBodyTemplate = (rowData: SeminarOrganized) => {
        return rowData.videoUrl ? (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={rowData.videoUrl}
            >
                <Button variant='link' className='text-indigo-800'>Watch Video</Button>
            </Link>
        ) : (
            <span>No Video Available</span>
        );
    };

    const uploadInvitationLetterTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.invitationLetter.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Invitation Letter</Button>
            </Link>
        );
    };

    const uploadCertificateLOAToSpeakerTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.speakerCertificate.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Speaker Certificate LOA</Button>
            </Link>
        );
    };

    const uploadCertificateOfOrganizerTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.organizerCertificate.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Organizer Certificate</Button>
            </Link>
        );
    };

    const uploadLOAOfOrganizerTemplate = (rowData: SeminarOrganized) => {
        return (
            <Link
                target='_blank'
                referrerPolicy='no-referrer'
                to={`${axios.defaults.baseURL}/${rowData.organizerLOA.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download LOA of Organizer</Button>
            </Link>
        );
    };


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
            dataKey: keyof SeminarOrganized;
        }
        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'title' },
            { header: 'Department Involved', dataKey: 'departmentInvolved' },
            { header: 'Faculties Involved', dataKey: 'facultiesInvolved' },
            { header: 'Organized By', dataKey: 'organizedBy' },
            { header: 'Association With', dataKey: 'associationWith' },
            { header: 'Type', dataKey: 'type' },
            { header: 'Mode', dataKey: 'mode' },
            { header: 'Level', dataKey: 'level' },
            { header: 'Venue', dataKey: 'venue' },
            { header: 'From Date', dataKey: 'fromDate' },
            { header: 'To Date', dataKey: 'toDate' },
            { header: 'Remarks', dataKey: 'remarks' },
            { header: 'Funding Received', dataKey: 'fundingReceived' },
            { header: 'Funding Agency Type', dataKey: 'fundingAgencyType' },
            { header: 'Funding Agency', dataKey: 'fundingAgency' },
            { header: 'Sanctioned Amount', dataKey: 'sanctionedAmount' },
            { header: 'Received Amount', dataKey: 'receivedAmount' },
            { header: 'Utilization Certificate', dataKey: 'utilizationCertificate' },
            { header: 'Banner', dataKey: 'banner' },
            { header: 'Schedule', dataKey: 'schedule' },
            { header: 'Certificate LOA', dataKey: 'certificate' },
            { header: 'Supporting Documents', dataKey: 'supportingDocuments' },
            { header: 'Report', dataKey: 'report' },
            { header: 'Photos', dataKey: 'photos' },
            { header: 'Fund Sanctioned Letter', dataKey: 'fundSanctionedLetter' },
            { header: 'Invitation Letter', dataKey: 'invitationLetter' },
            { header: 'Speaker Certificate LOA', dataKey: 'speakerCertificate' },
            { header: 'Organizer Certificate', dataKey: 'organizerCertificate' },
            { header: 'Organizer LOA', dataKey: 'organizerLOA' },
            { header: 'Video URL', dataKey: 'videoUrl' },
            { header: 'Created At', dataKey: 'createdAt' },
            { header: 'Updated At', dataKey: 'updatedAt' },
            { header: 'Version', dataKey: '__v' },
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
            columnStyles: columns.reduce((acc: any, _, index) => {
                acc[index] = { cellWidth: 2 };
                return acc;
            }, {}),
            horizontalPageBreak: true,
            didDrawPage: addFooter
        });

        addBackgroundImage()
        // Save the PDF
        doc.save('seminar-organized.pdf');
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


    return (
        <div>
            <AdminNavbar />

            <div className="container font-Poppins my-10">

                <h1 className="font-AzoSans font-bold text-3xl tracking-wide my-6 text-red-800 uppercase">
                    <span className="border-b-4 border-red-800 break-words ">
                        SEMINAR / Webinar  / Expert Talk / Workshop <span className="hidden md:inline-block">Organized</span>
                    </span>
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Institution Seminar Organized</CardTitle>
                            <CardDescription>Details of Seminar / Webinar  / Expert Talk / Workshop Organized of all the faculties is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable
                                exportFilename='my-seminar-organized'
                                ref={dt}
                                header={header}
                                footer={footerTemplate}
                                value={data}
                                scrollable
                                removableSort
                                sortMode='multiple'
                                paginator
                                rows={5}
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                onValueChange={(e) => setTotalRecords(e.length)}
                                showGridlines
                                size='large'
                            >
                                <Column field="_id" body={idBodyTemplate} header="ID" filter filterPlaceholder='Search by ID' sortable></Column>
                                <Column field="title" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Title' sortable header="Title"></Column>
                                <Column field="departmentInvolved" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by department' header="Departments Involved" body={departmentInvolvedBodyTemplate}></Column>
                                <Column field="facultiesInvolved" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by faculty' header="Faculties Involved" body={facultyInvolvedBodyTemplate}></Column>
                                <Column field="organizedBy" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Organizer' sortable header="Organized By"></Column>
                                <Column field="associationWith" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Association' sortable header="Association With"></Column>
                                <Column field="type" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Type' sortable header="Type"></Column>
                                <Column field="mode" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Mode' sortable header="Mode"></Column>
                                <Column field="level" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Level' sortable header="Level"></Column>
                                <Column field="venue" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Venue' sortable header="Venue"></Column>
                                <Column field="remarks" style={{ minWidth: '250px' }} header="Remarks" body={remarksBodyTemplate}></Column>
                                <Column field="fromDate" style={{ minWidth: '250px' }} sortable dataType='date' filter filterPlaceholder='Search by Start Date' filterElement={dateFilterTemplate} header="From Date" body={fromDateBodyTemplate}></Column>
                                <Column field="toDate" style={{ minWidth: '250px' }} sortable dataType='date' filter filterPlaceholder='Search by End Date' filterElement={dateFilterTemplate} header="To Date" body={toDateBodyTemplate}></Column>
                                <Column field="facultiesCount" style={{ minWidth: '150px' }} sortable header="Faculties Count"></Column>
                                <Column field="studentsCount" style={{ minWidth: '150px' }} sortable header="Students Count"></Column>
                                <Column field="participants" style={{ minWidth: '150px' }} sortable header="Participants"></Column>
                                <Column field="fundingReceived" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Funding Received' sortable header="Funding Received"></Column>
                                <Column field="fundingAgencyType" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Funding Agency Type' sortable header="Funding Agency Type"></Column>
                                <Column field="fundingAgency" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Funding Agency' sortable header="Funding Agency"></Column>
                                <Column field="sanctionedAmount" style={{ minWidth: '150px' }} sortable header="Sanctioned Amount"></Column>
                                <Column field="receivedAmount" style={{ minWidth: '150px' }} sortable header="Received Amount"></Column>
                                <Column field="utilizationCertificate" style={{ minWidth: '250px' }} header="Utilization Certificate" body={uploadUtilizationCertificateBodyTemplate}></Column>
                                <Column field="banner" style={{ minWidth: '250px' }} header="Banner" body={uploadBannerBodyTemplate}></Column>
                                <Column field="schedule" style={{ minWidth: '250px' }} header="Schedule" body={uploadScheduleBodyTemplate}></Column>
                                <Column field="certificate" style={{ minWidth: '250px' }} header="Certificate LOA" body={uploadCertificateLOABodyTemplate}></Column>
                                <Column field="supportingDocuments" style={{ minWidth: '250px' }} header="Supporting Documents" body={uploadSupportingDocumentsBodyTemplate}></Column>
                                <Column field="report" style={{ minWidth: '250px' }} header="Report" body={uploadReportBodyTemplate}></Column>
                                <Column field="photos" style={{ minWidth: '250px' }} header="Photos" body={uploadPhotosBodyTemplate}></Column>
                                <Column field="fundSanctionedLetter" style={{ minWidth: '250px' }} header="Fund Sanctioned Letter" body={uploadFundSanctionedLetterBodyTemplate}></Column>
                                <Column field="invitationLetter" style={{ minWidth: '250px' }} header="Invitation Letter" body={uploadInvitationLetterTemplate}></Column>
                                <Column field="speakerCertificate" style={{ minWidth: '250px' }} header="Speaker Certificate" body={uploadCertificateLOAToSpeakerTemplate}></Column>
                                <Column field="organizerCertificate" style={{ minWidth: '250px' }} header="Organizer Certificate" body={uploadCertificateOfOrganizerTemplate}></Column>
                                <Column field="organizerLOA" style={{ minWidth: '250px' }} header="Organizer LOA" body={uploadLOAOfOrganizerTemplate}></Column>
                                <Column field="videoUrl" style={{ minWidth: '250px' }} header="Video URL" body={videoUrlBodyTemplate}></Column>

                            </DataTable>


                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default AdminSeminarOrganizedDisplay