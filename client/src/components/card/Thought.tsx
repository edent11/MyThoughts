import React, { useEffect, useState, useReducer } from 'react'

import { CiHeart } from 'react-icons/ci'
import { FaHeart, FaCommentAlt } from 'react-icons/fa'
import { User, useAuth } from '../../contexts/UserAuth'
import LikesComments from './LikesComments'
import LoadingButton from '../LoadingButton'
import CommentsList from './CommentsList'
import useSWR, { mutate } from 'swr'
import LoadingSvg from '../LoadingSvg'
interface Props {
  thought: ThoughtType
}

interface UserData {
  session_token: string | undefined;
  text?: string;
}

export interface ThoughtType {
  _id: string
  user: User
  content: {
    body: string
    image_source: string
  }
  createdAt: Date

}

const Thought: React.FC<Props> = ({ thought }) => {
  const [isLiked, setIsLiked] = useState<Boolean | null>(null)
  const [mutateLikes, setMutateLikes] = useState<boolean>(false)
  const [showComments, setShowComments] = useState<Boolean>(false)
  const [isSendingComment, setIsSendingComment] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');

  const userData = {
    session_token: useAuth().getUser()?.session_token,
  };

  console.log(thought._id);
  const fetcher = async (url: string, body: UserData) => await fetch(url, {
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

  const handleSubmit = async () => {

    setIsSendingComment(true);

    try {
      // ? Send a POST request with body parameters
      fetcher(`http://localhost:5000/thoughts/${thought._id}/addComment`, { ...userData, text: commentText });

      setTimeout(() => {
        setIsSendingComment(false);
        setCommentText('');

      }, 700);


      mutate(`http://localhost:5000/thoughts/${thought._id}/comments`);
    } catch (err) {
      console.log(err)
    }

  };


  const updateLikes = async () => {

    try {

      const operation = !isLiked ? 'addLike' : 'unLike';
      console.log(operation)
      // ? Send a POST request with body parameters
      const response = await fetch(`http://localhost:5000/thoughts/${thought._id}/${operation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) // Convert formData to JSON string
      });
      setMutateLikes(true);
    } catch (err) {
      console.log(err)
    }
  }

  const updateShowComments = () => {
    setShowComments(prevState => !prevState);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };



  return (
    <div className="flex flex-col gap-2 font-signika backdrop-contrast-150  py-2 px-1 mt-10 bg-white dark:bg-gray-700 w-[500px] ring-2 ring-purple-500 shadow-lg rounded-lg">

      <div id="picArea" className="relative text-center mb-4 select-none">
        <img
          className="w-[90%] h-52 mx-auto shadow-lg rounded-xl"
          src="https://media.istockphoto.com/id/578801514/photo/silhouette-of-woman-on-lakeside-jetty-with-majestic-sunset-cloudscape.webp?b=1&s=170667a&w=0&k=20&c=xKw_tPce-salqERo_EB_1joWJSpnWOXLIX7Vc7fCnG4="
          alt=""
        />
      </div>

      <div
        id="textArea"
        className="bg-white text-black divide-y-2 divide-transparent p-2 dark:bg-gray-700 dark:text-white h-full rounded-3xl"
      >
        <div
          id="userArea"
          className=" rounded-3xl p-1  select-none flex flex-row gap-2 items-center"
        >
          <img
            className="rounded-full size-8 ring-white ring-2"
            src={`http://localhost:5000/avatars/${thought?.user.avatar}`}
            alt=""
          />
          <label className=" select-none light:text-black font-bold">
            {thought.user.username}
          </label>
          <label className=" select-none light:text-gray-700 opacity-60 text-sm">
            15 seconds ago
          </label>

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
          <div className="w-auto mb-4">
            <LikesComments thoughtID={thought._id} updateShowComments={updateShowComments} />
          </div>


          <div className='h-auto'>{showComments && <CommentsList thoughtID={thought._id} />}</div>

          <div>
            <div id="addAComment" className='relative'>
              <textarea
                value={commentText}
                onChange={handleCommentChange}
                rows={3} // Adjust the number of visible rows as needed
                cols={30} // Adjust the number of visible columns as needed
                placeholder="Enter comment here..."
                className=' p-4 pr-20 rounded-md h-22 resize-none w-[98%] bg-gray-200 dark:bg-gray-600 '
                required
              />

              <div className='absolute right-4 top-[50%] -translate-y-[50%]'>
                <LoadingButton
                  isLoading={isSendingComment}
                  buttonText="Send"
                  onClick={handleSubmit}
                  className='rounded-lg text-white transition delay-1000 hover:from-blue-400 hover:to-blue-700 p-2 
         bg-gradient-to-t shadow-xl from-purple-600 to-purple-400' />
              </div>


            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Thought
