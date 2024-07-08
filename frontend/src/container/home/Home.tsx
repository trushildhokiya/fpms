import { Button } from '@/components/ui/button'
import CommonNavbar from '../../components/navbar/CommonNavbar'
import HourglassModel from '@/components/model/hourglass-model'
import { Link } from 'react-router-dom'
import Footer from '@/components/footer/footer'

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

            <Footer />

        </div>
    )
}

export default Home