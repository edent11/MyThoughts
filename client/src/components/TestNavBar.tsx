import React, { useContext, useEffect, useState, useRef } from 'react'
import ReactDOM from "react-dom";

import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BsGlobeAmericas } from "react-icons/bs";
import { useAuth } from '../contexts/UserAuth';
import { useTheme } from '../contexts/ThemeProvider';
import NotificationsBar from './NotificationsBar';
import useSWR from 'swr';
import axios from 'axios';
import { fetcherData } from './shared/utils';


const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));


const TestNavBar = () => {


    const user = useAuth();
    const theme = useTheme();
    const userProfile = user.getUser();
    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState<Boolean>(false);



    const { data: unReadNotificationsNumber, error } = useSWR('http://localhost:5000/users/unreadNotificationsCount/',
        url => fetcherData(url, { session_token: user.getUser()?.session_token }), {
        refreshInterval: 1000
    });



    const containerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        // Attach event listener when component mounts
        document.addEventListener('mousedown', handleClickOutside);


        // Detach event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);




    return (
        <div
            id="mainContainer"
            className={`box-border  relative font-signika border-b-2 px-8 shadow-lg border-white
             dark:from-gray-700 dark:to-gray-900 bg-gradient-to-r from-purple-700 to-purple-900 
             w-full flex flex-row justify-between  h-16 
              text-white`}>

            <div
                id="LogoText"
                className={` font-bold text-base flex flex-row gap-6 `}>

                <div className='self-center cursor-pointer'>

                    <p className={`rounded-md py-2 px-2 bg-gradient-to-br
                  dark:from-purple-500  dark:to-purple-700 from-blue-900 to-blue-950`}> MyThoughts </p>

                </div>

                {
                    user.isAuthenticated() &&
                    <div

                        className='rounded space-y-10 relative top-3 self-baseline gap-5 px-2
                         light:bg-gradient-to-r light:from-blue-900 light:to-blue-950 bg-gradient-to-r from-gray-900 to-blue-950'>

                        {/* onClick={() => setTsDropDownVisible(true)}> */}


                        <div className='p-1 flex flex-row items-center gap-6 cursor-pointer'>

                            <img
                                src={userProfile?.avatar}
                                alt="avatar"
                                className='size-8 ring-2 rounded-full ring-green-200 shadow-xl' />
                            <p>{userProfile?.username}</p>

                            <div className='relative'>

                                <BsGlobeAmericas size={20} onClick={() => setShowNotifications(showNotifications => !showNotifications)}>

                                </BsGlobeAmericas>
                                {unReadNotificationsNumber > 0 &&
                                    <span className="absolute -top-1 -right-2 justify-center items-center flex
                                     bg-purple-500 text-white text-sm rounded-full size-[15px]">
                                        {unReadNotificationsNumber.toString()}
                                    </span>
                                }
                                {
                                    showNotifications &&
                                    <div ref={containerRef} >

                                        <NotificationsBar className='absolute' />
                                    </div>
                                }



                            </div>



                            {/* {
                                isDropDownVisible ? <IoIosArrowUp /> : <IoIosArrowDown />
                            } */}


                        </div>


                        {/* <div
                            id="dropdown"
                            ref={containerRef}
                            className={`z-10  ${isDropDownVisible ? 'block' : 'hidden'}  bg-theme_purple text-white
                                        divide-y divide-gray-900 gap-10 rounded-lg shadow w-44 dark:bg-gray-700`}>

                            <ul className="py-2 text-sm text-whit dark:text-gray-200 divide-gray-200 divide-y-[0.1rem]" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <a href="#" className="block animate-bounce px-4 cursor-pointer py-2 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-theme_purple dark:hover:text-white">Dashboard</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 animate-bounce hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-theme_purple dark:hover:text-white">Settings</a>
                                </li>
                                <li>
                                    <a href="#" className="block animate-bounce px-4 py-2 hover:bg-gray-100 dark:hover:bg-theme_purple hover:text-gray-900 dark:hover:text-white">Earnings</a>
                                </li>
                                <li>
                                    <p
                                        className="block cursor-pointer animate-bounce px-4 py-2 hover:bg-gray-100 dark:hover:bg-theme_purple hover:text-gray-900 dark:hover:text-white"
                                        onClick={
                                            async () => {
                                                await user.logout();
                                                navigate('/home');
                                                window.location.reload();
                                            }}
                                    >Sign out</p>
                                </li>
                            </ul>
                        </div> */}

                    </div>

                }


            </div>


            <div
                id="Navigation"
                className='relative mr-20 self-center'>

                <ul className='flex flex-row items-center text-sm gap-6 font-bold '>
                    <li className={`dark:bg-purple-600 bg-blue-950 rounded-sm px-2 py-1 ring-white hover:ring-1`}>
                        <a href="/">Home</a>
                    </li>

                    <li className={user.isAuthenticated() ? 'hidden' : ''}>
                        <a href='/login'
                            className={` no-underline dark:hover:text-purple-400  dark:no-underline hover:underline hover:underline-offset-4`}
                        >{'Login'}</a>
                    </li>


                    <li className={user.isAuthenticated() ? '' : 'hidden'}>
                        <a href="/newThought"
                            className={` no-underline dark:hover:text-purple-400  dark:no-underline hover:underline hover:underline-offset-4`}
                        >Add Thought</a>
                    </li>

                    <li className={user.isAuthenticated() ? '' : 'hidden'} onClick={
                        async () => {
                            await user.logout();
                            navigate('/login');
                            window.location.reload();
                        }}>
                        <p
                            className={` no-underline dark:hover:text-purple-400  dark:no-underline hover:underline hover:underline-offset-4`}
                        >logout</p>
                    </li>

                    <FormGroup>
                        <FormControlLabel
                            control={<MaterialUISwitch sx={{ m: 1 }} checked={theme?.isDarkMode()} onChange={() => theme?.toggle()} />}
                            label=""
                        />
                    </FormGroup>

                </ul>


            </div>

        </div>
    )
}

export default TestNavBar