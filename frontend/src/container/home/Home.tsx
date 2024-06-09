import { useState } from 'react';
import CommonNavbar from '../../components/navbar/CommonNavbar'
import { Button } from '@/components/ui/button';
import { IoIosArrowForward,IoIosArrowBack } from "react-icons/io";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import Autoplay from "embla-carousel-autoplay"
  

const Home = () => {
    const carousel = [
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
        "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
        "https://fastly.picsum.photos/id/7/4728/3168.jpg?hmac=c5B5tfYFM9blHHMhuu4UKmhnbZoJqrzNOP9xjkV4w3o",
        "https://fastly.picsum.photos/id/12/2500/1667.jpg?hmac=Pe3284luVre9ZqNzv1jMFpLihFI6lwq7TPgMSsNXw2w",
    ];
    const awards = [
        {
            title: "Title1",
            awardBody: "Something"
        },
        {
            title: "Title2",
            awardBody: "Something"
        },
        {
            title: "Title3",
            awardBody: "Something"
        },
        {
            title: "Title4",
            awardBody: "Something"
        },
        {
            title: "Title5",
            awardBody: "Something"
        },
        {
            title: "Title6",
            awardBody: "Something"
        },
        {
            title: "Title7",
            awardBody: "Something"
        },
        {
            title: "Title8",
            awardBody: "Something"
        },
    ];

    const projects = [
        {
            title: "Title1",
            awardBody: "Something"
        },
        {
            title: "Title2",
            awardBody: "Something"
        },
        {
            title: "Title3",
            awardBody: "Something"
        },
        {
            title: "Title4",
            awardBody: "Something"
        },
    ];

    const [cindex,setCindex] = useState(0);

    return (
        <div>
            <CommonNavbar />
            {/* <div className='bg-slate-300 h-[70vh] relative'>
                <div className='absolute top-[45%] left-3 cursor-pointer text-white' onClick={ () => cindex == 0 ? setCindex(cindex) : setCindex(cindex-1)}><IoIosArrowBack size={40}/></div>
                <div className='absolute top-[45%] right-3 cursor-pointer text-white' onClick={ () => cindex == carousel.length-1 ? setCindex(cindex) : setCindex(cindex+1)}><IoIosArrowForward size={40}/></div>
                <img src={carousel[cindex]} className='w-full h-[70vh] transition-shadow '/>
            </div> */}

            <Carousel
                plugins={[
                    Autoplay({
                    delay: 4000,
                    stopOnInteraction: true
                    }),
                ]}
                className='relative'
              >
                <CarouselContent>
                    {carousel.map((car) => {
                        return(
                            <CarouselItem><img src={car} className='w-full h-[70vh] transition-shadow '/></CarouselItem>
                        )
                    })}
                </CarouselContent>
                <CarouselPrevious className='absolute top-1/2 left-2 z-10' />
                <CarouselNext className='absolute top-1/2 right-2 z-10' />
            </Carousel>


            <div className='flex max-md:flex-col gap-4 justify-around w-full p-4 pt-8'>
                <div className='bg-slate-100 p-4 rounded-md'>
                    <div className='font-semibold text-2xl text-slate-700 mb-4 ml-2'>Recent Awards</div>
                    <div className='grid grid-cols-2 max-lg:flex max-lg:flex-col max-lg:justify-center gap-4 px-2'>
                        {awards.map((award) => {
                            return(
                                <div id='card' className='bg-slate-300 py-2 px-4 rounded-md w-96 max-md:w-full max-lg:w-72 hover:cursor-pointer hover:bg-slate-600 hover:text-white transition-all duration-500'>
                                    <div className='text-xl hover:underline hover:font-semibold'>{award.title}</div>
                                    <div>{award.awardBody}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <div className='bg-slate-100 p-4 rounded-md relative'>
                        <div className='font-semibold text-2xl text-slate-700 mb-4 ml-2'>Recent Projects</div>
                        <div className='flex flex-col gap-4 px-2'>
                            {projects.map((project) => {
                                return(
                                    <div id='card' className='bg-slate-300 py-2 px-4 rounded-md w-96 max-md:w-full max-lg:w-72 hover:cursor-pointer hover:bg-slate-600 hover:text-white transition-all duration-500'>
                                        <div className='text-xl hover:underline hover:font-semibold'>{project.title}</div>
                                        <div>{project.awardBody}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='flex w-full justify-end'>
                            <Button className='bg-slate-600 mt-4 mx-2'>View More...</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home