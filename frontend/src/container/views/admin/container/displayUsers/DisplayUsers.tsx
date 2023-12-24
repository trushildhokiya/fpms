import AdminNavbar from '@/components/navbar/AdminNavbar';
import { loadUserData } from '@/utils/functions/reduxFunctions';
import { useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from '@/components/ui/button';


interface UserData {
    profileImage: string;
    email: string;
    name: string;
    department: string;
}

const DisplayUsers = () => {

    useEffect(() => {
        loadUserData();
    }, []);

    const dt = useRef<DataTable>(null)
    const exportCSV = (selectionOnly:boolean) => {
        dt.current.exportCSV({ selectionOnly });
    };


    const data: UserData[] = [
        {
            profileImage: 'https://via.placeholder.com/150',
            email: 'john.doe@example.com',
            name: 'John Doe',
            department: 'Computer',
        },
        {
            profileImage: 'https://via.placeholder.com/150',
            email: 'jane.smith@example.com',
            name: 'Jane Smith',
            department: 'Artificial Intelligence and Data Science',
        },
        {
            profileImage: 'https://i.pinimg.com/736x/dd/97/3a/dd973ac116a977c8dd5296b0da504b8c.jpg',
            email: 'bob.jones@example.com',
            name: 'Bob Jones',
            department: 'Information Technology',
        },
        {
            profileImage: 'https://via.placeholder.com/150',
            email: 'alice.johnson@example.com',
            name: 'Alice Johnson',
            department: 'Electronics and Telecommunication',
        },
    ];

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
                <Card>
                    <CardHeader>
                        <div className="flex justify-end">
                        <Button onClick={()=>exportCSV(false)}>
                            Download
                        </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable ref={dt} value={data} stripedRows size='large'>
                            <Column field="profileImage" header="Image" body={profileImageTemplate}></Column>
                            <Column field="email" header="Email"></Column>
                            <Column field="name" header="Name" filter filterPlaceholder='search by name'></Column>
                            <Column field="department" header="Department"></Column>
                        </DataTable>
                    </CardContent>
                </Card>
                </div>
            </div>
        </div>
    );
};

export default DisplayUsers;
