import React, { useState, useCallback, useRef, useEffect } from 'react'
import { User, useAuth } from '../../contexts/UserAuth'
import Comment from './Comment'
import useSWR, { mutate } from 'swr'
import LoadingSvg from '../LoadingSvg'
import { CommentType } from '../shared/types/ThoughtTypes'
import { fetcher } from '../shared/utils'


interface Props {
  thoughtID: string
  highlightComment?: string | null

}

const Comments: React.FC<Props> = ({ thoughtID, highlightComment }) => {

  const commentsDivRef = useRef<HTMLDivElement>(null);
  const highlightCommentRef = useRef<HTMLDivElement>(null);


  const { data: commentsList, isLoading } = useSWR<CommentType[]>(
    `http://localhost:5000/thoughts/${thoughtID}/comments`,
    fetcher,
  )


  // Function to scroll the parent element to the child element
  const scrollToChild = () => {
    if (commentsDivRef.current && highlightCommentRef.current) {
      const offset: number = highlightCommentRef.current.offsetTop - commentsDivRef.current.offsetTop;
      console.log(offset, "abc")
      commentsDivRef.current.scrollTop = offset;
    }
  };

  useEffect(() => {

    setTimeout(scrollToChild, 1500);
  }, [])


  return (



    <div className="my-4 flex flex-col items-center gap-4 overflow-auto max-h-52 md:max-h-80 min-h-24
       scrollbar-thumb-rounded-full scrollbar-track-rounded-full
        scrollbar scrollbar-thumb-purple-700 scrollbar-track-white dark:scrollbar-track-gray-700 overflow-y-auto"
      ref={commentsDivRef}>


      {isLoading ? <LoadingSvg /> :
        commentsList?.map((comment) => {
          if (highlightComment && highlightComment === comment._id)
            return <Comment
              key={comment._id}
              comment={comment}
              className='bg-purple-400 bg-gradient-to-br dark:from-purple-500 dark:to-purple-700'
              childRef={highlightCommentRef} />
          return <Comment key={comment._id} comment={comment} />

        })}
    </div>


  )
}

export default Comments
