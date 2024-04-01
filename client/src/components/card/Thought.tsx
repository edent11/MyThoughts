import React, { useEffect, useState, useReducer } from 'react'

import { CiHeart } from 'react-icons/ci'
import { FaHeart, FaCommentAlt } from 'react-icons/fa'
import { User, useAuth } from '../../contexts/UserAuth'
import LikesContainer from './LikesContainer'
import Comments from './CommentsList'
import useSWR, { mutate } from 'swr'

interface Props {
  thought: ThoughtType
}

export interface ThoughtType {
  _id: string
  user: User
  content: {
    body: string
    image_source: string
  }
  createdAt: Date
  // comments: [Comment];
  // likes: number;
}

const Thought: React.FC<Props> = ({ thought }) => {
  const user = useAuth()
  const [isLiked, setIsLiked] = useState<Boolean | null>(null)

  const userData = {
    session_token: user.getUser()?.session_token
  };


  const fetcher = async (url: string, body: any) => await fetch(url, {
    method: 'POST', // or 'PUT', 'DELETE', etc. depending on your API
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())

  const { data, error } = useSWR(`http://localhost:5000/thoughts/${thought._id}/isUserLiked`,
    () => fetcher(`http://localhost:5000/thoughts/${thought._id}/isUserLiked`, userData));


  if (data && isLiked == null) {
    setIsLiked(data);
  }

  const updateLikes = async () => {
    try {

      const operation = !isLiked ? 'addLike' : 'unLike';


      // ? Send a POST request with body parameters
      const response = await fetch(`http://localhost:5000/thoughts/${thought._id}/${operation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) // Convert formData to JSON string
      });
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex flex-col gap-2 font-signika backdrop-contrast-150  py-2 px-1 mt-10 bg-blue-200 w-[300px] shadow-lg rounded-lg">
      <div id="picArea" className="relative text-center select-none">
        <img
          className="w-80 h-52 shadow-lg rounded-xl"
          src="https://media.istockphoto.com/id/578801514/photo/silhouette-of-woman-on-lakeside-jetty-with-majestic-sunset-cloudscape.webp?b=1&s=170667a&w=0&k=20&c=xKw_tPce-salqERo_EB_1joWJSpnWOXLIX7Vc7fCnG4="
          alt=""
        />
      </div>

      <div
        id="textArea"
        className="bg-white text-black divide-y-2 divide-transparent p-2 dark:bg-gray-700 dark:text-white shadow-lg h-full rounded-3xl"
      >
        <div
          id="userArea"
          className=" rounded-3xl p-1 select-none flex flex-row gap-2 items-center"
        >
          <img
            className="rounded-full size-8 ring-white ring-2"
            src={`http://localhost:5000/avatars/${thought?.user.avatar}`}
            alt=""
          />
          <p className=" select-none light:text-black font-bold">
            {thought.user.username}
          </p>
          <p className=" select-none light:text-gray-700 opacity-60 text-sm">
            15 seconds ago
          </p>

          <div className="cursor-pointer ml-4">
            {isLiked ? (
              <FaHeart
                size={20}
                color="red"
                className="relative left-[2px] animate-ping_slow"
                onClick={() => {
                  setIsLiked(false)
                  updateLikes()
                }}
              />
            ) : (
              <CiHeart
                size={27}
                color="red"
                className="duration-75 animate-bounce"
                onClick={() => {
                  setIsLiked(true)
                  updateLikes()
                }}
              />
            )}
          </div>
        </div>

        <div className="px-8 light:text-blue-900 line-clamp-3" id="textArea">
          {thought?.content.body}
        </div>

        <div id="commentsAndLikes" className="">
          <div className="w-auto">
            <LikesContainer thoughtID={thought._id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Thought
