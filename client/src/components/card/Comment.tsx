import React, { useEffect, useState } from 'react'
import { User } from '../../contexts/UserAuth'
import { calcTimePassed } from '../shared/utils'

interface Props {
  comment: CommentType
}

export interface CommentType {
  user: User
  text: string
  createdAt: Date
}



const Comment: React.FC<Props> = ({ comment }) => {

  const [lineClamp, setLineClamp] = useState<number>(3);
  const [postTime, setPostTime] = useState<string>(calcTimePassed(comment.createdAt));


  useEffect(() => {

    setLineClamp(3);
  }, []); // Run once after mounting




  return (
    <div
      id="commentBox"
      className="bg-gray-100 text-black divide-y-2 divide-transparent
         p-2 dark:bg-gray-600 dark:text-white shadow-lg rounded-3xl w-[95%]"
    >
      <div
        id="userArea"
        className=" rounded-3xl p-1 select-none flex flex-row gap-2 items-center"
      >
        <img
          className="rounded-full size-8 ring-white ring-2"
          src={comment.user.avatar}
          alt=""
        />
        <p className=" select-none light:text-black font-bold dark:text-purple-300">
          {comment.user.username}
        </p>
        <label className=" select-none light:text-gray-700 opacity-60 text-sm">
          {postTime.toString()}
        </label>
      </div>
      <div id="comment-txt-wrapper" className="ml-8 w-[90%] ">
        <p id="comment-txt" className={`break-words cursor-pointer line-clamp-${lineClamp} `} onClick={() => setLineClamp(prev => prev + 2)}> {comment.text}</p>
      </div>
    </div>
  )
}

export default Comment
