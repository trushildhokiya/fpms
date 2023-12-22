import { useState } from 'react'
import { Link } from "react-router-dom";
import Logo from '../../assets/svg/kjsitLogo.svg'
import { Sling as Hamburger } from 'hamburger-react'
import { Separator } from '@/components/ui/separator';

const CommonNavbar = () => {

    // HOOKS 
    const [open, setOpen] = useState(false)

    return (
        <div>
            <div className='flex p-2 items-center justify-between'>
                {/* LOGO */}
                <div>
                    <Link to='/'>
                        <img src={Logo} className='w-28 md:w-44 h-auto' alt='kjsit-logo' />
                    </Link>
                </div>

                {/* LINKS  */}
                <div className='hidden md:flex mx-4'>
                    <div className='mx-3'>
                        <Link to='/'>
                            Home
                        </Link>
                    </div>
                    <div className='mx-3'>
                        <Link to='/about'>
                            About
                        </Link>
                    </div>
                    <div className='mx-3'>
                        <Link to='/auth/login'>
                            Login
                        </Link>
                    </div>
                </div>

                {/* Hamburger Icon  */}
                <div className='block md:hidden'>
                    <Hamburger size={20} direction='left' duration={0.8} toggled={open} toggle={setOpen} />
                </div>
            </div>
            <div className={`md:hidden ${open ? "block" : "hidden"} p-2 mx-3 shadow-xl`}>
                <Link to='/'>
                    <p className='my-1'>Home</p>
                </Link>
                <Separator />
                <Link to='/about'>
                    <p className='my-1'>About</p>
                </Link>
                <Separator />
                <Link to='/auth/login'>
                    <p className='my-1'>Login</p>
                </Link>
                <Separator />
                <Link to='/auth/register'>
                    <p className='my-1'>Register</p>
                </Link>
            </div>
        </div>
    )
}

export default CommonNavbar