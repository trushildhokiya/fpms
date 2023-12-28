import HeadNavbar from '@/components/navbar/HeadNavbar'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loadUserData } from '@/utils/functions/reduxFunctions';
import { useEffect } from 'react';


const Notifications = () => {

    useEffect(()=>{
        loadUserData()
    })

    interface ResearchNotification {
        title: string;
        description: string;
        imageUrl: string;
        referenceUrl: string;
    }

    const researchNotifications: ResearchNotification[] = [
        {
            title: 'Exciting Research Opportunity',
            description: 'Join our team in exploring new horizons in science and technology.',
            imageUrl: 'https://picsum.photos/1280/720',
            referenceUrl: 'https://www.cornell.edu/'
        },
        {
            title: 'Call for Papers',
            description: 'Submit your research papers for an upcoming conference.',
            imageUrl: 'https://picsum.photos/1080/720',
            referenceUrl: 'https://www.nature.com/'
        },
    ];

    return (
        <div>
            <HeadNavbar />
            <div className="container font-Poppins">

                <div className="my-10">
                    <span className=' text-2xl text-red-800 uppercase font-AzoSans md:text-4xl border-b-4 border-red-800'>
                        Notifications
                    </span>
                </div>

                <div className="w-full md:w-[50%] lg:w-[40%] mx-auto">
                    {
                        researchNotifications.map((post,index) => {
                            return (
                                <Card className='my-8' key={index}>
                                    <div className="h-[150px] rounded-t overflow-hidden brightness-75 ">
                                        <img src={post.imageUrl} className=' object-cover w-full h-full' alt="Research Image" />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className='text-gray-700 font-OpenSans leading-7'>
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='text-sm '>
                                        {post.description}
                                    </CardContent>
                                    <CardFooter className='flex justify-end'>
                                        <Button className='mx-5 bg-red-800'>
                                            <a href={post.referenceUrl} target='_blank'>
                                                See More
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Notifications