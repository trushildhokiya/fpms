import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileDown, Table, TicketCheck, TicketX } from 'lucide-react'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import { Knob } from 'primereact/knob'
import AdminNavbar from '@/components/navbar/AdminNavbar'
import Logo from '@/assets/image/logo.png'
import { useSelector } from 'react-redux'

interface Journal {
    _id: string;
    title: string;
    authors: string[];
    authorsAffiliation: string[];
    departmentInvolved: string[];
    facultiesInvolved: string[];
    paidUnpaid: string;
    journalType: string;
    journalTitle: string;
    issn: string;
    impactFactor: number;
    pageFrom: number;
    pageTo: number;
    dateOfPublication: Date;
    digitalObjectIdentifier: string;
    indexing: string[];
    paperUrl: string;
    citationCount: number;
    paper: string;
    certificate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const JournalDisplay = () => {

    // constants
    const [data, setData] = useState<Journal[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const dt = useRef<any>(null);
    const user = useSelector((state:any)=> state.user)
    
    // funcions
    const convertDates = (journals: Journal[]) => {
        return journals.map(journal => ({
            ...journal,
            dateOfPublication: new Date(journal.dateOfPublication),
        }));
    };

    // useEffect to fetch data
    useEffect(() => {
        axios.get('/admin/data/journal')
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
    
    const idBodyTemplate = (rowData: Journal) => {
        return <Badge className='bg-rose-900 bg-opacity-85 font-normal tracking-wide hover:bg-rose-700 text-rose-200'>{rowData._id}</Badge>;
    };

    const authorsBodyTemplate = (rowData: Journal) => rowData.authors.join(", ")

    const affiliationBodyTemplate = (rowData: Journal) => rowData.authorsAffiliation.join(", ")

    const departmentInvolvedBodyTemplate = (rowData: Journal) => {
        return rowData.departmentInvolved.map((department: string) => (
            <Badge key={department} className='bg-purple-400 hover:bg-purple-300 bg-opacity-85 text-purple-900'>{department}</Badge>
        ));
    };
    
    const facultyInvolvedBodyTemplate = (rowData: Journal) => rowData.facultiesInvolved.join(", ")

    const paidUnpaidBodyTemplate = (rowData: Journal) => {
        return rowData.paidUnpaid === 'paid' ? <TicketCheck color="#24a32a" className='h-6 w-6 mx-auto' /> : <TicketX className='w-6 mx-auto h-6' color='#827e81' />
    };
    
    const impactFactorBodyTemplate = (rowData:Journal) =>{
        return <Knob value={rowData.impactFactor} min={0} max={1000} size={80} className='flex justify-center' rangeColor='#9c9494' valueColor='#fcba03' readOnly />
    }

    const citationBodyTemplate = (rowData: Journal) => {
        return(
            <Button className='rounded-full w-12 h-12 bg-lime-200 text-lime-900 disabled:opacity-100 font-semibold' disabled>{rowData.citationCount}</Button>
        )
    };

    const indexingBodyTemplate = (rowData: Journal) => {
        return rowData.indexing.map((index: string) => (
            <Badge key={index} className='bg-yellow-950 mr-2 my-1 font-normal hover:bg-yellow-800 bg-opacity-85 text-yellow-200'>{index}</Badge>
        ));
    };
    
    const dateBodyTemplate = (rowData: Journal) => rowData.dateOfPublication.toLocaleDateString()
    
    const URLBodyTemplate = (rowData: Journal) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={rowData.paperUrl}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const certificateBodyTemplate = (rowData: Journal) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.certificate.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const paperBodyTemplate = (rowData: Journal) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.paper.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const footerTemplate = () => {
        return "Total Records Matched: " + totalRecords; // Access total records here
    };


    // download functions
    const exportCSV = (selectionOnly:boolean) => {
        dt.current.exportCSV({ selectionOnly });
    };


    

    const exportPdf = () => {

        // Initialize jsPDF instance
        const doc = new jsPDF('landscape','in',[20,30]);
    
        // Column definitions
        interface Column {
            header: string;
            dataKey: keyof Journal;
        }

        const columns:Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'title' },
            { header: 'Authors', dataKey: 'authors' },
            { header: 'Authors Affiliation', dataKey: 'authorsAffiliation' },
            { header: 'Department Involved', dataKey: 'departmentInvolved' },
            { header: 'Paid/Unpaid', dataKey: 'paidUnpaid' },
            { header: 'Faculties Involved', dataKey: 'facultiesInvolved' },
            { header: 'Journal Type', dataKey: 'journalType' },
            { header: 'Journal Title', dataKey: 'journalTitle' },
            { header: 'ISSN', dataKey: 'issn' },
            { header: 'Impact Factor', dataKey: 'impactFactor' },
            { header: 'Page From', dataKey: 'pageFrom' },
            { header: 'Page To', dataKey: 'pageTo' },
            { header: 'Date of Publication', dataKey: 'dateOfPublication' },
            { header: 'DOI', dataKey: 'digitalObjectIdentifier' },
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
            const imgWidth = 5; 
            const imgHeight = 5;
    
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
        autoTable(doc,{
            head: [columns.map(col => col.header)],
            body:  data.map(row => columns.map(col => formatField(row[col.dataKey]))),
            styles:{
                overflow:'linebreak',
                font:'times',
                cellPadding:0.2,
            },
            horizontalPageBreak:true,
            didDrawPage: addFooter

        });

        addBackgroundImage()

        // Save the PDF
        doc.save('journal_data.pdf');
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
                    Journal Details
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Instituational Journal's</CardTitle>
                            <CardDescription>Journal details of the faculty is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable exportFilename='institution-journals' ref={dt} header={header} value={data} scrollable removableSort sortMode='multiple' paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords} entries" footer={footerTemplate} rowsPerPageOptions={[5, 10, 25, 50]}  onValueChange={(e) => setTotalRecords(e.length)} showGridlines size='large'>
                                <Column field="_id" style={{minWidth:'250px'}}  body={idBodyTemplate} header="ID"></Column>
                                <Column field="title" style={{minWidth:'250px'}} filter filterPlaceholder='Search by title' sortable header="Title"></Column>
                                <Column field="authors" style={{minWidth:'250px'}} filter filterPlaceholder='Search by authors' header="Inventors" body={authorsBodyTemplate}></Column>
                                <Column field="authorsAffiliation" style={{minWidth:'250px'}} filter filterPlaceholder='Search by affiliation' header="Affiliation Inventors" body={affiliationBodyTemplate}></Column>
                                <Column field="departmentInvolved" style={{minWidth:'250px'}} filter filterPlaceholder='Search by department' header="Departments Involved" body={departmentInvolvedBodyTemplate}></Column>
                                <Column field="facultiesInvolved" style={{minWidth:'250px'}} filter filterPlaceholder='Search by faculty' header="Faculties Involved" body={facultyInvolvedBodyTemplate}></Column>
                                <Column field="paidUnpaid" style={{minWidth:'150px'}} align={'center'} filter filterPlaceholder='Search by paid/unpaid' header="Paid/Unpaid" body={paidUnpaidBodyTemplate}></Column>
                                <Column field="journalType" style={{minWidth:'250px'}} filter filterPlaceholder='Search by type' header="Journal Type" ></Column>
                                <Column field="journalTitle" style={{minWidth:'250px'}} filter filterPlaceholder='Search by title' header="Journal Title"></Column>
                                <Column field="issn" style={{minWidth:'250px'}} filter filterPlaceholder='Search by issn' header="ISBN/ISSN"></Column>
                                <Column field="impactFactor" style={{minWidth:'250px'}} dataType='numeric' filter filterPlaceholder='Search by imapct' align={'center'} body={impactFactorBodyTemplate} header="Impact Factor"></Column>
                                <Column field="pageFrom" style={{minWidth:'150px'}} filter filterPlaceholder='Search by page from' align={'center'} header="Page From"></Column>
                                <Column field="pageTo" style={{minWidth:'150px'}} filter filterPlaceholder='Search by page to' align={'center'} header="Page To"></Column>
                                <Column field="dateOfPublication" style={{minWidth:'250px'}} filter dataType='date' align={'center'} filterPlaceholder='Search by date' body={dateBodyTemplate} header="Date Of Publication"></Column>
                                <Column field="digitalObjectIdentifier" style={{minWidth:'250px'}} filter filterPlaceholder='Search by doi' header="Digital Object Identifier"></Column>
                                <Column field="indexing" style={{minWidth:'250px'}} filter filterPlaceholder='Search by indexing' sortable body={indexingBodyTemplate} header="Indexing"></Column>
                                <Column field="citationCount" style={{minWidth:'250px'}} body={citationBodyTemplate} filter filterPlaceholder='Search by count' dataType='numeric' align={'center'} sortable header="Citation Count"></Column>
                                <Column field="paperUrl" style={{minWidth:'200px'}} filter filterPlaceholder='Search by url' align={'center'} body={URLBodyTemplate} sortable header="Paper URL"></Column>
                                <Column field="paper" style={{minWidth:'200px'}}  align={'center'} header="Paper" body={paperBodyTemplate}></Column>
                                <Column field="certificate" style={{minWidth:'200px'}} align={'center'} header="Certificate" body={certificateBodyTemplate}></Column>
                            </DataTable>



                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default JournalDisplay