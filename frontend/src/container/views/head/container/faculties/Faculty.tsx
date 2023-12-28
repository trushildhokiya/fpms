import HeadNavbar from "@/components/navbar/HeadNavbar"
import { loadUserData } from "@/utils/functions/reduxFunctions"
import { useEffect } from "react"

const Faculty = () => {

    useEffect(() => {
        loadUserData()
    }, [])


    return (
        <div>
            <HeadNavbar />
            <div className="container">

                <h2>
                    Faculties list
                </h2>

            </div>
        </div>
    )
}

export default Faculty