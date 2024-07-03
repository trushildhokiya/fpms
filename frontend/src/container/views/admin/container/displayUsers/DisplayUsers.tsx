import AdminNavbar from '@/components/navbar/AdminNavbar';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface UserData {
    email: string;
    profileImage: string;
    department: string | null;
    institute: string;
}

const DisplayUsers = () => {
    const location = useLocation();

    useEffect(() => {
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
        const recordType = location.pathname.split('/users/')[1];

        axios.get(`/admin/data/${recordType}`, {
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

    const profileImageTemplate = (user: UserData) => {
        return (
            <Avatar>
                <AvatarImage src={user.profileImage} />
                <AvatarFallback>TD</AvatarFallback>
            </Avatar>
        );
    };

    return (
        <div>
            <AdminNavbar />
            <div className="container">
                <div className="my-10">
                    {
                        data.length > 0
                            ? (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-end">
                                                <Button className='bg-red-800' onClick={() => exportCSV(false)}>
                                                    Download
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <DataTable ref={dt} value={data} stripedRows size='large'>
                                                <Column field="profileImage" header="Image" body={profileImageTemplate}></Column>
                                                <Column field="email" header="Email" filter filterPlaceholder='search by email'></Column>
                                                <Column field="institute" header="Institute" filter filterPlaceholder='search by name'></Column>
                                                <Column field="department" filter filterPlaceholder='Search by department' header="Department"></Column>
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
