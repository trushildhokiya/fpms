import AdminNavbar from '@/components/navbar/AdminNavbar';
import { loadUserData } from '@/utils/functions/reduxFunctions';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
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
        loadUserData();
        getData();
    }, [location]);

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

    const dt = useRef<DataTable>(null);

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
