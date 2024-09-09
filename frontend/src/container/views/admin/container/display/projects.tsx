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
import { NumericFormat } from 'react-number-format';
import AdminNavbar from '@/components/navbar/AdminNavbar'
import Logo from '@/assets/image/logo.png'
import { useSelector } from 'react-redux'

interface Project {
    _id: string;
    projectTitle: string;
    principalInvestigator: string;
    coInvestigators: string[];
    departmentInvolved: string[];
    facultiesInvolved: string[];
    fundingScheme: string;
    fundingAgency: string;
    nationalInternational: string;
    budgetAmount: number;
    sanctionedAmount: number;
    startDate: Date;
    endDate: Date;
    totalGrantReceived: number;
    domain: string;
    areaOfExpertise: string;
    description: string;
    transactionDetails: TransactionDetail[];
    sanctionedOrder: string;
    transactionProof: string;
    completionCertificate: string;
    supportingDocuments: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface TransactionDetail {
    _id: string;
    purchaseOrderNumber: string;
    purchaseOrderDate: Date;
    purchaseInvoiceNumber: string;
    purchaseInvoiceDate: Date;
    bankName: string;
    branchName: string;
    amountReceived: number;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

interface TransactionData {
    project_id: string;
    transaction_id: string;
    purchaseOrderNumber: string;
    purchaseOrderDate: Date;
    purchaseInvoiceNumber: string;
    purchaseInvoiceDate: Date;
    bankName: string;
    branchName: string;
    amountReceived: number;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}


const ProjectsDisplay = () => {

    // constants
    const [data, setData] = useState<Project[]>([]);
    const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const dt = useRef<any>(null);
    const dt2 = useRef<any>(null);
    const user = useSelector((state: any) => state.user)

    // funcions

    // function to convert date strings to Date objects
    const convertDates = (projects: Project[]) => {

        const convertTransactionDates = (transactions: TransactionDetail[]) => {
            return transactions.map(transaction => ({
                ...transaction,
                purchaseOrderDate: new Date(transaction.purchaseOrderDate),
                purchaseInvoiceDate: new Date(transaction.purchaseInvoiceDate),
                createdAt: new Date(transaction.createdAt),
                updatedAt: new Date(transaction.updatedAt)
            }));
        };

        return projects.map(project => ({
            ...project,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate),
            transactionDetails: convertTransactionDates(project.transactionDetails)
        }));
    };


    const handleChange = (e: any) => {

        setTotalRecords(e.length)
        manageTransactionData(e)

    }

    const manageTransactionData = (data: Project[]) => {

        const rows: TransactionData[] = []

        data.forEach(project => {
            // Extract main project details
            const { _id, transactionDetails } = project;

            // Iterate over students and create rows
            transactionDetails.forEach(transaction => {
                const row = {
                    project_id: _id,
                    transaction_id: transaction._id,
                    ...transaction
                };
                rows.push(row);
            });
        });

        setTransactionData(rows);

    }


    // useEffect to fetch data
    useEffect(() => {
        axios.get('/admin/data/projects')
            .then((res) => {
                const convertedData = convertDates(res.data);
                setData(convertedData);
                setTotalRecords(convertedData.length)
                manageTransactionData(convertedData)
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


    const coInvestigatorBodyTemplate = (rowData: Project) => {
        return rowData.coInvestigators.join(", ")
    }

    const departmentInvolvedBodyTemplate = (rowData: Project) => {
        return rowData.departmentInvolved.map((department: string) => (
            <Badge key={department} className='bg-fuchsia-800 bg-opacity-85 text-fuchsia-200'>{department}</Badge>
        ));
    };

    const facultyInvolvedBodyTemplate = (rowData: Project) => rowData.facultiesInvolved.join(", ")

    const budgetBodyTemplate = (rowData: Project) => <NumericFormat value={rowData.budgetAmount} thousandSeparator=',' readOnly disabled prefix='₹' />

    const sanctionedBodyTemplate = (rowData: Project) => <NumericFormat value={rowData.sanctionedAmount} readOnly disabled thousandSeparator=',' prefix='₹' />

    const grantBodyTemplate = (rowData: Project) => <NumericFormat value={rowData.totalGrantReceived} readOnly disabled thousandSeparator=',' prefix='₹' />

    const descriptionBodyTemplate = (rowData: Project) => {
        return <ScrollPanel className='w-full h-36 text-sm leading-6'>{rowData.description}</ScrollPanel>
    }

    const startDateBodyTemplate = (rowData: Project) => rowData.startDate.toLocaleDateString()

    const endDateBodyTemplate = (rowData: Project) => rowData.endDate.toLocaleDateString()


    const sanctionedProofBodyTemplate = (rowData: Project) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.sanctionedOrder.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const completionBodyTemplate = (rowData: Project) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.completionCertificate.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const supportingBodyTemplate = (rowData: Project) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.supportingDocuments.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const transactionBodyTemplate = (rowData: Project) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.transactionProof.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }

    const purchaseOrderBodyTemplate = (rowData: TransactionDetail) => rowData.purchaseOrderDate.toLocaleDateString()

    const purchaseInvoiceBodyTemplate = (rowData: TransactionDetail) => rowData.purchaseInvoiceDate.toLocaleDateString()

    const amountReceivedBodyTemplate = (rowData: TransactionDetail) => <NumericFormat value={rowData.amountReceived} readOnly disabled thousandSeparator=',' prefix='₹' />

    const purchaseOrderSubBodyTemplate = (rowData: TransactionData) => rowData.purchaseOrderDate.toLocaleDateString()

    const purchaseInvoiceSubBodyTemplate = (rowData: TransactionData) => rowData.purchaseInvoiceDate.toLocaleDateString()

    const amountReceivedSubBodyTemplate = (rowData: TransactionData) => <NumericFormat value={rowData.amountReceived} readOnly disabled thousandSeparator=',' prefix='₹' />

    const dateFilterTemplate = (options: any) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const footerTemplate = () => {
        return "Total Records Matched: " + totalRecords; // Access total records here
    };

    const projectIDBodyTemplate = (rowData: TransactionData) => {
        return <Badge className='bg-orange-400 bg-opacity-45 text-orange-800 hover:bg-orange-300'>{rowData.project_id}</Badge>
    }

    const transactionIDBodyTemplate = (rowData: TransactionData) => {
        return <Badge className='bg-red-400 bg-opacity-45 text-red-800 hover:bg-red-300'>{rowData.transaction_id}</Badge>
    }

    const subIdBodyTemplate = (rowData: TransactionDetail) => {
        return <Badge className='bg-red-400 bg-opacity-45 text-red-800 hover:bg-red-300'>{rowData._id}</Badge>
    }


    
    const header = (
        <div className="flex w-full justify-end gap-6 font-Poppins flex-wrap">
            <Button className='rounded-full bg-green-600' onClick={() => exportCSV(false)}>
                <Table className='w-5 h-5 mr-2' /> Excel
            </Button>
            <Button className='rounded-full bg-red-600' onClick={() => exportPdf()}>
                <FileDown className='w-5 h-5 mr-2' /> PDF
            </Button>
        </div>
    );

    const headerTransaction = (
        <div className="flex w-full justify-end gap-6 font-Poppins flex-wrap">
            <Button className='rounded-full bg-green-600' onClick={() => exportCSV02(false)}>
                <Table className='w-5 h-5 mr-2' /> Excel
            </Button>

        </div>
    );


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
            { header: 'Principal Investigator', dataKey: 'principalInvestigator' },
            { header: 'Co-Investigators', dataKey: 'coInvestigators' },
            { header: 'Departments Involved', dataKey: 'departmentInvolved' },
            { header: 'Faculties Involved', dataKey: 'facultiesInvolved' },
            { header: 'Funding Scheme', dataKey: 'fundingScheme' },
            { header: 'Funding Agency', dataKey: 'fundingAgency' },
            { header: 'National/International', dataKey: 'nationalInternational' },
            { header: 'Budget Amount', dataKey: 'budgetAmount' },
            { header: 'Sanctioned Amount', dataKey: 'sanctionedAmount' },
            { header: 'Start Date', dataKey: 'startDate' },
            { header: 'End Date', dataKey: 'endDate' },
            { header: 'Transaction Details', dataKey: 'transactionDetails' },
            { header: 'Total Grant Received', dataKey: 'totalGrantReceived' },
            { header: 'Domain', dataKey: 'domain' },
            { header: 'Area of Expertise', dataKey: 'areaOfExpertise' },
            { header: 'Description', dataKey: 'description' },
            { header: 'Sanctioned Order', dataKey: 'sanctionedOrder' },
            { header: 'Transaction Proof', dataKey: 'transactionProof' },
            { header: 'Completion Certificate', dataKey: 'completionCertificate' },
            { header: 'Supporting Documents', dataKey: 'supportingDocuments' },
            { header: 'Created At', dataKey: 'createdAt' },
            { header: 'Updated At', dataKey: 'updatedAt' },
            { header: '__v', dataKey: '__v' },
        ];

        // Function to format complex fields as strings
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
                13: { cellWidth: 10 },
                17: { cellWidth: 10 },
            },
            horizontalPageBreak: true,
            didDrawPage:addFooter
        });

