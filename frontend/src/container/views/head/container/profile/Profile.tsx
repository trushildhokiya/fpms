import HeadNavbar from "@/components/navbar/HeadNavbar"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadUserData } from "@/utils/functions/reduxFunctions"
import { useEffect } from "react"
import { useSelector } from "react-redux"

const Profile = () => {

    useEffect(() => {
        loadUserData()
    }, [])

    const user = useSelector((state: any) => state.user)

    return (
        <div>
            <HeadNavbar />
            <div className="container">
                
                <div className="my-10">

                <Card className="lg:w-[60%] md:w-[70%] w-full mx-auto">
                    <CardHeader>
                        <CardTitle>
                            <p className="font-OpenSans my-2 text-gray-900">
                                My Profile
                            </p>
                        </CardTitle>
                        <CardDescription>
                            To edit your avatar click on the avator and upload new image
                        </CardDescription>
                    </CardHeader>
                </Card>

                </div>
            </div>
        </div>
    )
}

export default Profile