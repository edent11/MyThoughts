import React, { FormEvent, useState, useRef, useEffect, ReactNode, ChangeEvent } from 'react'
import { User, useAuth } from '../../contexts/UserAuth'
import { IoIosCloseCircle } from "react-icons/io";
import LoadingButton from '../LoadingButton';
import useSWR from 'swr';
import { ObjectId } from 'mongodb';
import { TagData } from '../shared/types/ThoughtTypes';
import { fetcherData } from '../shared/utils';


type Props = {
    placeHolder: string,
    children?: ReactNode,
    className?: string,
    text: string
    handleTextChange: (newValue: string) => void;
    tags: string[];
    addTag: (newTag: string) => void;
    removeTag: (tagToDelete: string) => void;
}


const TextareaWithTags: React.FC<Props> = ({ placeHolder, children, className, text, handleTextChange, tags, addTag, removeTag }) => {

    const contentEditableRef = useRef<HTMLTextAreaElement>(null);
    const dropdownUsersRef = useRef<HTMLDivElement>(null);
    const user: User | null = useAuth().getUser();
    const [tagString, setTagString] = useState<string>('X');
    const [tagUsersList, setTagUsersList] = useState<User[] | null>();

    const tagData: TagData = {
        session_token: user?.session_token,
    }


    useEffect(() => {

        if (tagString != 'X') {

            fetcherData('http://localhost:5000/taggedUsers', { ...tagData, usernameSubstring: tagString, already_tagged: tags.map(username => username) })
                .then((data: User[]) => setTagUsersList(data));

        }
        else {

            setTagUsersList(null);
        }

    }, [tagString])



    const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {

        event.preventDefault();

        const newText = event.target.value;

        const tagIndex = newText.lastIndexOf(' @');

        if (tagIndex != -1 || newText?.lastIndexOf('@') == 0) {

            const tagString = newText.substring(tagIndex + 2);
            setTagString(tagString);
        }
        else {
            setTagString('X');
        }

        handleTextChange(newText);

    };




    const renderBoldUser = (username: string): JSX.Element => {

        const bold = username.slice(0, tagString.length);
        const rest = username.slice(tagString.length);



        return (
            <p>
                <strong>
                    {bold}
                </strong>
                {rest}
            </p>
        )
    };

    // const applyStyleToText = (text: string, indexes: number[], style: string) => {
    //     let result = '';

    //     result += `<span style="${style}">${text}</span>`;

    //     return result;
    // };

    const handleTagClick = (username: string) => {

        handleTextChange(text.slice(0, text.indexOf('@')));
        if (contentEditableRef.current) {
            contentEditableRef.current.innerText = text;
        }
        addTag(username);
        setTagString('X');

    };

    const handleRemoveTag = (username: string) => {

        removeTag(username);

    };





    return (
        <div className={className}>

            <div className='relative flex flex-col w-full '>

                <div className='flex flex-row gap-2 my-2 w-[90%] flex-wrap pl-2'>
                    {tags.length == 0 ? `You can tag other users using @` : 'Tagged Users: '}

                    {tags.map((username, index) => {

                        return (
                            <div className='flex flex-row h-full bg-white rounded-full items-center' key={username}>
                                <span contentEditable={false} className=' font-bold bg-purple-600 h-[25px]'>@{username + ' '} </span>
                                <IoIosCloseCircle size={20} onClick={() => handleRemoveTag(username)} className='cursor-pointer text-purple-600' />
                            </div>
                        )

                    })}


                </div>


                <div className={`relative flex flex-row p-2 pr-20 rounded-md w-[98%] h-12 md:h-28 md:p-4 bg-gray-300 dark:bg-gray-600 cursor-text`}>

                    <textarea

                        placeholder={placeHolder + '...'}
                        ref={contentEditableRef}
                        value={text}
                        onChange={handleInput}
                        className={`w-[80%] text-sm resize-none overflow-x-hidden h-full bg-gray-300 dark:bg-gray-600 overflow-auto outline-none `}
                    />


                </div>



            </div>
            {
                tagUsersList && <div
                    className='inline-block w-[120px] flex-col bg-gray-200 rounded-lg dark:bg-gray-700'

                    ref={dropdownUsersRef}>
                    <ul>

                        {tagUsersList.map((user, index) => {
                            return (

                                <li
                                    key={user._id}
                                    className='p-2 flex flex-row items-center gap-4  rounded-lg transition delay-[300] hover:bg-purple-500 cursor-pointer border-gray-700'
                                    onClick={() => handleTagClick(user.username)}>
                                    <img src={user.avatar} alt="" className='size-6 ring-1 ring-white rounded-full' />
                                    {renderBoldUser(user.username)}

                                </li>
                            )

                        })}

                    </ul>

                </div>
            }

            <div>


            </div>

            {children}


        </div>
    )


}

export default TextareaWithTags