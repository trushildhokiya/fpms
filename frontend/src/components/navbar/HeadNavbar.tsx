import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/svg/kjsitLogo.svg';
import { Sling as Hamburger } from 'hamburger-react';
import { Bell, ChevronDown } from 'lucide-react';
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

const HeadNavbar = () => {

    // HOOKS
    const [open, setOpen] = useState(false);
    const user = useSelector((state: any) => state.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // functions
    const logoutHead: Function = () => {

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
                        <Link to="/hod">Dashboard</Link>
                    </div>
                    <div className="mx-5">Others</div>
                    <div className="mx-5">

                        <DropdownMenu>

                            <DropdownMenuTrigger>
                                <span className="flex items-center">
                                    Research
                                    <span>
                                        <ChevronDown />
                                    </span>
                                </span>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56">

                                <DropdownMenuLabel>Research and Development</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    <DropdownMenuItem>Patents</DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Publications</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Article</DropdownMenuItem>
                                                <DropdownMenuItem>Conference</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Book</DropdownMenuItem>
                                                <DropdownMenuItem>Chapter in Book</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Others</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Projects</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Major Research</DropdownMenuItem>
                                                <DropdownMenuItem>Minor Research</DropdownMenuItem>
                                                <DropdownMenuItem>Consultancy</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Department</DropdownMenuItem>
                                                <DropdownMenuItem>Institute</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Others</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem>
                                        <Link to="/common/forms/consultancy">
                                            Consultancy
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="mx-5">
                        <Link to='/hod/notifications'>
                            <Bell />
                        </Link>
                    </div>
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
                                    <Link to='/hod/profile'>
                                        <DropdownMenuItem>
                                            Profile
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem>
                                        Personal Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>My Details</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Patent</DropdownMenuItem>
                                                <DropdownMenuItem>Publication</DropdownMenuItem>
                                                <DropdownMenuItem>Consultancy</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Projects</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Link to='/hod/immitate'>
                                        <DropdownMenuItem>
                                            Immitate
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to='/hod/users/faculty'>
                                        <DropdownMenuItem>
                                            Faculties
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to='/hod/notify'>
                                        <DropdownMenuItem>
                                            Notify
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { logoutHead() }}>Log out</DropdownMenuItem>
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
                <Link to="/hod">
                    <p className="my-2">Dashboard</p>
                </Link>
                <Separator />

                <div className="my-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <span className="flex items-center">
                                Research
                                <span>
                                    <ChevronDown />
                                </span>
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Research and Development</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Patents</DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Publications</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>Article</DropdownMenuItem>
                                            <DropdownMenuItem>Conference</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Book</DropdownMenuItem>
                                            <DropdownMenuItem>Chapter in Book</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Others</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Projects</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>Major Research</DropdownMenuItem>
                                            <DropdownMenuItem>Minor Research</DropdownMenuItem>
                                            <DropdownMenuItem>Consultancy</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Department</DropdownMenuItem>
                                            <DropdownMenuItem>Institute</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Others</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuItem>Consultancy</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Separator />
                <div className="">
                    <p className="my-2">Others</p>
                </div>

                <Separator />
                <div className=" my-2">
                    <Link to='/hod/notifications'>
                        <Bell />
                    </Link>
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
                                <Link to='/hod/profile'>
                                    <DropdownMenuItem>
                                        Profile
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem>
                                    Personal Details
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>My Details</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>Patent</DropdownMenuItem>
                                            <DropdownMenuItem>Publication</DropdownMenuItem>
                                            <DropdownMenuItem>Consultancy</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Projects</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Link to='/hod/immitate'>
                                    <DropdownMenuItem>
                                        Immitate
                                    </DropdownMenuItem>
                                </Link>
                                <Link to='/hod/users/faculty'>
                                    <DropdownMenuItem>
                                        Faculties
                                    </DropdownMenuItem>
                                </Link>
                                <Link to='/hod/notify'>
                                    <DropdownMenuItem>
                                        Notify
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { logoutHead() }}>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default HeadNavbar;
