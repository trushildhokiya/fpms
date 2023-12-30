import HeadNavbar from "@/components/navbar/HeadNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, BadgeX } from "lucide-react"

const Faculty = () => {


    const data = [
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty1@example.com',
            department: 'Computer',
            tags: ['inactive', 'incomplete profile'],
            verified: false,
        },
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty2@example.com',
            department: 'Computer',
            tags: ['active', 'complete profile'],
            verified: true,
        },
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty3@example.com',
            department: 'Computer',
            tags: ['inactive', 'incomplete profile'],
            verified: false,
        },
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty4@example.com',
            department: 'Computer',
            tags: ['active', 'complete profile'],
            verified: true,
        },
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty5@example.com',
            department: 'Computer',
            tags: ['inactive', 'incomplete profile'],
            verified: false,
        },
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty6@example.com',
            department: 'Computer',
            tags: ['active', 'complete profile'],
            verified: true,
        },
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty7@example.com',
            department: 'Computer',
            tags: ['inactive', 'incomplete profile'],
            verified: false,
        },
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty8@example.com',
            department: 'Computer',
            tags: ['active', 'complete profile'],
            verified: true,
        },
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty9@example.com',
            department: 'Computer',
            tags: ['inactive', 'incomplete profile'],
            verified: false,
        },
        {
            profileImage: 'https://picsum.photos/500',
            email: 'faculty10@example.com',
            department: 'Computer',
            tags: ['active', 'complete profile'],
            verified: true,
        },
    ];

    const dt = useRef<any>(null)

    const profileImageTemplate = (option: any) => {
        return (
            <>
                <Avatar>
                    <AvatarImage src={option.profileImage} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </>
        )
    }

    const tagsTemplate = (option:any)=>{
        return(
            <>
                {
                    option.tags.map((item:string, index:number)=>{
                        return(
                            <div className="my-1 " key={index}>
                                <Badge className={`${item==='active' || item==='complete profile'? 'bg-emerald-500':'bg-rose-500'}`}> {item} </Badge>
                            </div>
                        )
                    })
                }
            </>
        )
    }
    
    const verifiedTemplate = (option:any)=>{
        return(
            <>
                {option.verified? <BadgeCheck color="#00a303" /> : <BadgeX color="#c80404" />}
            </>
        )
    }

    const exportCSV = (selectionOnly:boolean) => {
        dt.current.exportCSV({ selectionOnly });
    };


    return (
        <div>
            <HeadNavbar />
            <div className="container">

                <Card className="my-10">
                    <CardHeader>
                        <CardTitle className="font-AzoSans text-2xl md:text-4xl text-red-800 uppercase">
                            Faculty List
                        </CardTitle>
                        <CardDescription className="flex justify-end mx-4">
                            <Button className="bg-red-800"  onClick={() => exportCSV(false)} > Download </Button>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="my-2">
                        <DataTable ref={dt} value={data} size="large" paginator rows={5} filterDisplay="row" >
                            <Column field="profileImage" header="Image" body={profileImageTemplate}></Column>
                            <Column field="email" header="Email" filter filterPlaceholder="Seach By Email"></Column>
                            <Column field="department" header="Department"></Column>
                            <Column field="tags" header="Tags" body={tagsTemplate} filter filterPlaceholder="Select tags"></Column>
                            <Column field="verified" header="Verified" body={verifiedTemplate} filter filterPlaceholder="Filter by verification (T/F)" dataType="boolean"></Column>
                        </DataTable>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default Faculty