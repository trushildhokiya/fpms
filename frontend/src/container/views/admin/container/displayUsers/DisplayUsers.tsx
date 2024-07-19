import AdminNavbar from '@/components/navbar/AdminNavbar';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'lucide-react';

interface Profile {
    name: string;
    department: string;
    designation: string;
    contact: number;
    email: string;
    alternateContact: number;
    alternateEmail: string;
}

interface Experience {
    experienceType: string;
    organizationName: string;
    organizationAddress: string;
    organizationUrl: string;
    designation: string;
    fromDate: Date;
    toDate: Date;
    experienceIndustry: string;
    experienceProof: string;
}

interface Research {
    name: string;
    department: string;
    designation: string;
    contact: number;
    email: string;
    googleScholarId: string;
    googleScholarUrl: string;
    scopusId: string;
    scopusUrl: string;
    orcidId: string;
    hIndexGoogleScholar: string;
    hIndexScopus: string;
    citationCountGoogleScholar: number;
    citationCountScopus: number;
    iTenIndexGoogleScholar: string;
    iTenIndexScopus: string;
}

interface Qualification {
    degree: string;
    stream: string;
    institute: string;
    university: string;
    year: number;
    class: string;
    status: string;
}

interface UserData {
    email: string;
    password: string;
    institute?: string;
    profileImage?: string;
    role: string;
    department: string;
    tags?: string[];
    profile?: Profile;
    experience?: Experience[];
    researchProfile?: Research;
    qualification?: Qualification[];
    journal?: string[];
    conference?: string[];
    book?: string[];
    bookChapter?: string[];
    patent?: string[];
    copyright?: string[];
    consultancy?: string[];
    projects?: string[];
    awardsHonors?: string[];
    needBasedProjects?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const DisplayUsers = () => {

    const location = useLocation();
    const [recordType, setRecordType] = useState("")
    const [totalRecords, setTotalRecords] = useState(0)


    useEffect(() => {

        setRecordType(location.pathname.split('/users/')[1])
        getData();

    }, [location]);

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

    const getData = () => {

        const type = location.pathname.split('/users/')[1]

        axios.get(`/admin/data/${type}`, {
            headers: {
                'token': localStorage.getItem('token')
            }
        })
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [data, setData] = useState<UserData[]>([]);

    const dt = useRef<any>(null);

    const exportCSV = (selectionOnly: boolean) => {
        dt.current!.exportCSV({ selectionOnly });
    };

    const nameBodyTemplate = (user: UserData) => {
        return (
            <div className="flex items-center flex-wrap">
                <Avatar>
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>TD</AvatarFallback>
                </Avatar>
                <p className="ml-2  text-gray-700">{user.profile?.name ? user.profile.name : "Incomplete profile"}</p>
            </div>
        );
    };

    const header = (
        <div className="flex w-full justify-end gap-6 flex-wrap font-Poppins">
            <Button className='rounded-full bg-green-600' onClick={() => exportCSV(false)}>
                <Table className='w-5 h-5 mr-2' /> Download
            </Button>
        </div>
    );

    const footerTemplate = () => {
        return "Total Records Matched: " + totalRecords; // Access total records here
    };


    return (
        <div className=''>
            <AdminNavbar />
            <div className="container">
                <div className="my-10 font-Poppins">
                    {
                        data.length > 0
                            ? (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className='tracking-wide font-bold text-gray-700 text-3xl py-2'>
                                                {recordType==="faculty"? "Faculty" : recordType==="admin" ? "Admin" : "Head of Department"} Details
                                            </CardTitle>
                                            <CardDescription>Deatils of users are shown below</CardDescription>
                                        </CardHeader>
                                        <CardContent className='my-10'>
                                            <DataTable
                                             ref={dt} value={data} showHeaders  showGridlines size='large' exportFilename={`${recordType}-data`}
                                             paginator rows={5} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" rowsPerPageOptions={[5, 10, 25, 50]}
                                             header={header} removableSort footer={footerTemplate} onValueChange={(e)=>setTotalRecords(e.length)}
                                             >
                                                <Column style={{ minWidth: '250px' }} sortable field="profile.name" header="Name" filter filterPlaceholder='search by name' body={nameBodyTemplate}></Column>
                                                <Column style={{ minWidth: '250px' }} sortable field="email" header="Email Address" filter filterPlaceholder='search by email'></Column>
                                                <Column style={{ minWidth: '250px' }} sortable field="institute" header="Institute" filter filterPlaceholder='search by name'></Column>
                                                <Column style={{ minWidth: '250px' }} sortable field="department" filter filterPlaceholder='Search by department' header="Department"></Column>
                                                <Column style={{ minWidth: '250px' }} sortable field="profile.designation" filter filterPlaceholder='Search by designation' header="Designation"></Column>
                                                <Column style={{ minWidth: '250px' }} sortable field="profile.contact" filter filterPlaceholder='Search by contact' dataType='numeric' header="Contact"></Column>
                                            
                                            </DataTable>
                                        </CardContent>
                                    </Card>
                                </>
                            )
                            : (
                                <div className='text-xl'>
                                    <Card>
                                        <CardHeader>
                                            No Records found
                                        </CardHeader>
                                    </Card>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default DisplayUsers;
