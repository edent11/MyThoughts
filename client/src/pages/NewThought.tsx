import React, { ChangeEvent, FormEvent, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useNavigate } from 'react-router-dom';
import { MdAddPhotoAlternate } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../contexts/UserAuth'
import SubmitForm from '../components/CommentForm';
import TextareaWithTags from '../components/card/TextareaWithTags';
import ThoughtForm from '../components/ThoughtForm';





const NewThought: React.FC = () => {

    const session_token = useAuth().getUser()?.session_token;
    const navigate = useNavigate();


    return (
        <div className={`h-[calc(100vh-4rem)] font-info_story w-full flex items-center justify-center`}>


            <div className='w-1/2 min-h-3/4 bg-gray-200 dark:bg-gray-800 text-black dark:text-white
             rounded-xl border-[3px] border-purple-500 bg-cover bg-center bg-no-repeat'>



                <div className=' backdrop-blur-sm h-full w-full flex flex-col items-center gap-8'>


                    <h1 className='mt-4 text-3xl'>What do you think about?</h1>

                    <ThoughtForm placeHolder='Enter your thought here'></ThoughtForm>


                </div>

            </div>

        </div >
    )
}

export default NewThought