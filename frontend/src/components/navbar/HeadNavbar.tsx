import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/svg/kjsitLogo.svg';
import { Sling as Hamburger } from 'hamburger-react';
import { Bell, ChevronDown, Trophy } from 'lucide-react';
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
                            draggable={false}
                        />
                    </Link>
                </div>

                {/* LINKS  */}
                <div className="hidden md:flex mx-4 font-OpenSans font-semibold text-gray-600 items-center">
                    <div className="mx-5">
                        <Link to="/hod">Dashboard</Link>
                    </div>
                    <div className="mx-5">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <span className="flex items-center">
                                    Others
                                    <span>
                                        <ChevronDown />
                                    </span>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-56'>
                                <DropdownMenuLabel>Others</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Trophy className="mr-2 h-4 w-4" />
                                            <span>Achievements</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        Sttp/Fdp
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <Link to='/common/forms/sttp-conducted'>
                                                                <DropdownMenuItem>
                                                                    Conducted
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/forms/sttp-attended'>
                                                                <DropdownMenuItem>
                                                                    Attended
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/forms/sttp-organized'>
                                                                <DropdownMenuItem>
                                                                    Organized
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        Seminars
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <Link to='/common/forms/seminar-conducted'>
                                                                <DropdownMenuItem>
                                                                    Conducted
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/forms/seminar-attended'>
                                                                <DropdownMenuItem>
                                                                    Attended
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/forms/seminar-organized'>
                                                                <DropdownMenuItem>
                                                                    Organized
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <Link to='/common/forms/course-certification'>
                                                    <DropdownMenuItem>
                                                        Course Certification
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to='/common/forms/awards-recieved'>
                                                    <DropdownMenuItem>
                                                        Awards and Recognitions
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to='/common/forms/activity-conducted'>
                                                    <DropdownMenuItem>
                                                        Activity Conducted
                                                    </DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
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
                                    <Link to="/common/forms/patent">
                                        <DropdownMenuItem>
                                            Patent
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to="/common/forms/copyright">
                                        <DropdownMenuItem>
                                            Copyright
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Publications</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <Link to="/common/forms/journal">
                                                    <DropdownMenuItem>
                                                        Journal
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to="/common/forms/conference">
                                                    <DropdownMenuItem>
                                                        Conference
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <Link to="/common/forms/book">
                                                    <DropdownMenuItem>
                                                        Book
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to="/common/forms/book-chapter">
                                                    <DropdownMenuItem>
                                                        Book Chapter
                                                    </DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Projects</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <Link to="/common/forms/projects">
                                                    <DropdownMenuItem>
                                                        Major/Minor
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to="/common/forms/need-based-projects">
                                                    <DropdownMenuItem>
                                                        Need based
                                                    </DropdownMenuItem>
                                                </Link>

                                                <DropdownMenuSeparator />
                                                <Link to="/common/forms/awards-honors">
                                                    <DropdownMenuItem>
                                                        Awards/Honors
                                                    </DropdownMenuItem>
                                                </Link>

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
                        <Link to='/common/notifications'>
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
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Personal Details</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <Link to="/common/display/profile">
                                                    <DropdownMenuItem>
                                                        Basic
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to="/common/display/experience">
                                                    <DropdownMenuItem>
                                                        Experience
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to="/common/display/research-profile">
                                                    <DropdownMenuItem>
                                                        Research Profile
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to="/common/display/qualification">
                                                    <DropdownMenuItem>
                                                        Qualification
                                                    </DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>My Details</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger> Research </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuGroup>
                                                                <Link to='/common/display/patent'>
                                                                    <DropdownMenuItem>
                                                                        Patent
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/copyright'>
                                                                    <DropdownMenuItem>
                                                                        Copyright
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <Link to='/common/display/journal'>
                                                                    <DropdownMenuItem>
                                                                        Journal
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/conference'>
                                                                    <DropdownMenuItem>
                                                                        Conference
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/book'>
                                                                    <DropdownMenuItem>
                                                                        Book
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/book-chapter'>
                                                                    <DropdownMenuItem>
                                                                        Book Chapter
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <Link to='/common/display/projects'>
                                                                    <DropdownMenuItem>
                                                                        Major / Minor
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/need-based-projects'>
                                                                    <DropdownMenuItem>
                                                                        Need Based
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/awards-honors'>
                                                                    <DropdownMenuItem>
                                                                        Award/Honors
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <Link to='/common/display/consultancy'>
                                                                <DropdownMenuItem>
                                                                    Consultancy
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger> Achievements </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuGroup>
                                                                <Link to='/common/display/sttp-conducted'>
                                                                    <DropdownMenuItem>
                                                                        Sttp/Fdp Conducted
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/sttp-attended'>
                                                                    <DropdownMenuItem>
                                                                    Sttp/Fdp Attended
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/sttp-organized'>
                                                                    <DropdownMenuItem>
                                                                    Sttp/Fdp Organized
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <Link to='/common/display/seminar-conducted'>
                                                                    <DropdownMenuItem>
                                                                        Seminars Conducted
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/seminar-attended'>
                                                                    <DropdownMenuItem>
                                                                    Seminars Attended
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/seminar-organized'>
                                                                    <DropdownMenuItem>
                                                                    Seminars Organized
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <Link to='/common/display/course-certification'>
                                                                    <DropdownMenuItem>
                                                                        Course Certfication
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/awards-recieved'>
                                                                    <DropdownMenuItem>
                                                                        Awards and Recognitions
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/common/display/activity-conducted'>
                                                                    <DropdownMenuItem>
                                                                        Activity Conducted
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Department Details</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger> Research </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuGroup>
                                                                <Link to='/hod/display/patent'>
                                                                    <DropdownMenuItem>
                                                                        Patent
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/copyright'>
                                                                    <DropdownMenuItem>
                                                                        Copyright
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <Link to='/hod/display/journal'>
                                                                    <DropdownMenuItem>
                                                                        Journal
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/conference'>
                                                                    <DropdownMenuItem>
                                                                        Conference
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/book'>
                                                                    <DropdownMenuItem>
                                                                        Book
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/book-chapter'>
                                                                    <DropdownMenuItem>
                                                                        Book Chapter
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <Link to='/hod/display/projects'>
                                                                    <DropdownMenuItem>
                                                                        Major / Minor
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/need-based-projects'>
                                                                    <DropdownMenuItem>
                                                                        Need Based
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/awards-honors'>
                                                                    <DropdownMenuItem>
                                                                        Award/Honors
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <Link to='/hod/display/consultancy'>
                                                                <DropdownMenuItem>
                                                                    Consultancy
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger> Achievements </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuGroup>
                                                                <Link to='/hod/display/sttp-conducted'>
                                                                    <DropdownMenuItem>
                                                                        Sttp/Fdp Conducted
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/sttp-attended'>
                                                                    <DropdownMenuItem>
                                                                    Sttp/Fdp Attended
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/sttp-organized'>
                                                                    <DropdownMenuItem>
                                                                    Sttp/Fdp Organized
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <Link to='/hod/display/seminar-conducted'>
                                                                    <DropdownMenuItem>
                                                                        Seminars Conducted
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/seminar-attended'>
                                                                    <DropdownMenuItem>
                                                                    Seminars Attended
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/seminar-organized'>
                                                                    <DropdownMenuItem>
                                                                    Seminars Organized
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuGroup>
                                                                <Link to='/hod/display/course-certification'>
                                                                    <DropdownMenuItem>
                                                                        Course Certfication
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/awards-recieved'>
                                                                    <DropdownMenuItem>
                                                                        Awards and Recognitions
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <Link to='/hod/display/activity-conducted'>
                                                                    <DropdownMenuItem>
                                                                        Activity Conducted
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Link to={'/common/upload/bulk'}>
                                        <DropdownMenuItem>
                                            Bulk Upload
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
                                <Link to="/common/forms/patent">
                                    <DropdownMenuItem>
                                        Patent
                                    </DropdownMenuItem>
                                </Link>
                                <Link to="/common/forms/copyright">
                                    <DropdownMenuItem>
                                        Copyright
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Publications</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <Link to="/common/forms/journal">
                                                <DropdownMenuItem>
                                                    Journal
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to="/common/forms/conference">
                                                <DropdownMenuItem>
                                                    Conference
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuSeparator />
                                            <Link to="/common/forms/book">
                                                <DropdownMenuItem>
                                                    Book
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to="/common/forms/book-chapter">
                                                <DropdownMenuItem>
                                                    Book Chapter
                                                </DropdownMenuItem>
                                            </Link>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Projects</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <Link to="/common/forms/projects">
                                                <DropdownMenuItem>
                                                    Major/Minor
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to="/common/forms/need-based-projects">
                                                <DropdownMenuItem>
                                                    Need based
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuSeparator />
                                            <Link to="/common/forms/awards-honors">
                                                <DropdownMenuItem>
                                                    Awards/Honors
                                                </DropdownMenuItem>
                                            </Link>

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
                <Separator />
                <div className="">
                    <p className="my-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <span className="flex items-center">
                                    Others
                                    <span>
                                        <ChevronDown />
                                    </span>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-56'>
                                <DropdownMenuLabel>Others</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Trophy className="mr-2 h-4 w-4" />
                                            <span>Achievements</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        Sttp/Fdp
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <Link to='/common/forms/sttp-conducted'>
                                                                <DropdownMenuItem>
                                                                    Conducted
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/forms/sttp-attended'>
                                                                <DropdownMenuItem>
                                                                    Attended
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/forms/sttp-organized'>
                                                                <DropdownMenuItem>
                                                                    Organized
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        Seminars
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <Link to='/common/forms/seminar-conducted'>
                                                                <DropdownMenuItem>
                                                                    Conducted
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/forms/seminar-attended'>
                                                                <DropdownMenuItem>
                                                                    Attended
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/forms/seminar-organized'>
                                                                <DropdownMenuItem>
                                                                    Organized
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <Link to='/common/forms/course-certification'>
                                                    <DropdownMenuItem>
                                                        Course Certification
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to='/common/forms/awards-recieved'>
                                                    <DropdownMenuItem>
                                                        Awards and Recognitions
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link to='/common/forms/activity-conducted'>
                                                    <DropdownMenuItem>
                                                        Activity Conducted
                                                    </DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </p>
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
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Personal Details</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <Link to="/common/forms/profile">
                                                <DropdownMenuItem>
                                                    Basic
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to="/common/forms/experience">
                                                <DropdownMenuItem>
                                                    Experience
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to="/common/forms/research-profile">
                                                <DropdownMenuItem>
                                                    Research Profile
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to="/common/display/qualification">
                                                <DropdownMenuItem>
                                                    Qualification
                                                </DropdownMenuItem>
                                            </Link>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>My Details</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger> Research </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuGroup>
                                                            <Link to='/common/display/patent'>
                                                                <DropdownMenuItem>
                                                                    Patent
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/display/copyright'>
                                                                <DropdownMenuItem>
                                                                    Copyright
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuGroup>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuGroup>
                                                            <Link to='/common/display/journal'>
                                                                <DropdownMenuItem>
                                                                    Journal
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/display/conference'>
                                                                <DropdownMenuItem>
                                                                    Conference
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/display/book'>
                                                                <DropdownMenuItem>
                                                                    Book
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/display/book-chapter'>
                                                                <DropdownMenuItem>
                                                                    Book Chapter
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuGroup>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuGroup>
                                                            <Link to='/common/display/projects'>
                                                                <DropdownMenuItem>
                                                                    Major / Minor
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/display/need-based-projects'>
                                                                <DropdownMenuItem>
                                                                    Need Based
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to='/common/display/awards-honors'>
                                                                <DropdownMenuItem>
                                                                    Award/Honors
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuGroup>
                                                        <DropdownMenuSeparator />
                                                        <Link to='/common/display/consultancy'>
                                                            <DropdownMenuItem>
                                                                Consultancy
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger> Achievements </DropdownMenuSubTrigger>
                                            </DropdownMenuSub>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Link to={'/common/upload/bulk'}>
                                    <DropdownMenuItem>
                                        Bulk Upload
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
