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
import { FileDown, Table } from 'lucide-react'
import autoTable from 'jspdf-autotable'
import { ScrollPanel } from 'primereact/scrollpanel'
import jsPDF from 'jspdf'
import Logo from '@/assets/image/logo.png'

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

const HeadAwardRecievedDisplay = () => {

    // constants
    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<AwardRecieved[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const dt = useRef<any>(null);

    // function to convert date strings to Date objects
    const convertDates = (award_recieveds: AwardRecieved[]) => {
        return award_recieveds.map(award_recieved => ({
            ...award_recieved,
            date: new Date(award_recieved.date)
        }));
    };

    // useEffect to fetch data
    useEffect(() => {
        axios.get('/head/data/awards-recieved').then((res) => {
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
    const idBodyTemplate = (rowData: AwardRecieved) => {
        return <Badge className='bg-amber-400 bg-opacity-55 hover:bg-amber-300 text-amber-700'>{rowData._id}</Badge>;
    };

    const remarksBodyTemplate = (rowData: AwardRecieved) => {
        return <ScrollPanel className='w-full h-36 text-sm leading-6'>{rowData.remarks}</ScrollPanel>
    }

    const dateBodyTemplate = (rowData: AwardRecieved) => rowData.date.toLocaleDateString()

    const certificateBodyTemplate = (rowData: AwardRecieved) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.certificate.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const photosBodyTemplate = (rowData: AwardRecieved) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.photos.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const URLBodyTemplate = (rowData: AwardRecieved) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={rowData.videoUrl}>
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
            dataKey: keyof AwardRecieved;
        }

        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'title' },
            { header: 'Awardee Organization', dataKey: 'organization' },
            { header: 'Venue', dataKey: 'venue' },
            { header: 'Type', dataKey: 'type' },
            { header: 'Date', dataKey: 'date' },
            { header: 'Level', dataKey: 'level' },
            { header: 'Remarks', dataKey: 'remarks' },
            { header: 'Certificate', dataKey: 'certificate' },
            { header: 'Photos', dataKey: 'photos' },
            { header: 'Video Url', dataKey: 'videoUrl' },
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
        doc.save('awards-received-data.pdf');
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
            {user.role === 'Faculty' ? <FacultyNavbar /> : <HeadNavbar />}

            <div className="container font-Poppins my-10">

                <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                Awards / Recognition Received Details
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Departmental Awards Received</CardTitle>
                            <CardDescription>Awards Received details of the faculty is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable exportFilename='my-awards-recieved' ref={dt} header={header} footer={footerTemplate} value={data} scrollable removableSort sortMode='multiple' paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]} onValueChange={(e) => setTotalRecords(e.length)} showGridlines size='large'>
                                <Column field="_id" style={{ minWidth: '250px' }} body={idBodyTemplate} header="ID"></Column>
                                <Column field="title" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Title' sortable header="Title"></Column>
                                <Column field="organization" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Organization' sortable header="Awardee Organization"></Column>
                                <Column field="venue" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Venue' sortable header="Venue"></Column>
                                <Column field="type" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by Type' sortable header="Type"></Column>
                                <Column field="date" style={{ minWidth: '250px' }} sortable dataType='date' filter filterPlaceholder='Search by Date' filterElement={dateFilterTemplate} header="Date" body={dateBodyTemplate}></Column>
                                <Column field="level" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by type' sortable header="Level"></Column>
                                <Column field="remarks" style={{ minWidth: '250px' }} sortable header="Remarks" body={remarksBodyTemplate}></Column>
                                <Column field="certificate" style={{ minWidth: '250px' }} header="Certificate" body={certificateBodyTemplate}></Column>
                                <Column field="photos" style={{ minWidth: '250px' }} header="Photos" body={photosBodyTemplate}></Column>
                                <Column field="videoUrl" style={{ minWidth: '200px' }}  body={URLBodyTemplate} header="Video Url"></Column>
                            </DataTable>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default HeadAwardRecievedDisplay