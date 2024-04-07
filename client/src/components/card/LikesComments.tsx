import React, { useEffect, useState } from 'react'
import { FaHeart, FaCommentAlt } from 'react-icons/fa'
import useSWR, { mutate } from 'swr'
import Comments from './CommentsList'


interface Props {
  thoughtID: string,
  updateShowComments: () => void;

}


const LikesContainer: React.FC<Props> = ({ thoughtID, updateShowComments }) => {

  const [previousData, setPreviousData] = useState({
    likes: 0,
    comments: 0
  })

  const [isAnimate, setIsAnimate] = useState({
    likes: false,
    comments: false
  })

  const fetcher = (url: string) => fetch(url).then((res) => {
    return res.json();
  })

  const { data: likesAmount } = useSWR<number>(
    `http://localhost:5000/thoughts/${thoughtID}/likes`,
    fetcher,
    {
      refreshInterval: 1000, // Refresh data every 5 seconds
    }
  );
  const { data: commentsLength } = useSWR<number>(
    `http://localhost:5000/thoughts/${thoughtID}/commentsLength`,
    fetcher,
    {
      refreshInterval: 1000, // Refresh data every 10 seconds
    }
  );


  // // Update previousData when data changes
  useEffect(() => {


    if (likesAmount && likesAmount !== previousData.likes) {

      setPreviousData({ ...previousData, likes: likesAmount });
      setIsAnimate({ ...isAnimate, likes: true });

    }

    if (commentsLength && commentsLength !== previousData.comments) {
      setPreviousData({ ...previousData, comments: commentsLength });
      setIsAnimate({ ...isAnimate, comments: true });
    }

    setTimeout(() => {

      setIsAnimate({ likes: false, comments: false });

    }, 6000)


  }, [likesAmount, commentsLength]);


  const updateLikesAmount = () => {
    mutate(`http://localhost:5000/thoughts/${thoughtID}/likes`);
  }

  return (
    <div>
      <div className="w-auto text-white">
        <div className="flex flex-row items-center justify-center gap-2  ">

          <div className='flex flex-row items-center gap-2 bg-purple-500 rounded-lg p-2 shadow-md'>
            <label className={`${isAnimate.likes ? 'animate-ping_slow' : ' animate-none'} `}> {likesAmount}</label>

            <FaHeart size={15} color="red" />
          </div>



          <div className="font-bold text-black dark:text-white">|</div>
          <div
            className={`flex flex-row items-center gap-2 bg-purple-500 rounded-lg p-2 shadow-md ${commentsLength ? 'cursor-pointer' : 'pointer-events-none'}`}

            onClick={() => {
              updateShowComments();
            }}
          >

            <label className={`${isAnimate.comments ? 'animate-ping_slow' : 'animate-none'} `}> {commentsLength}</label>

            <FaCommentAlt size={14} className="" />
          </div>
        </div>

      </div>
    </div>
  )
}

export default LikesContainer
