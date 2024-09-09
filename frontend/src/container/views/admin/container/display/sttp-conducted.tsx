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
import { FileDown, Table,  } from 'lucide-react'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import Logo from '@/assets/image/logo.png'

interface STTPConducted {
    _id: string;
    title: string;
    sessionTitle: string;
    organizedBy: string;
    associationWith: string;
    type: string;
    mode: string;
    level: string;
    venue: string;
    fromDate: Date;
    toDate: Date;
    totalDays: number;
    remarks: string;
    certificate: string;
    invitationLetter: string;
    photos: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  }
  

const AdminSttpConductedDisplay = () => {

    // constants
    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<STTPConducted[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const dt = useRef<any>(null);

    // funcions

    // function to convert date strings to Date objects
    const convertDates = (sttpConducted: STTPConducted[]) => {
        return sttpConducted.map(sttp => ({
            ...sttp,
            fromDate: new Date(sttp.fromDate),
            toDate: new Date(sttp.toDate)
        }));
    };

    // useEffect to fetch data
    useEffect(() => {
        axios.get('/admin/data/sttp-conducted')
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

    const idBodyTemplate = (rowData: STTPConducted) => {
        return <Badge className='bg-amber-400 bg-opacity-55 hover:bg-amber-300 text-amber-700'>{rowData._id}</Badge>;
    };

    const remarksBodyTemplate = (rowData: STTPConducted) => {
        return (
            <span className="remarks-text">
                {rowData.remarks}
            </span>
        );
    };    
    
    const fromDateBodyTemplate = (rowData: STTPConducted) => rowData.fromDate.toLocaleDateString();
    
    const toDateBodyTemplate = (rowData: STTPConducted) => rowData.toDate.toLocaleDateString();
    
    const certUploadBodyTemplate = (rowData: STTPConducted) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.certificate.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800'>Download Certificate</Button>
            </Link>
        );
    };
    
    const invitationUploadBodyTemplate = (rowData: STTPConducted) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.invitationLetter.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800'>Download Invitation</Button>
            </Link>
        );
    };
    
    const photoUploadBodyTemplate = (rowData: STTPConducted) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.photos.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800'>View Photo</Button>
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
            dataKey: keyof STTPConducted;
        }

        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'title' },
            { header: 'Session Title', dataKey: 'sessionTitle' },
            { header: 'Organized By', dataKey: 'organizedBy' },
            { header: 'Association With', dataKey: 'associationWith' },
            { header: 'Type', dataKey: 'type' },
            { header: 'Mode', dataKey: 'mode' },
            { header: 'Level', dataKey: 'level' },
            { header: 'Venue', dataKey: 'venue' },
            { header: 'From Date', dataKey: 'fromDate' },
            { header: 'To Date', dataKey: 'toDate' },
            { header: 'Total Days', dataKey: 'totalDays' },
            { header: 'Remarks', dataKey: 'remarks' },
            { header: 'Certificate', dataKey: 'certificate' },
            { header: 'Invitation Letter', dataKey: 'invitationLetter' },
            { header: 'Photos', dataKey: 'photos' },
            { header: 'Created At', dataKey: 'createdAt' },
            { header: 'Updated At', dataKey: 'updatedAt' }
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
        doc.save('sttp-conducted.pdf');
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

                <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                    STTP/FDP Details
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Institution STTP/FDP Conducted</CardTitle>
                            <CardDescription>STTP/FDP Conducted details of all the faculties is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                        <DataTable 
                            exportFilename='my-sttp-conducted' 
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
                            <Column field="_id" body={idBodyTemplate} header="Id" filter filterPlaceholder='search by id' sortable></Column>
                            <Column field="title" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Title' sortable header="Title"></Column>
                            <Column field="sessionTitle" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Session Title' sortable header="Session Title"></Column>
                            <Column field="organizedBy" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Organizer' sortable header="Organized By"></Column>
                            <Column field="associationWith" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Association' sortable header="Association With"></Column>
                            <Column field="type" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Type' sortable header="Type"></Column>
                            <Column field="mode" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Mode' sortable header="Mode"></Column>
                            <Column field="level" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Level' sortable header="Level"></Column>
                            <Column field="venue" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Venue' sortable header="Venue"></Column>
                            <Column field="fromDate" style={{ minWidth: '250px' }} sortable dataType='date' filter filterPlaceholder='Search by Start Date' filterElement={dateFilterTemplate} header="From Date" body={fromDateBodyTemplate}></Column>
                            <Column field="toDate" style={{ minWidth: '250px' }} sortable dataType='date' filter filterPlaceholder='Search by End Date' filterElement={dateFilterTemplate} header="To Date" body={toDateBodyTemplate}></Column>
                            <Column field="totalDays" style={{ minWidth: '150px' }} sortable header="Total Days"></Column>
                            <Column field="remarks" style={{ minWidth: '250px' }} header="Remarks" body={remarksBodyTemplate}></Column>
                            <Column field="certificate" style={{ minWidth: '250px' }} header="Certificate" body={certUploadBodyTemplate}></Column>
                            <Column field="invitationLetter" style={{ minWidth: '250px' }} header="Invitation" body={invitationUploadBodyTemplate}></Column>
                            <Column field="photos" style={{ minWidth: '250px' }} header="Photo" body={photoUploadBodyTemplate}></Column>
                        </DataTable>

                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default AdminSttpConductedDisplay