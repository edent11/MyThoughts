import React, { useEffect, useState, useReducer, FormEvent } from 'react'
import { CiHeart } from 'react-icons/ci'
import { FaHeart, FaCommentAlt } from 'react-icons/fa'
import { User, useAuth } from '../../contexts/UserAuth'
import LikesComments from './LikesComments'
import LoadingButton from '../LoadingButton'
import CommentsList from './CommentsList'
import useSWR, { mutate } from 'swr'
import { calcTimePassed } from '../shared/utils'
import ThoughtImage from './ThoughtImage'
import CommentInput from './TextareaWithTags'

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
    imageSource: string
  }
  createdAt: Date

}

const Thought: React.FC<Props> = ({ thought }) => {
  const [isLiked, setIsLiked] = useState<Boolean | null>(null);
  const timePassed: string = calcTimePassed(thought.createdAt);
  const [mutateLikes, setMutateLikes] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<Boolean>(false);
  const [isSendingComment, setIsSendingComment] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [lineClamp, setLineClamp] = useState<number>(3);

  const userData = {
    session_token: useAuth().getUser()?.session_token,
  };

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {

    event.preventDefault();
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

  console.log(thought.content.imageSource)


  return (
    <div className="flex flex-col gap-2 font-signika backdrop-contrast-150 drop-shadow-[0_10px_10px_rgba(200,200,200,0.4)]
    py-2 px-1 mt-10 bg-white dark:bg-gray-700 w-[80vw] ring-2 ring-purple-500  rounded-lg md:w-[540px]">

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
          className=" rounded-3xl p-1  select-none flex flex-row gap-2 items-center"
        >
          <img
            className="rounded-full size-8 ring-white ring-2"
            src={thought?.user.avatar}
            alt=""
          />
          <label className=" select-none light:text-black font-bold">
            {thought.user.username}
          </label>
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
          <p id="text" className={`break-words font-info_story text-lg line-clamp-${lineClamp}`} onClick={() => setLineClamp(prev => prev + 1)}> {thought.content.body}</p>
        </div>

        <div id="commentsAndLikes" className="">
          <div className="w-auto mb-4">
            <LikesComments thoughtID={thought._id} updateShowComments={updateShowComments} />
          </div>


          <div className='h-auto'>{showComments && <CommentsList thoughtID={thought._id} />}</div>

          <div>
            <div id="addAComment" className='relative'>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={commentText}
                  onChange={handleCommentChange}
                  rows={3} // Adjust the number of visible rows as needed
                  cols={30} // Adjust the number of visible columns as needed
                  placeholder="Enter comment here..."
                  className={`p-2 pr-20 rounded-md md:h-22 md:p-4 md:h-20 h-12 w-[98%] resize-none bg-gray-200 dark:bg-gray-600 overflow-auto`}
                  disabled={isSendingComment ? true : false}
                  required
                />

                <div className='absolute right-8 top-[50%] -translate-y-[60%]'>
                  <LoadingButton
                    isLoading={isSendingComment}
                    isEnabled={commentText.length ? true : false}
                    buttonText="Send"
                    className='rounded-lg w-6 h-6 text-sm md:w-auto md:h-auto text-white transition delay-200 ' />
                </div>

                <CommentInput placeHolder='Enter comment here' />
              </form>


            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Thought
