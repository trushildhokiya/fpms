import { Button } from '@/components/ui/button'
import CommonNavbar from '../../components/navbar/CommonNavbar'
import { Suspense, lazy, useEffect, useState } from 'react';
const HourglassModel = lazy(() => import('@/components/model/hourglass-model'));
import { Link } from 'react-router-dom'
import Footer from '@/components/footer/footer'
import { DatabaseZap, Sheet, SquareTerminal } from 'lucide-react'
import Manual from '@/assets/pdf/manual.pdf'
import Loader from '@/utils/pages/Loader';
import TextTransition, { presets } from 'react-text-transition';

const Home = () => {

    const TEXTS = ['by', 'department of', 'Computer Engineering'];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(
            () => setIndex((index) => index + 1),
            3000, 
        );
        return () => clearTimeout(intervalId);
    }, []);

    return (
        <div>
            <CommonNavbar />

            <div className="grid md:grid-cols-2 md:h-[720px] my-10">
                <div className="py-10 flex justify-center items-center flex-wrap">
                    <div className="container ">

                        <h2 className='uppercase text-5xl text-red-800 font-AzoSans tracking-wide'> Faculty Profile </h2>
                        <h2 className='uppercase text-3xl my-2 text-red-800 font-AzoSans tracking-wide'>
                            Management System
                        </h2>

                        <div className='uppercase text-2xl my-6 text-red-800 font-AzoSans tracking-wide'>
                            <TextTransition springConfig={presets.wobbly}>{TEXTS[index % TEXTS.length]}</TextTransition>
                        </div>


                        <p className='text-base leading-7 font-Poppins text-gray-700 my-8 mb-10'>
                            Faculty Profile Management System" offers a centralized solution for academic institutions to efficiently manage and update faculty profiles. It enhances organizational efficiency by providing easy access to comprehensive faculty information, facilitating streamlined administrative processes, improved decision-making, and seamless report generation capabilities.
                        </p>

                       

                        <div className=" mt-10">
                            <Link to="/auth/register" className='w-full  flex justify-center '>
                                <Button className='text-xl md:w-1/2 w-full font-normal font-Poppins rounded-full bg-red-800 text-white hover:bg-red-900' size={'lg'}>Register</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="h-96 md:h-full">
                    <Suspense fallback={<Loader />}>
                        <HourglassModel />
                    </Suspense>
                </div>
            </div>

            <div className="container">

                <div className="my-10 mt-[10rem] py-10 bg-slate-50 rounded-xl">
                    <h2 className='text-red-800 uppercase font-bold font-AzoSans text-3xl  text-center'>
                        Manage tons of your data with ease
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 my-10 md:mt-[5rem]">
                        <div className="flex flex-col justify-center items-center">
                            <DatabaseZap className='w-12 h-12 fill-blue-800' />
                            <p className='my-3 font-bold font-Poppins break-words'>
                                Centralized Data Storage
                            </p>
                            <p className='mx-auto md:w-[70%] text-center font-Poppins text-sm leading-6 text-gray-600'>
                                Store all you data and get it at a single click
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <SquareTerminal className='w-12 h-12 stroke-violet-800' />
                            <p className='my-3 font-bold font-Poppins break-words'>
                                Kernel Navigation
                            </p>
                            <p className='mx-auto md:w-[70%] text-center font-Poppins text-sm leading-6 text-gray-600'>
                                Navigate and function throughout using kernel commands with ease
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <Sheet className='w-12 h-12 stroke-green-800' />
                            <p className='my-3 font-bold font-Poppins break-words'>
                                Advanced Reportings
                            </p>
                            <p className='mx-auto md:w-[70%] text-center font-Poppins text-sm leading-6 text-gray-600'>
                                Generate reports with advanced filters anytime
                            </p>
                        </div>
                    </div>
                </div>

                <div className='grid md:grid-cols-2 gap-6 my-10 mt-[5rem]'>
                    <div className="">
                        <iframe
                            title='fpms-manual'
                            src={Manual}  // Assuming Manual is the URL or source you want to load
                            className=' w-full md:w-[80%] h-96 md:h-full md:aspect-square rounded-3xl'
                        />
                    </div>
                    <div className="">

                        <h2 className='font-AzoSans font-bold text-3xl text-red-800 uppercase'>
                            Download Manual
                        </h2>
                        <div className="text-sm text-gray-800 font-Poppins leading-7 my-4 space-y-3">
                            <p>
                                Our software is designed to be user-friendly and intuitive, allowing you to navigate through features with ease. From managing profiles to generating reports, every function is crafted to enhance your productivity and streamline your workflow.
                            </p>
                            <p>
                                However, if you encounter any difficulties or have any questions, our comprehensive manual is here to help. It provides detailed instructions, step-by-step guides, and troubleshooting tips to ensure you can make the most out of our software.

                            </p>
                            <p>
                                Whether you're setting up your profile for the first time or exploring advanced features, the manual covers it all. We recommend keeping it handy for quick reference whenever needed.

                            </p>
                            <p>
                                If you need more assistance, please feel free to download and read the manual for detailed instructions and troubleshooting tips.

                            </p>
                        </div>


                    </div>
                </div>

            </div>

            <Footer />

        </div>
    )
}

export default Home