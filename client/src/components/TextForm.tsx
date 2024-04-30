import React, { FormEvent, useState, useRef, useEffect, ReactNode, ChangeEvent } from 'react'
import { User, useAuth } from '../contexts/UserAuth'

import LoadingButton from './LoadingButton';


import TextareaWithTags from './card/TextareaWithTags';
import { SubmitComment, SubmitThought } from './shared/types/ThoughtTypes';
import { fetchFormData, fetcherData } from './shared/utils';
import { FaExchangeAlt } from 'react-icons/fa';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';



type Props = {
    placeHolder: string;
    type: "comment" | "thought";
    onSubmit: (data: SubmitThought | SubmitComment) => Promise<string>;
    children?: ReactNode;
}



const TextForm: React.FC<Props> = ({ placeHolder, children, type, onSubmit }) => {

    const user: User | null = useAuth().getUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<string>();

    if (!user) {
        throw new Error("No user detected")
    }



    const [data, setData] = useState<SubmitThought | SubmitComment>(
        type == "thought" ? {
            session_token: user.session_token,
            text: "",
            image: null,
            tags: []

        } : {
            session_token: user.session_token,
            text: "",
            tags: []
        });


    // Function to update the state with the new input value
    const handleTextChange = (newValue: string) => {
        setData(prevState => ({
            ...prevState,
            text: newValue
        }));
    };

    // Function to update the state with the new input value
    const addTag = (newTag: string) => {
        setData(prevState => ({
            ...prevState,
            tags: [...prevState.tags, newTag]
        }));
    };

    // Function to update the state with the new input value
    const removeTag = (tag: string) => {
        setData(prevState => ({
            ...prevState,
            tags: prevState.tags.filter((item, _) => tag !== item)
        }));
    };



    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files && event.target.files[0];

        if (selectedImage) {
            setData({ ...data, image: selectedImage }); // Set the image data to state (assuming it's stored as base64 string)


            const objectUrl = URL.createObjectURL(selectedImage);
            setPreview(objectUrl);
        }
    };

    const handleSubmit = async () => {

        setIsLoading(true);


        onSubmit(data)
            .then(() => {
                setTimeout(() => {
                    setIsLoading(false);
                    setData({ ...data, text: '', tags: [] });

                }, 2000);
            })
            .catch(err => console.error('Error creating new thought:', err));

    }


    return (

        <div className={`h-full w-full ${type == "thought" ? 'flex flex-col gap-10 items-center' : ''}`}>


            <TextareaWithTags
                placeHolder={placeHolder}
                text={data.text}
                handleTextChange={handleTextChange}
                tags={data.tags}
                addTag={addTag}
                removeTag={removeTag}
                className={`relative ${type == "thought" ? 'w-[90%]' : 'w-full'} `} />

            {
                type == "thought" &&
                <label className='relative cursor-pointer w-1/2 h-32 bg-cover bg-center backdrop-blur-xl rounded-xl border-dashed border-[3px]
                         dark:border-white bg-gray-300 dark:bg-gray-800 flex flex-col items-center justify-center' htmlFor="formId"
                    style={{ backgroundImage: "url(" + preview + ")" }}>
                    <input name="" type="file" id="formId" onChange={handleImageChange} accept="image/*" hidden />

                    {preview ? <FaExchangeAlt /> : <MdAddPhotoAlternate size={40} className='text-purple-700 dark:text-white' />}


                    {/* {preview ? (`${'image' in data ? data.image?.name : ''}`) : 'Click here to upload an image'} */}

                </label>
            }



            <div className={type == "comment" ? 'absolute right-8 top-[50%]' : ''}>
                <LoadingButton
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    isEnabled={data.text.length ? true : false}
                    buttonText="Send"
                    className='rounded-lg w-6 h-6 text-sm md:w-auto md:h-auto text-white transition delay-200 mb-10' />
            </div>

        </div>
    )





}

export default TextForm