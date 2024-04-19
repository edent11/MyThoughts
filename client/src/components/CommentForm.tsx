import React, { FormEvent, useState, useRef, useEffect, ReactNode } from 'react'
import { User, useAuth } from '../contexts/UserAuth'
import { IoIosCloseCircle } from "react-icons/io";
import LoadingButton from './LoadingButton';
import useSWR, { mutate } from 'swr';
import { ObjectId } from 'mongodb';
import TextareaWithTags from './card/TextareaWithTags';
import { SubmitComment } from './shared/types/ThoughtTypes';
import { fetcherData } from './shared/utils';


type Props = {
    placeHolder: string,
    onSubmit?: (data: SubmitComment) => Promise<string>;
    children?: ReactNode
    thoughtID: string
}



const CommentForm: React.FC<Props> = ({ placeHolder, children, thoughtID }) => {

    const [isSendingComment, setIsSendingComment] = useState<boolean>(false);
    const user: User | null = useAuth().getUser();

    if (!user) {
        throw new Error("No user detected")
    }

    const [commentData, setCommentData] = useState<SubmitComment>({
        session_token: user.session_token,
        text: "",
        tags: []

    });

    // Function to update the state with the new input value
    const handleTextChange = (newValue: string) => {
        setCommentData(prevState => ({
            ...prevState,
            text: newValue
        }));
    };

    // Function to update the state with the new input value
    const addTag = (newTag: string) => {
        setCommentData(prevState => ({
            ...prevState,
            tags: [...prevState.tags, newTag]
        }));
    };

    // Function to update the state with the new input value
    const removeTag = (tag: string) => {
        setCommentData(prevState => ({
            ...prevState,
            tags: prevState.tags.filter((item, _) => tag !== item)
        }));
    };



    const handleSubmit = async (): Promise<void> => {

        setIsSendingComment(true);


        try {
            // ? Send a POST request with body parameters
            await fetcherData(`http://localhost:5000/thoughts/${thoughtID}/addComment`, commentData);


            setTimeout(() => {
                setIsSendingComment(false);
                commentData.text = ""
                commentData.tags = [];

            }, 700);


            mutate(`http://localhost:5000/thoughts/${thoughtID}/comments`);
        } catch (err) {
            console.log(err)
        }

    };


    return (

        <div className='h-full w-full'>
            <TextareaWithTags
                placeHolder={placeHolder}
                text={commentData.text}
                tags={commentData.tags}
                handleTextChange={handleTextChange}
                addTag={addTag}
                removeTag={removeTag}
                className='relative'>


                <div className='absolute right-8 top-[50%]'>
                    <LoadingButton
                        onClick={handleSubmit}
                        isLoading={isSendingComment}
                        isEnabled={commentData.text.length ? true : false}
                        buttonText="Send"
                        className='rounded-lg w-6 h-6 text-sm md:w-auto md:h-auto text-white transition delay-200' />
                </div>

            </TextareaWithTags>
        </div>
    )

}

export default CommentForm