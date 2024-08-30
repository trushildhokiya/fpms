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
import jsPDF from 'jspdf'
import Logo from '@/assets/image/logo.png'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'


type Props = {}

interface STTPOrganized {
    _id: string;
    title: string;
    type: string;
    principalInvestigator: string;
    coInvestigator: string;
    coordinator: string;
    coCoordintor: string;
    organizedBy: string;
    associationWith: string;
    venue: string;
    mode: string;
    fromDate: Date;
    toDate: Date;
    totalDays: number;
    level: string;
    remarks: string;
    fundingRecieved: string;
    fundingAgencyType: string;
    fundingAgency: string;
    sanctionedAmount: number;
    recievedAmount: number;
    uploadFundSanctionedLetter: string;
    uploadUtilizationCertificate: string;
    uploadBanner: string;
    uploadScheduleOfOrganizer: string;
    uploadCertificateLOA: string;
    uploadSupportingDocuments: string;
    uploadReport: string;
    uploadPhotos: string;
    videoUrl: string;
    __v: number;
}


const SttpOrganizedHeadDisplay = (props: Props) => {

    // constants
    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<STTPOrganized[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const dt = useRef<any>(null);

    // funcions

    // function to convert date strings to Date objects
    const convertDates = (sttpOrganized: STTPOrganized[]) => {
        return sttpOrganized.map(sttp => ({
            ...sttp,
            fromDate: new Date(sttp.fromDate),
            toDate: new Date(sttp.toDate)
        }));
    };

    // useEffect to fetch data
    useEffect(() => {
        axios.get('/head/data/sttp-organized')
            .then((res) => {
                const convertedData = convertDates(res.data);
                setData(convertedData);
                setTotalRecords(convertedData.length)
                console.log(convertedData);
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

    const idBodyTemplate = (rowData: STTPOrganized) => {
        return <Badge className='bg-amber-400 bg-opacity-55 hover:bg-amber-300 text-amber-700'>{rowData._id}</Badge>;
    };

    const remarksBodyTemplate = (rowData: STTPOrganized) => {
        return (
            <span className="remarks-text">
                {rowData.remarks}
            </span>
        );
    };    
    
    const fromDateBodyTemplate = (rowData: STTPOrganized) => rowData.fromDate.toLocaleDateString();
    
    const toDateBodyTemplate = (rowData: STTPOrganized) => rowData.toDate.toLocaleDateString();
    
    const uploadFundSanctionedLetterBodyTemplate = (rowData: STTPOrganized) => {
        return (
            <Link 
                target='_blank' 
                referrerPolicy='no-referrer' 
                to={`${axios.defaults.baseURL}/${rowData.uploadFundSanctionedLetter.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Fund Sanctioned Letter</Button>
            </Link>
        );
    };
    
    const uploadUtilizationCertificateBodyTemplate = (rowData: STTPOrganized) => {
        return (
            <Link 
                target='_blank' 
                referrerPolicy='no-referrer' 
                to={`${axios.defaults.baseURL}/${rowData.uploadUtilizationCertificate.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Utilization Certificate</Button>
            </Link>
        );
    };
    
    const uploadBannerBodyTemplate = (rowData: STTPOrganized) => {
        return (
            <Link 
                target='_blank' 
                referrerPolicy='no-referrer' 
                to={`${axios.defaults.baseURL}/${rowData.uploadBanner.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Banner</Button>
            </Link>
        );
    };
    
    const uploadScheduleBodyTemplate = (rowData: STTPOrganized) => {
        return (
            <Link 
                target='_blank' 
                referrerPolicy='no-referrer' 
                to={`${axios.defaults.baseURL}/${rowData.uploadScheduleOfOrganizer.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Schedule</Button>
            </Link>
        );
    };
    
    const uploadCertificateLOABodyTemplate = (rowData: STTPOrganized) => {
        return (
            <Link 
                target='_blank' 
                referrerPolicy='no-referrer' 
                to={`${axios.defaults.baseURL}/${rowData.uploadCertificateLOA.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Certificate LOA</Button>
            </Link>
        );
    };
    
    const uploadSupportingDocumentsBodyTemplate = (rowData: STTPOrganized) => {
        return (
            <Link 
                target='_blank' 
                referrerPolicy='no-referrer' 
                to={`${axios.defaults.baseURL}/${rowData.uploadSupportingDocuments.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Supporting Documents</Button>
            </Link>
        );
    };
    
    const uploadReportBodyTemplate = (rowData: STTPOrganized) => {
        return (
            <Link 
                target='_blank' 
                referrerPolicy='no-referrer' 
                to={`${axios.defaults.baseURL}/${rowData.uploadReport.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Report</Button>
            </Link>
        );
    };
    
    const uploadPhotosBodyTemplate = (rowData: STTPOrganized) => {
        return (
            <Link 
                target='_blank' 
                referrerPolicy='no-referrer' 
                to={`${axios.defaults.baseURL}/${rowData.uploadPhotos.split('uploads')[1]}`}
            >
                <Button variant='link' className='text-indigo-800'>Download Photos</Button>
            </Link>
        );
    };
    
    const videoUrlBodyTemplate = (rowData: STTPOrganized) => {
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
            dataKey: keyof STTPOrganized;
        }

        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'title' },
            { header: 'Organized By', dataKey: 'organizedBy' },
            { header: 'Association With', dataKey: 'associationWith' },
            { header: 'Coordinator', dataKey: 'coordinator' },
            { header: 'Co-Coordinator', dataKey: 'coCoordintor' },
            { header: 'Type', dataKey: 'type' },
            { header: 'Mode', dataKey: 'mode' },
            { header: 'Level', dataKey: 'level' },
            { header: 'Venue', dataKey: 'venue' },
            { header: 'From Date', dataKey: 'fromDate' },
            { header: 'To Date', dataKey: 'toDate' },
            { header: 'Total Days', dataKey: 'totalDays' },
            { header: 'Remarks', dataKey: 'remarks' },
            { header: 'Funding Received', dataKey: 'fundingRecieved' },
            { header: 'Funding Agency Type', dataKey: 'fundingAgencyType' },
            { header: 'Funding Agency', dataKey: 'fundingAgency' },
            { header: 'Sanctioned Amount', dataKey: 'sanctionedAmount' },
            { header: 'Received Amount', dataKey: 'recievedAmount' },
            { header: 'Upload Fund Sanctioned Letter', dataKey: 'uploadFundSanctionedLetter' },
            { header: 'Upload Utilization Certificate', dataKey: 'uploadUtilizationCertificate' },
            { header: 'Upload Banner', dataKey: 'uploadBanner' },
            { header: 'Upload Schedule of Organizer', dataKey: 'uploadScheduleOfOrganizer' },
            { header: 'Upload Certificate LOA', dataKey: 'uploadCertificateLOA' },
            { header: 'Upload Supporting Documents', dataKey: 'uploadSupportingDocuments' },
            { header: 'Upload Report', dataKey: 'uploadReport' },
            { header: 'Upload Photos', dataKey: 'uploadPhotos' },
            { header: 'Video URL', dataKey: 'videoUrl' },
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
        doc.save('copyright_data.pdf');
    };


    const header = (
        <div className="flex w-full justify-end gap-6 flex-wrap font-Poppins">
            <Button className='rounded-full bg-green-600' onClick={() => exportCSV(false)}>
                <Table className='w-5 h-5 mr-2' /> Download
            </Button>
            <Button className='rounded-full bg-red-600' onClick={() => exportPdf()}>
                <FileDown className='w-5 h-5 mr-2' /> Download
            </Button>
        </div>
    );

    const actionBodyTemplate = (rowData: STTPOrganized) => {
        return (
            <>
                <Link to={`/common/edit/sttp-organized/${rowData._id}`}>
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

    const handleDelete = (rowData: STTPOrganized) => {
        axios.delete('/common/sttp-organized', {
            data: {
                sttpOrg_id: rowData._id
            }
        })
            .then((res) => {
                console.log(res);
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
                    STTP/FDP Details
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>STTP/FDP organized</CardTitle>
                            <CardDescription>STTP/FDP organized details of the faculty is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                        <DataTable 
                            exportFilename='my-sttp-organized' 
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
                            <Column field="organizedBy" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Organizer' sortable header="Organized By"></Column>
                            <Column field="associationWith" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Association' sortable header="Association With"></Column>
                            <Column field="coordinator" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Coordinator' sortable header="Coordinator"></Column>
                            <Column field="coCoordintor" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Co-Coordinator' sortable header="Co-Coordinator"></Column>
                            <Column field="type" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Type' sortable header="Type"></Column>
                            <Column field="mode" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Mode' sortable header="Mode"></Column>
                            <Column field="level" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Level' sortable header="Level"></Column>
                            <Column field="venue" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Venue' sortable header="Venue"></Column>
                            <Column field="fromDate" style={{ minWidth: '250px' }} sortable dataType='date' filter filterPlaceholder='Search by Start Date' filterElement={dateFilterTemplate} header="From Date" body={fromDateBodyTemplate}></Column>
                            <Column field="toDate" style={{ minWidth: '250px' }} sortable dataType='date' filter filterPlaceholder='Search by End Date' filterElement={dateFilterTemplate} header="To Date" body={toDateBodyTemplate}></Column>
                            <Column field="totalDays" style={{ minWidth: '150px' }} sortable header="Total Days"></Column>
                            <Column field="remarks" style={{ minWidth: '250px' }} header="Remarks" body={remarksBodyTemplate}></Column>
                            <Column field="fundingRecieved" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Funding Received' sortable header="Funding Received"></Column>
                            <Column field="fundingAgencyType" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Funding Agency Type' sortable header="Funding Agency Type"></Column>
                            <Column field="fundingAgency" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Funding Agency' sortable header="Funding Agency"></Column>
                            <Column field="sanctionedAmount" style={{ minWidth: '150px' }} sortable header="Sanctioned Amount"></Column>
                            <Column field="recievedAmount" style={{ minWidth: '150px' }} sortable header="Received Amount"></Column>
                            <Column field="uploadFundSanctionedLetter" style={{ minWidth: '250px' }} header="Fund Sanctioned Letter" body={uploadFundSanctionedLetterBodyTemplate}></Column>
                            <Column field="uploadUtilizationCertificate" style={{ minWidth: '250px' }} header="Utilization Certificate" body={uploadUtilizationCertificateBodyTemplate}></Column>
                            <Column field="uploadBanner" style={{ minWidth: '250px' }} header="Banner" body={uploadBannerBodyTemplate}></Column>
                            <Column field="uploadScheduleOfOrganizer" style={{ minWidth: '250px' }} header="Schedule" body={uploadScheduleBodyTemplate}></Column>
                            <Column field="uploadCertificateLOA" style={{ minWidth: '250px' }} header="Certificate LOA" body={uploadCertificateLOABodyTemplate}></Column>
                            <Column field="uploadSupportingDocuments" style={{ minWidth: '250px' }} header="Supporting Documents" body={uploadSupportingDocumentsBodyTemplate}></Column>
                            <Column field="uploadReport" style={{ minWidth: '250px' }} header="Report" body={uploadReportBodyTemplate}></Column>
                            <Column field="uploadPhotos" style={{ minWidth: '250px' }} header="Photos" body={uploadPhotosBodyTemplate}></Column>
                            <Column field="videoUrl" style={{ minWidth: '250px' }} header="Video URL" body={videoUrlBodyTemplate}></Column>
                        </DataTable>


                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default SttpOrganizedHeadDisplay