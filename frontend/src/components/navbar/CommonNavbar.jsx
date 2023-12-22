import React,{ useState } from 'react'
import Logo from '../../assets/svg/kjsitLogo.svg'
import { Sling as Hamburger } from 'hamburger-react'

const CommonNavbar = () => {

    // HOOKS 
    const [open, setOpen] = useState(false)

    return (
        <div>
            <div className='flex p-2 items-center justify-between'>
                {/* LOGO */}
                <div>
                    <img src={Logo} className='w-28 md:w-44 h-auto' alt='kjsit-logo' />
                </div>

                {/* LINKS  */}
                <div className='hidden md:flex mx-4'>
                    <div className='mx-3'>Home</div>
                    <div className='mx-3'>About</div>
                    <div className='mx-3'>Login</div>
                </div>

                {/* Hamburger Icon  */}
                <div className='block md:hidden'>
                    <Hamburger size={20} direction='left' duration={0.8} toggled={open} toggle={setOpen} />
                </div>
            </div>
            <div className={`md:hidden ${open? "block" : "hidden"} p-2 mx-3 `}>
                <p>Home</p>
                <p>About</p>
                <p>Login</p>
            </div>
        </div>
    )
}

export default CommonNavbar