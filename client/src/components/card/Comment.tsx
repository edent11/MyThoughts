import React from 'react'
import { User } from "../../contexts/UserAuth";

interface Props {
    comment: CommentType;
}

export interface CommentType {
    author: User;
    text: string;
    createdAt: string;
}

const Comment: React.FC<Props> = ({ comment }) => {
    return (

        <div id="commentBox" className='bg-gray-100 text-black divide-y-2 divide-transparent
         p-2 dark:bg-gray-600 dark:text-white shadow-lg h-full rounded-3xl'>


            <div id="userArea" className=' rounded-3xl p-1 select-none flex flex-row gap-2 items-center'>

                <img className='rounded-full size-8 ring-white ring-2' src={`http://localhost:5000/avatars/${comment.author.avatar}`} alt="" />
                <p className=' select-none light:text-black font-bold'>{comment.author.username}</p>
                <p className=' select-none light:text-gray-700 opacity-60 text-sm'>15 seconds ago</p>

            </div>
            <div id="text" className='ml-5'>
                {comment.text}
            </div>
        </div>

    )
}

export default Comment