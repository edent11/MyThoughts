import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeProvider';




const UserBox = () => {

    const theme = useTheme();
    const [isRegister, setIsRegister] = useState(false);

    return (
        <div id="signIn"
            className={`rounded-xl font-signika border-regular my-auto m-auto shadow-purple-600 shadow-lg  border-white border-2
                       w-[600px] bg-gradient-to-br p-1 flex flex-col items-center font-bold
                       ${theme?.isDarkMode() ? 'from-gray-700 to-gray-800 text-white' : 'from-gray-200 to-gray-300 text-black'}`}>



            <p className={`${isRegister ? '' : 'hidden'} bg-gradient-to-r animate-expand from-indigo-500 via-purple-500 to-purple-700 text-white 
            w-full text-center rounded-xl text-2xl`}>Register</p>

            <p className={`${isRegister ? 'hidden' : ''} bg-gradient-to-r none animate-expand from-indigo-500 via-purple-500 to-purple-700 text-white 
            w-full text-center rounded-xl text-2xl`}>Login</p>



            <div className='mb-10'>

                <form action="#">

                    <div className='flex flex-col text-sm items-center justify-center gap-6 mt-10'>



                        <input className='text-black rounded-xl p-2 h-6 w-[24vw] max-w-[12rem] bg-opacity-10'
                            type="email"
                            placeholder='Email'
                            required />


                        <input className='text-black  rounded-xl p-2 h-6 w-[24vw] max-w-[12rem] bg-opacity-10'
                            type="password"
                            placeholder='Password'
                            required />

                        {
                            !isRegister &&
                            <p>Don't have an account? <span
                                className=' cursor-pointer underline hover:text-purple-400'
                                onClick={() => setIsRegister(true)}
                            >Register here</span></p>
                        }




                        <button className='bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:bg-gradient-to-l w-20 rounded-xl hover:bg-opacity-50'
                            type='submit'>Login</button>
                    </div>
                </form>

            </div>

            <div className=''>
                <div className='flex flex-row gap-4 items-center'>
                    <div className='logo-wrapper'>
                        <img className='size-8' src='https://developers.google.com/identity/images/g-logo.png' />
                    </div>
                    <span className='text-container'>
                        <span>Sign in with Google</span>
                    </span>
                </div>
            </div>



        </div>
    )
}

export default UserBox