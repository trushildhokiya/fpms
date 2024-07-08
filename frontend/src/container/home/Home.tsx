import { Button } from '@/components/ui/button'
import CommonNavbar from '../../components/navbar/CommonNavbar'
import HourglassModel from '@/components/model/hourglass-model'
import { Link } from 'react-router-dom'
import Footer from '@/components/footer/footer'
import { DatabaseZap, Sheet, SquareTerminal } from 'lucide-react'

const Home = () => {
    return (
        <div>
            <CommonNavbar />

            <div className="grid md:grid-cols-2 md:h-[720px] my-10">
                <div className="py-10 flex justify-center items-center flex-wrap">
                    <div className="container ">
                        <h1 className='uppercase text-5xl text-red-800 font-AzoSans tracking-wide'> Faculty Profile </h1>
                        <h2 className='uppercase text-3xl my-2 text-red-800 font-AzoSans tracking-wide'>
                            Management System
                        </h2>

                        <p className='text-sm leading-7 font-Poppins text-gray-700 my-8 mb-10'>
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
                    <HourglassModel />
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

            </div>

            <Footer />

        </div>
    )
}

export default Home