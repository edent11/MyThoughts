import React, { ChangeEvent, FormEvent, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useNavigate } from 'react-router-dom';
import { MdAddPhotoAlternate } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../contexts/UserAuth'

type Props = {}




const NewThought: React.FC<Props> = () => {

    const session_token = useAuth().getUser()?.session_token;
    const navigate = useNavigate();

    const [thoughtData, setThoughtData] = useState<{ session_token: string, body: string; image: File | null }>({
        session_token: session_token ? session_token : '',
        body: '',
        image: null,
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<string>();


    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setThoughtData(prevData => ({ ...prevData, body: event.target.value }));
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files && event.target.files[0];
        if (selectedImage) {
            setThoughtData(prevData => ({ ...prevData, image: selectedImage }));
            const objectUrl = URL.createObjectURL(selectedImage)
            setPreview(objectUrl)
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {

        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        // formData.append('image', thoughtData.image);

        Object.entries(thoughtData).forEach(([key, value]) => {
            formData.append(key, value as string);
        });



        try {
            // Make the upload request using SWR's mutate function
            await mutate('http://localhost:5000/newThought/', async () => {
                const response = await fetch('http://localhost:5000/newThought/', {
                    method: 'POST',
                    body: formData,


                });
                return response.json();
            });
            setIsLoading(false);

            setTimeout(() => {
                navigate('/home');
            }, 2000);

            // Optionally, you can use SWR's revalidate function here
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }


    return (
        <div className={`h-[calc(100vh-4rem)] font-info_story w-full flex items-center justify-center`}

        >
            <div className='w-1/2 min-h-3/4 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-xl border-[3px] border-purple-500 bg-cover bg-center bg-no-repeat '

            >

                <div className=' backdrop-blur-sm h-full w-full flex flex-col items-center gap-8'>


                    <h1 className='mt-4 text-3xl'>What do you think about?</h1>


                    {/* <img src="http://localhost:5000/assets/images/b136e6fde3272266822ec96b4510a99e" alt="sdfsdf" /> */}

                    <form className='w-full h-full flex flex-col items-center gap-8' onSubmit={handleSubmit}>

                        <textarea
                            value={thoughtData.body}
                            onChange={handleTextChange}
                            name=""
                            id=""
                            cols={10}
                            rows={3}
                            className=' w-[80%] text-black text-lg dark:text-white p-4 rounded-xl resize-none dark:bg-gray-700'
                            placeholder='Write your thought here...'>

                        </textarea>


                        <label className='relative cursor-pointer w-1/2 h-32 bg-cover bg-center backdrop-blur-xl rounded-xl border-dashed border-[3px]
                         dark:border-white bg-gray-300 dark:bg-gray-800 flex flex-col items-center justify-center' htmlFor="formId"
                            style={{ backgroundImage: "url(" + preview + ")" }}>
                            <input name="" type="file" id="formId" onChange={handleImageChange} accept="image/*" hidden />

                            {preview ? <FaExchangeAlt /> : <MdAddPhotoAlternate size={40} className='text-purple-700 dark:text-white' />}


                            {preview ? (`${thoughtData.image?.name}`) : 'Click here to upload an image'}

                        </label>


                        <LoadingButton isLoading={isLoading} buttonText='Send' className='mb-6' isEnabled={thoughtData.body.length ? true : false} />

                    </form>
                </div>

            </div>

        </div >
    )
}

export default NewThought