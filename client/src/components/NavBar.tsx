import React, { useContext } from 'react'
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '../contexts/ThemeProvider';
import { useNavigate } from 'react-router-dom';

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


const NavBar = () => {

    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <div
            id="mainContainer"
            className={`box-border bg-gradient-to-r relative font-signika border-b-2 px-8 shadow-lg border-white
             ${theme?.isDarkMode() ? 'from-gray-700 to-gray-900' : 'from-purple-700 to-purple-900 '} 
             w-full flex flex-row justify-between items-center h-16 cursor-pointer
              text-white`}
           
        >

            <div
                id="LogoText"
                className={` font-bold text-base flex flex-row items-center gap-6 `}>

                <p className={`rounded-md py-2 px-2 bg-gradient-to-br
                 ${theme?.isDarkMode() ? 'from-purple-500 to-purple-700' : 'from-blue-900 to-blue-950'} `}> MyMovies </p>

                <FormGroup>
                    <FormControlLabel
                        control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked onChange={() => theme?.toggle()} />}
                        label=""
                    />
                </FormGroup>
            </div>



            <div
                id="Navigation"
                className='relative mr-20'>

                <ul className='flex flex-row items-center text-sm gap-6 font-bold '>
                    <li className={`${theme?.isDarkMode() ? 'bg-purple-600' : 'bg-blue-950'} rounded-sm px-2 py-1 ring-white hover:ring-1`}>
                        <a href="/">Home</a>
                    </li>

                    <li className=''>
                        <a href="/login"
                            className={` no-underline ${theme?.isDarkMode() ? 'hover:text-purple-400 no-underline' : ' hover:underline hover:underline-offset-4 '}`}
                        >Login</a>
                    </li>


                    <li>
                        <a href="/login"
                            className={` no-underline ${theme?.isDarkMode() ? 'hover:text-purple-400 no-underline' : ' hover:underline hover:underline-offset-4 '}`}
                        >My</a>
                    </li>

                </ul>


            </div>

        </div>
    )
}

export default NavBar