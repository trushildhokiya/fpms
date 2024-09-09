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
import { Knob } from 'primereact/knob'
import Logo from '@/assets/image/logo.png'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

type Props = {}

interface Conference {
    _id: string;
    title: string;
    authors: string[];
    authorsAffiliation: string[];
    departmentInvolved: string[];
    facultiesInvolved: string[];
    nationalInternational: string;
    conferenceName: string;
    venue: string;
    organizer: string;
    role: string;
    fromDate: Date;
    toDate: Date;
    paperStatus: string;
    publicationDate: Date;
    issn: string;
    impactFactor: number;
    pageNo: string;
    yearOfPublication: number;
    doi: string;
    indexing: string[];
    paperUrl: string;
    citationCount: number;
    paper: string;
    certificate: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}


const ConferenceDisplay = (props: Props) => {

    // constants
    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<Conference[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const dt = useRef<any>(null);

    // funcions

    // function to convert date strings to Date objects
    const convertDates = (conferences: Conference[]) => {
        return conferences.map(conference => ({
            ...conference,
            fromDate: new Date(conference.fromDate),
            toDate: new Date(conference.toDate),
            publicationDate: new Date(conference.publicationDate)
        }));
    };

    // useEffect to fetch data
    useEffect(() => {
        axios.get('/common/conference')
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

    const idBodyTemplate = (rowData: Conference) => {
        return <Badge className='bg-rose-900 bg-opacity-85 font-normal tracking-wide hover:bg-rose-700 text-rose-200'>{rowData._id}</Badge>;
    };

    const authorsBodyTemplate = (rowData: Conference) => rowData.authors.join(", ")

    const affiliationBodyTemplate = (rowData: Conference) => rowData.authorsAffiliation.join(", ")

    const departmentInvolvedBodyTemplate = (rowData: Conference) => {
        return rowData.departmentInvolved.map((department: string) => (
            <Badge key={department} className='bg-purple-400 hover:bg-purple-300 bg-opacity-85 text-purple-900'>{department}</Badge>
        ));
    };

    const facultyInvolvedBodyTemplate = (rowData: Conference) => rowData.facultiesInvolved.join(", ")


    const impactFactorBodyTemplate = (rowData: Conference) => {
        return <Knob value={rowData.impactFactor} min={0} max={1000} size={80} className='flex justify-center' rangeColor='#9c9494' valueColor='#fcba03' readOnly />
    }

    const indexingBodyTemplate = (rowData: Conference) => {
        return rowData.indexing.map((index: string) => (
            <Badge key={index} className='bg-yellow-950 mr-2 my-1 font-normal hover:bg-yellow-800 bg-opacity-85 text-yellow-200'>{index}</Badge>
        ));
    };

    const citationBodyTemplate = (rowData: Conference) => {
        return (
            <Button className='rounded-full w-12 h-12 bg-lime-200 text-lime-900 disabled:opacity-100 font-semibold' disabled>{rowData.citationCount}</Button>
        )
    };

    const fromDateBodyTemplate = (rowData: Conference) => rowData.fromDate.toLocaleDateString()

    const toDateBodyTemplate = (rowData: Conference) => rowData.toDate.toLocaleDateString()

    const publicationDateBodyTemplate = (rowData: Conference) => rowData.publicationDate.toLocaleDateString()


    const URLBodyTemplate = (rowData: Conference) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={rowData.paperUrl}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const certificateBodyTemplate = (rowData: Conference) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.certificate.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const paperBodyTemplate = (rowData: Conference) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.paper.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const dateFilterTemplate = (options: any) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
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
            dataKey: keyof Conference;
        }

        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'title' },
            { header: 'Authors', dataKey: 'authors' },
            { header: 'Authors Affiliation', dataKey: 'authorsAffiliation' },
            { header: 'Department Involved', dataKey: 'departmentInvolved' },
            { header: 'Faculties Involved', dataKey: 'facultiesInvolved' },
            { header: 'National/International', dataKey: 'nationalInternational' },
            { header: 'Conference Name', dataKey: 'conferenceName' },
            { header: 'Venue', dataKey: 'venue' },
            { header: 'Organizer', dataKey: 'organizer' },
            { header: 'Role', dataKey: 'role' },
            { header: 'From Date', dataKey: 'fromDate' },
            { header: 'To Date', dataKey: 'toDate' },
            { header: 'Paper Status', dataKey: 'paperStatus' },
            { header: 'Publication Date', dataKey: 'publicationDate' },
            { header: 'ISSN', dataKey: 'issn' },
            { header: 'Impact Factor', dataKey: 'impactFactor' },
            { header: 'Page No', dataKey: 'pageNo' },
            { header: 'Year of Publication', dataKey: 'yearOfPublication' },
            { header: 'DOI', dataKey: 'doi' },
            { header: 'Indexing', dataKey: 'indexing' },
            { header: 'Paper URL', dataKey: 'paperUrl' },
            { header: 'Citation Count', dataKey: 'citationCount' },
            { header: 'Paper', dataKey: 'paper' },
            { header: 'Certificate', dataKey: 'certificate' },
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
        doc.save('conference_data.pdf');
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

    const footerTemplate = () => {
        return "Total Records Matched: " + totalRecords; // Access total records here
    };

    const actionBodyTemplate = (rowData: Conference) => {
        return (
            <>
                <Link to={`/common/edit/conference/${rowData._id}`}>
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

    const handleDelete = (rowData: Conference) => {
        axios.delete('/common/conference', {
            data: {
                conference_id: rowData._id
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
                    Conference Details
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>My Conference's</CardTitle>
                            <CardDescription>Conference details of the faculty is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable exportFilename='my-conferences' ref={dt} header={header} footer={footerTemplate} value={data} scrollable removableSort sortMode='multiple' paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]} onValueChange={(e) => setTotalRecords(e.length)} showGridlines size='large'>
                                <Column field="_id" style={{ minWidth: '250px' }} body={idBodyTemplate} header="ID"></Column>
                                <Column field="title" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by title' sortable header="Title"></Column>
                                <Column field="authors" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by authors' header="Authors" body={authorsBodyTemplate}></Column>
                                <Column field="authorsAffiliation" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by affiliation' header="Authors Affiliations" body={affiliationBodyTemplate}></Column>
                                <Column field="departmentInvolved" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by department' header="Departments Involved" body={departmentInvolvedBodyTemplate}></Column>
                                <Column field="facultiesInvolved" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by faculty' header="Faculties Involved" body={facultyInvolvedBodyTemplate}></Column>
                                <Column field="nationalInternational" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by type' sortable header="National/International"></Column>
                                <Column field="conferenceName" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by conference name' sortable header="Conference Name"></Column>
                                <Column field="venue" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by venue' sortable header="Venue"></Column>
                                <Column field="organizer" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by organizer' sortable header="Organizer"></Column>
                                <Column field="role" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by role' sortable header="Role"></Column>
                                <Column field="fromDate" style={{ minWidth: '250px' }} align={'center'} sortable dataType='date' filter filterPlaceholder='Search by from date' filterElement={dateFilterTemplate} header="From Date" body={fromDateBodyTemplate}></Column>
                                <Column field="toDate" style={{ minWidth: '250px' }} align={'center'} sortable dataType='date' header="To Date" filter filterPlaceholder='Search by to date' filterElement={dateFilterTemplate} body={toDateBodyTemplate}></Column>
                                <Column field="paperStatus" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by status' sortable header="Paper Status"></Column>
                                <Column field="publicationDate" style={{ minWidth: '250px' }} sortable dataType='date' header="Publication Date" filter filterPlaceholder='Search by to date' filterElement={dateFilterTemplate} body={publicationDateBodyTemplate}></Column>
                                <Column field="issn" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by issn' header="ISBN/ISSN"></Column>
                                <Column field="impactFactor" style={{ minWidth: '250px' }} dataType='numeric' filter filterPlaceholder='Search by imapct' align={'center'} body={impactFactorBodyTemplate} header="Impact Factor"></Column>
                                <Column field="pageNo" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by page from' align={'center'} header="Page Number"></Column>
                                <Column field="yearOfPublication" style={{ minWidth: '250px' }} filter dataType='numeric' align={'center'} filterPlaceholder='Search by year' header="Year of Publication"></Column>
                                <Column field="doi" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by doi' header="Digital Object Identifier"></Column>
                                <Column field="indexing" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by indexing' sortable body={indexingBodyTemplate} header="Indexing"></Column>
                                <Column field="citationCount" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by count' dataType='numeric' body={citationBodyTemplate} align={'center'} sortable header="Citation Count"></Column>
                                <Column field="paperUrl" style={{ minWidth: '200px' }} filter filterPlaceholder='Search by url' align={'center'} body={URLBodyTemplate} sortable header="Paper URL"></Column>
                                <Column field="paper" style={{ minWidth: '200px' }} align={'center'} header="Paper" body={paperBodyTemplate}></Column>
                                <Column field="certificate" style={{ minWidth: '200px' }} align={'center'} header="Certificate" body={certificateBodyTemplate}></Column>
                                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} header="Actions"></Column>
                            </DataTable>

                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default ConferenceDisplay