import React, { useEffect, useState, useReducer, FormEvent } from 'react'

import { CiHeart } from 'react-icons/ci'
import { FaHeart, FaCommentAlt } from 'react-icons/fa'
import { User, useAuth } from '../../contexts/UserAuth'
import LikesComments from './LikesComments'
import CommentsList from './CommentsList'
import useSWR, { mutate } from 'swr'
import { calcTimePassed, fetcherData } from '../shared/utils'
import ThoughtImage from './ThoughtImage'
import { UserData, ThoughtType, SubmitComment } from '../shared/types/ThoughtTypes'
import TextForm from '../TextForm'
import { useNavigate } from 'react-router-dom'


interface Props {
  thought: ThoughtType
  highlightComment?: string | null
}




const Thought: React.FC<Props> = ({ thought, highlightComment }) => {
  const [isLiked, setIsLiked] = useState<Boolean | null>(null);
  const timePassed: string = calcTimePassed(thought.createdAt);
  const [showComments, setShowComments] = useState<Boolean>(false);
  const [lineClamp, setLineClamp] = useState<number>(3);
  const navigate = useNavigate();


  const userData: UserData = {
    session_token: useAuth().getUser()?.session_token,
  };


  const { data, error } = useSWR(`http://localhost:5000/thoughts/${thought._id}/isUserLiked`,
    () => fetcherData(`http://localhost:5000/thoughts/${thought._id}/isUserLiked`, userData));

  const updateShowComments = () => {
    setShowComments(prevState => !prevState);
  };


  if (data && isLiked == null) {
    setIsLiked(data);
  }

  useEffect(() => {
    if (highlightComment)
      setShowComments(true);
  }, [])


  const handleSubmitComment = async (commentData: SubmitComment): Promise<string> => {

    return fetcherData(`http://localhost:5000/thoughts/${thought._id}/addComment`, commentData);

  };



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
      //setMutateLikes(true);
    } catch (err) {
      console.log(err)
    }
  }





  return (
    <div className="flex flex-col gap-2 font-signika backdrop-contrast-150 drop-shadow-[0_10px_10px_rgba(200,200,200,0.4)]
    py-2 px-1 mt-10 bg-white dark:bg-gray-700 w-[80vw] ring-2 ring-purple-500 mx-auto rounded-lg md:w-[540px]">

      {thought.content.imageSource &&
        <div id="picArea" className="relative text-center mb-4 select-none">


          <ThoughtImage
            src={thought.content.imageSource}
            className="w-[60%] h-40 md:w-[90%] md:h-52 mx-auto shadow-lg rounded-xl"
          />

        </div>
      }

      <div
        id="textArea"
        className="bg-white text-black divide-y-2 divide-transparent p-2 dark:bg-gray-700 dark:text-white h-full rounded-3xl"
      >
        <div
          id="userArea"
          className=" rounded-3xl p-1  select-none flex flex-row gap-5 mb-3 items-center "

        >
          <div className='flex flex-row gap-3 justify-center items-center cursor-pointer'
            onClick={() => navigate(`/users/${thought?.user.username}`)}>

            <img
              className="rounded-full size-8 ring-white ring-2"
              src={thought?.user.avatar}
              alt=""

            />
            <label className=" select-none light:text-black font-bold">
              {thought.user.username}
            </label>

          </div>
          <label className=" select-none light:text-gray-700 opacity-60 text-sm">
            {timePassed}
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

        <div className="px-10 light:text-blue-900 mb-10" id="textArea">
          <p
            id="text"
            className={`break-words font-info_story text-lg line-clamp-${lineClamp}`}
            onClick={() => setLineClamp(prev => prev + 1)}>

            <div className='space-x-2'>

              {thought.content.tags.map((user, _) => {

                //console.log(user.username);

                return (
                  <span key={user.username} className='text-blue-500 cursor-pointer' onClick={() => navigate(`/users/${user.username}`)}>@{user.username}</span>
                );
              })}
            </div>


            {thought.content.text}
          </p>
        </div>

        <div id="commentsAndLikes" className="">
          <div className="w-auto mb-4">
            <LikesComments thoughtID={thought._id} updateShowComments={updateShowComments} />
          </div>


          <div className='h-auto'>{showComments && <CommentsList thoughtID={thought._id} highlightComment={highlightComment} />}</div>

          <div>
            <div id="addAComment" className='relative'>

              <TextForm placeHolder='Enter comment here' type="comment" onSubmit={handleSubmitComment} />

            </div>
          </div>


        </div>
      </div >
    </div >
  )
}

export default Thought
