import React from 'react'
import CommonNavbar from '../../components/navbar/CommonNavbar'
import LoginIllustration from '../../assets/svg/login.svg'

const Login = () => {
    return (
        <div>
            <CommonNavbar />

            <div className='md:grid grid-cols-2'>

                {/* LOGIN FORM  */}
                <div className='my-10'>
                    
                    <div className='bg-white shadow-xl w-[90%] mx-auto p-5'>
                        <h1 className='text-center text-3xl font-AzoSans text-gray-500 tracking-wider '>
                            LOGIN
                        </h1>
                        <form className='my-5 mx-6'>

                            <div className='font-Poppins'>
                                <p className='text-red-800 text-xl '>
                                 Somaiya ID
                                </p>
                                <input
                                    type='email'
                                    placeholder='trushil.d@somaiya.edu'
                                    
                                />
                            </div>

                            <div>
                                <p className='text-xl text-red-800'>
                                    Password
                                </p>
                                <input type='password' placeholder='********'/>
                            </div>

                            <button>
                                Submit
                            </button>

                        </form>
                    </div>
                </div>

                {/* IMAGE */}
                <div className='p-3 hidden md:block '>
                    <div className='flex justify-center'>
                        <img src={LoginIllustration} alt='geometric-illustrations' className='w-[80%] drop-shadow-2xl h-auto' />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login