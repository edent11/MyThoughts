
import useSWR, { mutate } from 'swr';
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth, LoginData } from '../../contexts/UserAuth';



const LoginBox: React.FC = () => {

    const theme = useTheme();
    const auth = useAuth();
    const navigate = useNavigate();

    const [responseMessage, setResponseMessage] = useState('');

    const [loginData, setLoginData] = useState<LoginData>({
        username: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setLoginData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Event handler for form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        // Do something with the form data, like submitting it to a server

        auth.login(loginData)?.then(() => {
            navigate('/home');
            window.location.reload();
        }).catch(message => setResponseMessage(message));

    };


    return (
        <div id="signIn"
            className={`rounded-xl font-signika border-regular my-auto m-auto shadow-purple-600 shadow-lg  border-white border-2
                       w-[600px] bg-gradient-to-br p-1 flex flex-col items-center font-bold
                       ${theme?.isDarkMode() ? 'from-gray-700 to-gray-800 text-white' : 'from-gray-200 to-gray-300 text-black'}`}>

            <p className={`bg-gradient-to-r none animate-expand from-indigo-500 via-purple-500 to-purple-700 text-white 
            w-full text-center rounded-xl text-2xl`}>Login</p>



            <div className='mb-10'>

                <form onSubmit={handleSubmit}>

                    <div className='flex flex-col text-sm items-center justify-center gap-6 mt-10'>



                        <input className='text-black rounded-xl p-2 h-6 w-[24vw] max-w-[12rem] bg-opacity-10'
                            type="text"
                            placeholder='Username'
                            name='username'
                            onChange={handleInputChange}
                            value={loginData.username}
                            required />


                        <input className='text-black  rounded-xl p-2 h-6 w-[24vw] max-w-[12rem] bg-opacity-10'
                            type="password"
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={loginData.password}
                            required />


                        <p>Don't have an account? <span
                            className=' cursor-pointer underline hover:text-purple-400'
                            onClick={() => navigate('/register')}>Register here</span></p>

                        {
                            responseMessage && (
                                <p className='text-red-600'>{responseMessage}</p>
                            )
                        }

                        <button
                            className='bg-gradient-to-r from-purple-500 to-purple-700 text-white
                         hover:bg-gradient-to-l h-8 w-20 rounded-xl hover:bg-opacity-50'
                            type='submit'
                        >Login</button>
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

export default LoginBox