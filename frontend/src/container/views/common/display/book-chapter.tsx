import FacultyNavbar from '@/components/navbar/FacultyNavbar'
import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
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


interface BookChapter {
    _id: string;
    bookTitle: string;
    chapterTitle: string;
    authors: string[];
    authorsAffiliation: string[];
    departmentInvolved: string[];
    facultiesInvolved: string[];
    publisherName: string;
    nationalInternational: string;
    issn: string;
    impactFactor: number;
    dateOfPublication: Date;
    doi: string;
    indexing: string[];
    intendedAudience: string;
    description: string;
    bookUrl: string;
    citationCount: number;
    proof: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}



const BookChapterDisplay = (props: Props) => {

    // constants
    const user = useSelector((state: any) => state.user)
    const [data, setData] = useState<BookChapter[]>([]);
    const [totalRecords, setTotalRecords] = useState(0)
    const dt = useRef<any>(null);

    // funcions
    const convertDates = (bookChapters: BookChapter[]) => {
        return bookChapters.map(item => ({
            ...item,
            dateOfPublication: new Date(item.dateOfPublication),
        }));
    };

    // useEffect to fetch data
    useEffect(() => {
        axios.get('/common/book-chapter')
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

    const idBodyTemplate = (rowData: BookChapter) => {
        return <Badge className='bg-rose-900 bg-opacity-85 font-normal tracking-wide hover:bg-rose-700 text-rose-200'>{rowData._id}</Badge>;
    };

    const authorsBodyTemplate = (rowData: BookChapter) => rowData.authors.join(", ")

    const affiliationBodyTemplate = (rowData: BookChapter) => rowData.authorsAffiliation.join(", ")

    const departmentInvolvedBodyTemplate = (rowData: BookChapter) => {
        return rowData.departmentInvolved.map((department: string) => (
            <Badge key={department} className='bg-purple-400 hover:bg-purple-300 bg-opacity-85 text-purple-900'>{department}</Badge>
        ));
    };

    const facultyInvolvedBodyTemplate = (rowData: BookChapter) => rowData.facultiesInvolved.join(", ")


    const impactFactorBodyTemplate = (rowData: BookChapter) => {
        return <Knob value={rowData.impactFactor} min={0} max={1000} size={80} className='flex justify-center' rangeColor='#9c9494' valueColor='#fcba03' readOnly />
    }

    const indexingBodyTemplate = (rowData: BookChapter) => {
        return rowData.indexing.map((index: string) => (
            <Badge key={index} className='bg-yellow-950 mr-2 my-1 font-normal hover:bg-yellow-800 bg-opacity-85 text-yellow-200'>{index}</Badge>
        ));
    };

    const dateBodyTemplate = (rowData: BookChapter) => rowData.dateOfPublication.toLocaleDateString()


    const citationBodyTemplate = (rowData: BookChapter) => {
        return (
            <Button className='rounded-full w-12 h-12 bg-lime-200 text-lime-900 disabled:opacity-100 font-semibold' disabled>{rowData.citationCount}</Button>
        )
    };


    const URLBodyTemplate = (rowData: BookChapter) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={rowData.bookUrl}>
                <Button variant={'link'} className='text-indigo-800' >View</Button>
            </Link>
        )
    }

    const proofBodyTemplate = (rowData: BookChapter) => {
        return (
            <Link target='_blank' referrerPolicy='no-referrer' to={axios.defaults.baseURL + "/" + rowData.proof.split('uploads')[1]}>
                <Button variant={'link'} className='text-indigo-800' >Download</Button>
            </Link>
        )
    }



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
            dataKey: keyof BookChapter;
        }

        const columns: Column[] = [
            { header: 'ID', dataKey: '_id' },
            { header: 'Book Title', dataKey: 'bookTitle' },
            { header: 'Chapter Title', dataKey: 'chapterTitle' },
            { header: 'Authors', dataKey: 'authors' },
            { header: 'Authors Affiliation', dataKey: 'authorsAffiliation' },
            { header: 'Department Involved', dataKey: 'departmentInvolved' },
            { header: 'Faculties Involved', dataKey: 'facultiesInvolved' },
            { header: 'Publisher Name', dataKey: 'publisherName' },
            { header: 'National/International', dataKey: 'nationalInternational' },
            { header: 'ISSN', dataKey: 'issn' },
            { header: 'Impact Factor', dataKey: 'impactFactor' },
            { header: 'Date of Publication', dataKey: 'dateOfPublication' },
            { header: 'DOI', dataKey: 'doi' },
            { header: 'Intended Audience', dataKey: 'intendedAudience' },
            { header: 'Description', dataKey: 'description' },
            { header: 'Indexing', dataKey: 'indexing' },
            { header: 'Book URL', dataKey: 'bookUrl' },
            { header: 'Citation Count', dataKey: 'citationCount' },
            { header: 'Proof', dataKey: 'proof' },
            { header: 'Created At', dataKey: 'createdAt' },
            { header: 'Updated At', dataKey: 'updatedAt' },
            { header: '__v', dataKey: '__v' },
        ];


        // Function to add footer to each page
        const addFooter = () => {
            const pageCount = doc.getNumberOfPages();

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                // Set font and font size
                doc.setFont('times');
                doc.setFontSize(10);

                // Create two lines of text

                const line1 = `Report generated by Faculty Profile Management System © ${new Date().getFullYear()}`;
                const line2 = `Downloaded by ${user.email} , ${new Date().toLocaleDateString()} , ${new Date().toLocaleTimeString()}`;

                // Calculate text width for each line to center align
                const textWidth1 = doc.getStringUnitWidth(line1) * doc.getFontSize() / doc.internal.scaleFactor;
                const textWidth2 = doc.getStringUnitWidth(line2) * doc.getFontSize() / doc.internal.scaleFactor;

                // Center align text horizontally
                const centerX1 = (doc.internal.pageSize.getWidth() - textWidth1) / 2;
                const centerX2 = (doc.internal.pageSize.getWidth() - textWidth2) / 2;

                // Add the two lines of footer text
                doc.text(line1, centerX1, doc.internal.pageSize.getHeight() - 0.5);
                doc.text(line2, centerX2, doc.internal.pageSize.getHeight() - 0.3);
            }
        };

        // add background logo
        const addBackgroundImage = () => {
            const imgWidth = 3; // Adjust image width as needed
            const imgHeight = 3; // Adjust image height as needed

            // Calculate center position
            const centerX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
            const centerY = (doc.internal.pageSize.getHeight() - imgHeight) / 2;

            // Loop through each page and add the image
            for (let i = 1; i <= doc.getNumberOfPages(); i++) {
                doc.setPage(i); // Set current page
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
                cellWidth: 'wrap'
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
        doc.save('book_chapter_data.pdf');
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

    const footerTemplate = () => {
        return "Total Records Matched: " + totalRecords; // Access total records here
    };

    const actionBodyTemplate = (rowData: BookChapter) => {
        return (
            <>
                <Link to={`/common/edit/book-chapter/${rowData._id}`}>
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

    const handleDelete = (rowData: BookChapter) => {
        axios.delete('/common/book-chapter', {
            data: {
                book_chapter_id: rowData._id
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
                    Book Chapter Details
                </h1>

                <div className="my-10">

                    <Card>
                        <CardHeader>
                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>My Book Chapter's</CardTitle>
                            <CardDescription>Book Chapter details of the faculty is shown below</CardDescription>
                        </CardHeader>

                        <CardContent className='font-Poppins'>

                            <DataTable exportFilename='my-book-chapters' ref={dt} header={header} footer={footerTemplate} value={data} scrollable removableSort sortMode='multiple' paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]} onValueChange={(e) => setTotalRecords(e.length)} showGridlines size='large'>
                                <Column field="_id" style={{ minWidth: '250px' }} body={idBodyTemplate} header="ID"></Column>
                                <Column field="bookTitle" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by title' sortable header="Book Title"></Column>
                                <Column field="chapterTitle" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by title' sortable header="Chapter Title"></Column>
                                <Column field="authors" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by authors' header="Authors" body={authorsBodyTemplate}></Column>
                                <Column field="authorsAffiliation" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by affiliation' header="Authors Affiliations" body={affiliationBodyTemplate}></Column>
                                <Column field="departmentInvolved" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by department' header="Departments Involved" body={departmentInvolvedBodyTemplate}></Column>
                                <Column field="facultiesInvolved" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by faculty' header="Faculties Involved" body={facultyInvolvedBodyTemplate}></Column>
                                <Column field="publisherName" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by publisher name' sortable header="Publisher Name"></Column>
                                <Column field="nationalInternational" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by type' sortable header="National/International"></Column>
                                <Column field="issn" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by issn' header="ISBN/ISSN"></Column>
                                <Column field="impactFactor" style={{ minWidth: '250px' }} dataType='numeric' filter filterPlaceholder='Search by imapct' align={'center'} body={impactFactorBodyTemplate} header="Impact Factor"></Column>
                                <Column field="dateOfPublication" style={{ minWidth: '250px' }} filter dataType='date' align={'center'} filterPlaceholder='Search by date' body={dateBodyTemplate} header="Date Of Publication"></Column>
                                <Column field="doi" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by doi' header="Digital Object Identifier"></Column>
                                <Column field="intendedAudience" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by audience' sortable header="Intended Audience"></Column>
                                <Column field="description" style={{ minWidth: '250px' }} sortable header="Description"></Column>
                                <Column field="indexing" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by indexing' sortable body={indexingBodyTemplate} header="Indexing"></Column>
                                <Column field="citationCount" style={{ minWidth: '250px' }} filter filterPlaceholder='Search by count' dataType='numeric' body={citationBodyTemplate} align={'center'} sortable header="Citation Count"></Column>
                                <Column field="bookUrl" style={{ minWidth: '200px' }} filter filterPlaceholder='Search by url' align={'center'} body={URLBodyTemplate} sortable header="Book URL"></Column>
                                <Column field="proof" style={{ minWidth: '200px' }} align={'center'} header="Proof" body={proofBodyTemplate}></Column>
                                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} header="Actions"></Column>
                            </DataTable>

                        </CardContent>

                    </Card>


                </div>
            </div>
        </div>
    )
}

export default BookChapterDisplay