import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileDown, Table } from 'lucide-react'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import { ScrollPanel } from 'primereact/scrollpanel'
import AdminNavbar from '@/components/navbar/AdminNavbar'

type Props = {}

interface Award {
    _id: string;
    title: string;
    awardingBody: string;
    year: number;
    description: string;
    proof: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


const AwardsHonorsDisplay = (props: Props) => {

    // constants
    const [data, setData] = useState<Award[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const dt = useRef<any>(null);

    // funcions


    // useEffect to fetch data
    useEffect(() => {
        axios.get('/admin/data/award-honors')
            .then((res) => {
                setData(res.data);
                setTotalRecords(res.data.length)
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
    const idBodyTemplate = (rowData: Award) => {
        return <Badge className='bg-teal-400 bg-opacity-45 hover:bg-teal-300 text-teal-800'>{rowData._id}</Badge>;
    };

    const descriptionBodyTemplate = (rowData: Award) => {
        return <ScrollPanel className='w-full h-36 text-sm leading-6'>{rowData.description}</ScrollPanel>
    }

    const proofBodyTemplate = (rowData: Award) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.proof.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const footerTemplate = () => {
        return "Total Records Matched: " + totalRecords; // Access total records here
    };

    // download functions

    const exportCSV = (selectionOnly: boolean) => {
        dt.current.exportCSV({ selectionOnly });
    };


    const exportPdf = () => {

        // Initialize jsPDF instance
        const doc = new jsPDF('landscape', 'in', [20, 20]);


        // Column definitions
        interface Column {
            header: string;
            dataKey: keyof Award;
        }

        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Title', dataKey: 'title' },
            { header: 'Awarding Body', dataKey: 'awardingBody' },
            { header: 'Year', dataKey: 'year' },
            { header: 'Description', dataKey: 'description' },
            { header: 'Proof', dataKey: 'proof' },
            { header: 'Created At', dataKey: 'createdAt' },
            { header: 'Updated At', dataKey: 'updatedAt' },
            { header: '__v', dataKey: '__v' },
        ];


        // Add autoTable content to the PDF
        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: data.map((row) => columns.map(col => row[col.dataKey])),
            styles: {
                overflow: 'linebreak',
                font: 'times',
                cellPadding: 0.2,
            },
            columnStyles: {
                4: { cellWidth: 5 },
                5: { cellWidth: 2 }
            },
            horizontalPageBreak: true

        });

        // Save the PDF
        doc.save('award-honors-data.pdf');
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


    return (
        <div>
            <AdminNavbar />

            <div className="container font-Poppins my-10">

                <h1 className='text-3xl underline font-AzoSans uppercase text-red-800 tracking-wide underline-offset-4'>
                    Awards Honors Details
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Institutional Awards Honors</CardTitle>
                            <CardDescription>Awards Honors details of the faculty is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable exportFilename='institution-awards-honors' ref={dt} header={header} footer={footerTemplate} value={data} scrollable removableSort sortMode='multiple' paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]} onValueChange={(e) => setTotalRecords(e.length)} showGridlines size='large'>
                                <Column field="_id" style={{ minWidth: '250px' }} body={idBodyTemplate} header="ID"></Column>
                                <Column field="title" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by title' sortable header="Title"></Column>
                                <Column field="awardingBody" style={{ minWidth: '250px' }} sortable filter filterPlaceholder='Search by awarding body' header="Awarding Body"></Column>
                                <Column field="year" style={{ minWidth: '200px' }} filter dataType="numeric" filterPlaceholder='Search by year' align={'center'} header="Year" sortable ></Column>
                                <Column field="description" style={{ minWidth: '250px' }} sortable header="Description" body={descriptionBodyTemplate}></Column>
                                <Column field="proof" style={{ minWidth: '250px' }} align={'center'} header="Proof" body={proofBodyTemplate}></Column>
                            </DataTable>

                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default AwardsHonorsDisplay