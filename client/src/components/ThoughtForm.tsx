import React, { FormEvent, useState, useRef, useEffect, ReactNode, ChangeEvent } from 'react'
import { User, useAuth } from '../contexts/UserAuth'
import { IoIosCloseCircle } from "react-icons/io";
import LoadingButton from './LoadingButton';
import useSWR, { mutate } from 'swr';
import { ObjectId } from 'mongodb';
import TextareaWithTags from './card/TextareaWithTags';
import { SubmitThought } from './shared/types/ThoughtTypes';
import { fetchFormData, fetcherData } from './shared/utils';
import { FaExchangeAlt } from 'react-icons/fa';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { CiLogin } from 'react-icons/ci';
import { log } from 'console';


type Props = {
    placeHolder: string,
    // onSubmit?: (data: SubmitData) => Promise<string>;
    children?: ReactNode
}



const ThoughtForm: React.FC<Props> = ({ placeHolder, children }) => {

    const user: User | null = useAuth().getUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<string>();

    const session_token = useAuth().getUser()?.session_token;
    const navigate = useNavigate();

    if (!user) {
        throw new Error("No user detected")
    }

    const [thoughtData, setThoughtData] = useState<SubmitThought>({
        session_token: user.session_token,
        text: "",
        image: null,
        tags: []

    });


    // Function to update the state with the new input value
    const handleTextChange = (newValue: string) => {
        setThoughtData(prevState => ({
            ...prevState,
            text: newValue
        }));
    };

    // Function to update the state with the new input value
    const addTag = (newTag: string) => {
        setThoughtData(prevState => ({
            ...prevState,
            tags: [...prevState.tags, newTag]
        }));
    };

    // Function to update the state with the new input value
    const removeTag = (tag: string) => {
        setThoughtData(prevState => ({
            ...prevState,
            tags: prevState.tags.filter((item, _) => tag !== item)
        }));
    };




    // const submitData: SubmitData = {
    //     session_token: user.session_token,
    //     text: '',
    //     tags: [],

    // }

    // const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setThoughtData(prevData => ({ ...prevData, body: event.target.value }));
    // };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files && event.target.files[0];
        if (selectedImage) {
            // setThoughtData({ ...thoughtData, image: selectedImage });
            const objectUrl = URL.createObjectURL(selectedImage)
            setPreview(objectUrl)
        }
    };

    const handleSubmit = async (): Promise<void> => {

        setIsLoading(true);

        const formData = new FormData();

        //console.log(tags);

        // formData.append('image', thoughtData.image);
        // setThoughtData(prevData => ({ ...prevData, tags: tags.push(tags.map(user => user.id) }));


        // Object.entries(thoughtData).forEach(([key, value]) => {
        //     if (key typeof 'dfgdfg')
        //     formData.append(key, value as string);

        // });


        try {
            // Make the upload request using SWR's mutate function

            const response = await fetcherData('http://localhost:5000/newThought/', thoughtData);

            setIsLoading(false);

            // setTimeout(() => {
            //     // navigate('/home');
            //     console.log("second", thoughtData);
            // }, 2000);


            // Optionally, you can use SWR's revalidate function here
        } catch (error) {
            console.error('Error creating new thought:', error);
        }
    }


    return (

        <div className='h-full w-full flex flex-col items-center gap-2'>


            <TextareaWithTags
                placeHolder={placeHolder}
                text={thoughtData.text}
                handleTextChange={handleTextChange}
                tags={thoughtData.tags}
                addTag={addTag}
                removeTag={removeTag}
                className='relative w-[90%]' />


            <label className='relative cursor-pointer w-1/2 h-32 bg-cover bg-center backdrop-blur-xl rounded-xl border-dashed border-[3px]
                         dark:border-white bg-gray-300 dark:bg-gray-800 flex flex-col items-center justify-center' htmlFor="formId"
                style={{ backgroundImage: "url(" + preview + ")" }}>
                <input name="" type="file" id="formId" onChange={handleImageChange} accept="image/*" hidden />

                {preview ? <FaExchangeAlt /> : <MdAddPhotoAlternate size={40} className='text-purple-700 dark:text-white' />}


                {/* {preview ? (`${thoughtData.image?.name}`) : 'Click here to upload an image'} */}

            </label>

            <div className=''>
                <LoadingButton
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    isEnabled={thoughtData.text.length ? true : false}
                    buttonText="Send"
                    className='rounded-lg w-6 h-6 text-sm md:w-auto md:h-auto text-white transition delay-200' />
            </div>

        </div>
    )





}

export default ThoughtForm