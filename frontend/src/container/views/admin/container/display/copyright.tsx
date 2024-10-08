import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { Calendar } from 'primereact/calendar'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import countryCodes from '@/utils/data/country-codes'
import { FileDown, Table } from 'lucide-react'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import AdminNavbar from '@/components/navbar/AdminNavbar'
import Logo from '@/assets/image/logo.png'
import { useSelector } from 'react-redux'

interface Copyright {
    _id: string;
    title: string;
    inventors: string[];
    affiliationInventors: string[];
    departmentInvolved: string[];
    facultiesInvolved: string[];
    nationalInternational: string;
    country: string;
    applicationNumber: string;
    startDate: Date;
    endDate: Date;
    copyrightCertificate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const CopyrightDisplay = () => {

    // constants
    const [data, setData] = useState<Copyright[]>([]);
    const [totalRecords,setTotalRecords] = useState(0)
    const dt = useRef<any>(null);
    const user = useSelector((state: any) => state.user)


    // funcions

    // function to convert date strings to Date objects
    const convertDates = (copyrights: Copyright[]) => {
        return copyrights.map(copyright => ({
            ...copyright,
            startDate: new Date(copyright.startDate),
            endDate: new Date(copyright.endDate)
        }));
    };

    // useEffect to fetch data
    useEffect(() => {
        axios.get('admin/data/copyright')
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
    
    const idBodyTemplate = (rowData: Copyright) => {
        return <Badge className='bg-amber-400 bg-opacity-55 hover:bg-amber-300 text-amber-700'>{rowData._id}</Badge>;
    };

    const inventorBodyTemplate = (rowData: Copyright) => rowData.inventors.join(", ")

    const affiliationBodyTemplate = (rowData: Copyright) => rowData.affiliationInventors.join(", ")

    const departmentInvolvedBodyTemplate = (rowData: Copyright) => {
        return rowData.departmentInvolved.map((department: string) => (
            <Badge key={department} className='bg-green-800 bg-opacity-85 text-green-200'>{department}</Badge>
        ));
    };
    
    const facultyInvolvedBodyTemplate = (rowData: Copyright) => rowData.facultiesInvolved.join(", ")

    
    const countryBodyTemplate = (rowData: Copyright) => {
        return (
            <div className="flex align-items-center gap-2">
                <img draggable={false} alt="flag" src={`https://flagicons.lipis.dev/flags/4x3/${countryCodes[rowData.country.toLowerCase()]}.svg`} style={{ width: '24px' }} />
                <span>{rowData.country}</span>
            </div>
        )
    }
   
    const startDateBodyTemplate = (rowData: Copyright) => rowData.startDate.toLocaleDateString()

    const endDateBodyTemplate = (rowData: Copyright) => rowData.endDate.toLocaleDateString()

    const certificateBodyTemplate = (rowData: Copyright) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.copyrightCertificate.split('uploads')[1]}>
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

    // download functions
    const exportCSV = (selectionOnly:boolean) => {
        dt.current.exportCSV({ selectionOnly });
    };


    

    const exportPdf = () => {

        // Initialize jsPDF instance
        const doc = new jsPDF('landscape','in',[20,20]);
    
        // define columns
        interface Column {
            header: string;
            dataKey: keyof Copyright;
        }

        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'title' },
            { header: 'Inventors', dataKey: 'inventors' },
            { header: 'Affiliation Inventors', dataKey: 'affiliationInventors' },
            { header: 'Department Involved', dataKey: 'departmentInvolved' },
            { header: 'Faculties Involved', dataKey: 'facultiesInvolved' },
            { header: 'National/International', dataKey: 'nationalInternational' },
            { header: 'Country', dataKey: 'country' },
            { header: 'Application Number', dataKey: 'applicationNumber' },
            { header: 'Start Date', dataKey: 'startDate' },
            { header: 'End Date', dataKey: 'endDate' },
            { header: 'Copyright Certificate', dataKey: 'copyrightCertificate' },
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
            body: data.map(row => columns.map(col => formatField(row[col.dataKey]))),
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
        doc.save('copyright_data.pdf');
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
                    Copyright Details
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Institution Copyrights</CardTitle>
                            <CardDescription>Copyright details of the faculties is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable exportFilename='institution-copyrights' ref={dt} header={header} footer={footerTemplate} value={data} scrollable removableSort sortMode='multiple' paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]} onValueChange={(e)=>setTotalRecords(e.length)} showGridlines size='large'>
                                <Column field="_id" style={{minWidth:'250px'}}  body={idBodyTemplate} header="ID"></Column>
                                <Column field="title" style={{minWidth:'250px'}} filter filterPlaceholder='Search by title' sortable header="Title"></Column>
                                <Column field="inventors" style={{minWidth:'250px'}} filter filterPlaceholder='Search by Inventors' header="Inventors" body={inventorBodyTemplate}></Column>
                                <Column field="affiliationInventors" style={{minWidth:'250px'}} filter filterPlaceholder='Search by affiliation' header="Affiliation Inventors" body={affiliationBodyTemplate}></Column>
                                <Column field="departmentInvolved" style={{minWidth:'250px'}} filter filterPlaceholder='Search by department' header="Departments Involved" body={departmentInvolvedBodyTemplate}></Column>
                                <Column field="facultiesInvolved" style={{minWidth:'250px'}} filter filterPlaceholder='Search by faculty' header="Faculties Involved" body={facultyInvolvedBodyTemplate}></Column>
                                <Column field="nationalInternational" style={{minWidth:'250px'}} filter filterPlaceholder='Search by type' sortable header="National/International"></Column>
                                <Column field="country" style={{minWidth:'250px'}} filter filterPlaceholder='Search by Country' body={countryBodyTemplate} sortable header="Country"></Column>
                                <Column field="applicationNumber" style={{minWidth:'250px'}} filter filterPlaceholder='Search by Application number' sortable header="Application Number"></Column>
                                <Column field="startDate" style={{minWidth:'250px'}} sortable dataType='date' filter filterPlaceholder='Search by filing date' filterElement={dateFilterTemplate} header="Start Date" body={startDateBodyTemplate}></Column>
                                <Column field="endDate" style={{minWidth:'250px'}} sortable dataType='date' header="End Date" filter filterPlaceholder='Search by grant date' filterElement={dateFilterTemplate} body={endDateBodyTemplate}></Column>
                                <Column field="copyrightCertificate" style={{minWidth:'250px'}} header="Copyright Certificate" body={certificateBodyTemplate}></Column>
                            </DataTable>

                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default CopyrightDisplay