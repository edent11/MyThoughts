import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/UserAuth'
import TextForm from '../components/TextForm';
import { SubmitComment, SubmitThought } from '../components/shared/types/ThoughtTypes';
import axios from 'axios';





const NewThought: React.FC = () => {

    const session_token = useAuth().getUser()?.session_token;
    const navigate = useNavigate();

    const handleSubmit = async (thoughtData: SubmitThought | SubmitComment): Promise<any> => {

        console.log(thoughtData);
        const formData = new FormData();

        Object.entries(thoughtData).forEach(([key, value]) => {
            // if (key === 'image')
            //     formData.append(key, value as File);
            formData.append(key, value as string);
        });

        const response = axios.post('http://localhost:5000/newThought/', formData);

        // const response = await fetcherData('http://localhost:5000/newThought/', thoughtData);
        console.log(response);

        return response;

    }


    return (
        <div className={`h-[calc(100vh-4rem)] font-info_story w-full flex items-center justify-center`}>


            <div className='w-1/2 md:min-h-3/4  bg-gray-200 dark:bg-gray-800 text-black dark:text-white
             rounded-xl border-[3px] border-purple-500 bg-cover bg-center bg-no-repeat'>



                <div className=' backdrop-blur-sm h-full w-full flex flex-col items-center gap-8'>


                    <h1 className='mt-4 text-lg md:text-3xl'>What do you think about?</h1>

                    {/* <ThoughtForm placeHolder='Enter your thought here'></ThoughtForm> */}
                    <TextForm placeHolder='Enter Your Thought here' type="thought" onSubmit={handleSubmit}></TextForm>


                </div>

            </div>

        </div >
    )
}

export default NewThought