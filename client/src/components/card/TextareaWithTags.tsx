import React, { FormEvent, useState, useRef, useEffect } from 'react'
import { User, useAuth } from '../../contexts/UserAuth'
import LoadingButton from '../LoadingButton';
import useSWR from 'swr';


type Props = {
    placeHolder: string
}

type TagData = {
    session_token: string | undefined;
    usernameSubstring?: string;
}

const CommentInput: React.FC<Props> = ({ placeHolder }) => {


    const user: User | null = useAuth().getUser();
    const [tagUsersList, setTagUsersList] = useState<User[] | null>();

    const tagData: TagData = {
        session_token: user?.session_token,
        usernameSubstring: ''
    }

    const fetcher = async (url: string, tagData: TagData) => await fetch(url, {
        method: 'POST', // or 'PUT', 'DELETE', etc. depending on your API
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
    })
        .then((res) => res.json())
        .then((data) => setTagUsersList(data));


    const [inputText, setInputText] = useState<string>('');
    const [tagString, setTagString] = useState<string>('');
    const divRef = useRef<HTMLDivElement>(null);




    useEffect(() => {
        if (tagString && tagString != '')
            fetcher('http://localhost:5000/taggedUsers', { ...tagData, usernameSubstring: tagString })

        else {
            setTagUsersList(null);
        }


    }, [tagString])






    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {

        // event.preventDefault();
        // setIsSendingComment(true);


        // try {
        //     // ? Send a POST request with body parameters
        //     fetcher(`http://localhost:5000/thoughts/${thought._id}/addComment`, { ...userData, text: commentText });

        //     setTimeout(() => {
        //         setIsSendingComment(false);
        //         setCommentText('');

        //     }, 700);


        //     mutate(`http://localhost:5000/thoughts/${thought._id}/comments`);
        // } catch (err) {
        //     console.log(err)
        // }

    };





    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {

        const newText = event.currentTarget.innerText;
        const tagIndex = newText.lastIndexOf(' @');


        if (tagIndex != -1 || newText.lastIndexOf('@') == 0) {

            const tagString = newText.substring(tagIndex + 2);
            console.log(tagString);
            setTagString(tagString);
        }
        setInputText(newText);
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



    return (
        <div id="addAComment" className='relative'>
            <form onSubmit={handleSubmit}>

                <div className='relative'>


                    {/* Conditionally render placeholder text */}
                    {inputText === '' && (
                        <span style={{ color: '#aaa', position: 'absolute', top: '16px', left: '14px' }}>{placeHolder + '...'}</span>
                    )}

                    <div
                        contentEditable
                        ref={divRef}
                        onInput={handleInput}
                        className={`p-2 pr-20 rounded-md md:h-22 md:p-4 md:h-20 h-12 w-[98%] resize-none bg-gray-200 dark:bg-gray-600 overflow-auto`}>



                    </div>
                    {
                        tagUsersList && <div className='absolute top-0 right-0 w-[120px] flex flex-col bg-gray-200 rounded-lg dark:bg-gray-700'>
                            <ul>

                                {tagUsersList.map((user, index) => {
                                    return (

                                        <li
                                            key={index}
                                            className='p-2 flex flex-row items-center gap-4  rounded-lg transition delay-[300] hover:bg-purple-500   cursor-pointer border-gray-700'>
                                            <img src={user.avatar} alt="" className='size-6 ring-1 ring-white rounded-full' />
                                            {renderBoldUser(user.username)}

                                        </li>
                                    )

                                })}

                            </ul>

                        </div>
                    }



                </div>
            </form>


            <div>


            </div>


        </div>
    )


}

export default CommentInput