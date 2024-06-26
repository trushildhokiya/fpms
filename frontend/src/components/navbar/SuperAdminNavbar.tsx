import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/svg/kjsitLogo.svg';
import { Sling as Hamburger } from 'hamburger-react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Separator } from '@/components/ui/separator';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/features/user/userSlice';

const SuperAdminNavbar = () => {

    // HOOKS
    const [open, setOpen] = useState(false);
    const user = useSelector((state: any) => state.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // functions
    const logoutAdmin: Function = () => {

        localStorage.removeItem('token')
        dispatch(logout())
        navigate('/auth/login')
    }

    return (
        <div>
            <div className="flex p-2 items-center justify-between">
                {/* LOGO */}
                <div>
                    <Link to="/">
                        <img
                            src={Logo}
                            className="w-28 md:w-44 h-auto"
                            alt="kjsit-logo"
                        />
                    </Link>
                </div>

                {/* LINKS  */}
                <div className="hidden md:flex mx-4 font-OpenSans font-semibold text-gray-600 items-center">
                    <div className="mx-5">
                        <Link to="/superadmin">Dashboard</Link>
                    </div>
                    <Link className='mx-5' to="/superadmin/add">
                        <p className="my-2">Add Users</p>
                    </Link>

                    <Link className='mx-5' to="/superadmin/toggle">
                        <p className="my-2">Toggle Users</p>
                    </Link>
                    <div className="mx-5">Others</div>
                    
                    <div className="mx-5 mr-[2rem]">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage
                                        src={user.profileImage ? user.profileImage : ''}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Link to='/admin/profile'>
                                        <DropdownMenuItem>
                                            Profile
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Link to='/admin/add-users'>
                                        <DropdownMenuItem>
                                            Add Users
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Show Users</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <Link to='/admin/users/admin'>
                                                    <DropdownMenuItem>
                                                        Admin
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to='/admin/users/head'>
                                                    <DropdownMenuItem>
                                                        Head Of Department
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to='/admin/users/faculty'>
                                                    <DropdownMenuItem>
                                                        Faculty
                                                    </DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { logoutAdmin() }}>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Hamburger Icon  */}
                <div className="block md:hidden">
                    <Hamburger
                        size={20}
                        direction="left"
                        duration={0.8}
                        toggled={open}
                        toggle={setOpen}
                    />
                </div>
            </div>
            <div
                className={`md:hidden ${open ? 'block' : 'hidden'} p-2 mx-3 shadow-xl font-OpenSans text-gray-600 font-semibold`}
            >
                <Link to="/superadmin">
                    <p className="my-2">Dashboard</p>
                </Link>

                
                <Separator />

                <Link to="/superadmin/add">
                    <p className="my-2">Add Users</p>
                </Link>

                
                <Separator />

                <Link to="/superadmin/toggle">
                    <p className="my-2">Toggle Users</p>
                </Link>

                
                <Separator />
                <div className="">
                    <p className="my-2">Others</p>
                </div>

                <Separator />
                <div className="my-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage
                                    src={user.profileImage ? user.profileImage : ''}
                                />
                                <AvatarFallback>TD</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Link to='/admin/profile'>
                                    <DropdownMenuItem>
                                        Profile
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Link to='/admin/add-users'>
                                    <DropdownMenuItem>
                                        Add Users
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Show Users</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <Link to='/admin/users/admin'>
                                                <DropdownMenuItem>
                                                    Admin
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to='/admin/users/head'>
                                                <DropdownMenuItem>
                                                    H.O.D
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to='/admin/users/faculty'>
                                                <DropdownMenuItem>
                                                    Faculty
                                                </DropdownMenuItem>
                                            </Link>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { logoutAdmin() }}>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminNavbar;