        addBackgroundImage()
        // Save the PDF
        doc.save('major-minor-projects-data.pdf');
    };



    // download functions for student table
    const exportCSV02 = (selectionOnly: boolean) => {
        dt2.current.exportCSV({ selectionOnly });
    };



    // expand functions

    const allowExpansion = (rowData: Project) => {
        return rowData.transactionDetails.length > 0;
    }

    const rowExpansionTemplate = (data: Project) => {
        return (
            <div className="p-3">
                <h5 className='text-base text-red-800 my-5 font-semibold'>Transactions for {data.projectTitle}</h5>
                <DataTable removableSort value={data.transactionDetails} tableStyle={{ maxWidth: '2250px', maxBlockSize: "250px" }}>
                    <Column field="_id" body={subIdBodyTemplate} header="Id" filter filterPlaceholder='search by id' sortable></Column>
                    <Column field="purchaseOrderNumber" header="Purchase Order Number" filter filterPlaceholder='search by purchase order' sortable></Column>
                    <Column field="purchaseOrderDate" header="Purchase Order Date" body={purchaseOrderBodyTemplate} filter filterPlaceholder='search by date' sortable></Column>
                    <Column field="purchaseInvoiceNumber" header="Purchase Invoice Number" filter filterPlaceholder='search by purchase invoice' sortable></Column>
                    <Column field="purchaseInvoiceDate" header="Purchase Invoice Date" body={purchaseInvoiceBodyTemplate} filter filterPlaceholder='search by date' sortable></Column>
                    <Column field="bankName" header="Bank Name" filter filterPlaceholder='search by bank' sortable></Column>
                    <Column field="branchName" header="Branch Name" filter filterPlaceholder='search by branch' sortable></Column>
                    <Column field="amountReceived" header="Amount Recieved" body={amountReceivedBodyTemplate} dataType='numeric' filter filterPlaceholder='search by amount' sortable></Column>
                    <Column field="remarks" header="Remarks" sortable></Column>
                </DataTable>
            </div>
        );
    };


    return (
        <div>
            <AdminNavbar />

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
                                <DrawerTrigger>To generate reportings which uses both transactions and project data use pivot table. Click here to see a demo</DrawerTrigger>
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
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Institution Projects (Major/Minor)</CardTitle>
                            <CardDescription>Major Minor projects details of the faculty is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable
                                expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                                rowExpansionTemplate={rowExpansionTemplate}
                                exportFilename='institution-major-minor-projects' ref={dt} header={header} footer={footerTemplate} value={data} scrollable removableSort sortMode='multiple'
                                paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]}
                                onValueChange={handleChange} showGridlines size='large'>
                                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                                <Column field="_id" style={{ minWidth: '250px' }} body={idBodyTemplate} header="ID"></Column>
                                <Column field="projectTitle" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by title' sortable header="Project Title"></Column>
                                <Column field="principalInvestigator" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by investigator' sortable header="Principle Investigator"></Column>
                                <Column field="coInvestigators" style={{ minWidth: '250px' }} body={coInvestigatorBodyTemplate} filter filterPlaceholder='Search by investigator' sortable header="Co Investigators"></Column>
                                <Column field="departmentInvolved" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by department' header="Departments Involved" body={departmentInvolvedBodyTemplate}></Column>
                                <Column field="facultiesInvolved" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by faculty' header="Faculties Involved" body={facultyInvolvedBodyTemplate}></Column>
                                <Column field="fundingAgency" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by agency' header="Funding Agency"></Column>
                                <Column field="fundingScheme" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by scheme' header="Funding Scheme"></Column>
                                <Column field="nationalInternational" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by type' header="Funding Agency Type"></Column>
                                <Column field="budgetAmount" body={budgetBodyTemplate} sortable style={{ minWidth: '250px' }} dataType='numeric' filter filterPlaceholder='Search by budget' header="Budget Amount"></Column>
                                <Column field="sanctionedAmount" body={sanctionedBodyTemplate} sortable style={{ minWidth: '250px' }} dataType='numeric' filter filterPlaceholder='Search by amount' header="Sanctioned Amount"></Column>
                                <Column field="totalGrantReceived" body={grantBodyTemplate} sortable style={{ minWidth: '250px' }} dataType='numeric' filter filterPlaceholder='Search by grant' header="Total Grant Received"></Column>
                                <Column field="startDate" style={{ minWidth: '250px' }} align={'center'} sortable dataType='date' filter filterPlaceholder='Search by start date' filterElement={dateFilterTemplate} header="Start Date" body={startDateBodyTemplate}></Column>
                                <Column field="endDate" style={{ minWidth: '250px' }} align={'center'} sortable dataType='date' header="End Date" filter filterPlaceholder='Search by end date' filterElement={dateFilterTemplate} body={endDateBodyTemplate}></Column>
                                <Column field="domain" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by domain' header="Domain"></Column>
                                <Column field="areaOfExpertise" sortable style={{ minWidth: '250px' }} filter filterPlaceholder='Search by area' header="Area of Expertise"></Column>
                                <Column field="description" style={{ minWidth: '250px' }} body={descriptionBodyTemplate} sortable header="Description"></Column>
                                <Column field="sanctionedOrder" align={'center'} style={{ minWidth: '250px' }} header="Sanctioned Documents" body={sanctionedProofBodyTemplate}></Column>
                                <Column field="transactionProof" align={'center'} style={{ minWidth: '250px' }} header="Project Report" body={transactionBodyTemplate}></Column>
                                <Column field="completionCertificate" align={'center'} style={{ minWidth: '250px' }} header="Completion Letter" body={completionBodyTemplate}></Column>
                                <Column field="supportingDocuments" align={'center'} style={{ minWidth: '250px' }} header="Visit Documents" body={supportingBodyTemplate}></Column>
                            </DataTable>

                        </CardContent>

                    </Card>


                    <Card className='my-10'>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>Transactions</CardTitle>
                            <CardDescription>The transaction the involved for above entries are listed below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable ref={dt2} header={headerTransaction} exportFilename='project-transactions' removableSort value={transactionData}
                                paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]}
                                sortMode='multiple' showGridlines size='large'
                            >
                                <Column style={{ minWidth: '250px' }} body={projectIDBodyTemplate} field="project_id" header="Project ID" filter filterPlaceholder='search by id' sortable></Column>
                                <Column style={{ minWidth: '250px' }} body={transactionIDBodyTemplate} field="transaction_id" header="Transaction ID" filter filterPlaceholder='search by id' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="purchaseOrderNumber" header="Purchase Order Number" filter filterPlaceholder='search by purchase order' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="purchaseOrderDate" header="Purchase Order Date" body={purchaseOrderSubBodyTemplate} filter filterPlaceholder='search by date' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="purchaseInvoiceNumber" header="Purchase Invoice Number" filter filterPlaceholder='search by purchase invoice' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="purchaseInvoiceDate" header="Purchase Invoice Date" body={purchaseInvoiceSubBodyTemplate} filter filterPlaceholder='search by date' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="bankName" header="Bank Name" filter filterPlaceholder='search by bank' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="branchName" header="Branch Name" filter filterPlaceholder='search by branch' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="amountReceived" header="Amount Recieved" body={amountReceivedSubBodyTemplate} dataType='numeric' filter filterPlaceholder='search by amount' sortable></Column>
                                <Column style={{ minWidth: '250px' }} field="remarks" header="Remarks" sortable></Column>
                            </DataTable>

                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default ProjectsDisplay