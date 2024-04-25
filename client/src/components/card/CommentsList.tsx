import React, { useState, useCallback } from 'react'
import { User, useAuth } from '../../contexts/UserAuth'
import Comment from './Comment'
import useSWR, { mutate } from 'swr'
import LoadingSvg from '../LoadingSvg'
import { CommentType } from '../shared/types/ThoughtTypes'


interface Props {
  thoughtID: string

}

const Comments: React.FC<Props> = ({ thoughtID }) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())


  const { data: commentsList, isLoading } = useSWR<[CommentType]>(
    `http://localhost:5000/thoughts/${thoughtID}/comments`,
    fetcher,
  )


  return (
    <div id="commentsBox" className="mt-2 flex flex-col gap-4 scroll-auto">


      <div className="my-4 flex flex-col items-center gap-4 overflow-auto max-h-52 md:max-h-80 min-h-24
       scrollbar-thumb-rounded-full scrollbar-track-rounded-full
        scrollbar scrollbar-thumb-purple-700 scrollbar-track-white dark:scrollbar-track-gray-700 overflow-y-auto">


        {isLoading ? <LoadingSvg /> :
          commentsList?.map((comment) => {
            return <Comment key={comment._id} comment={comment} />
          })}
      </div>

    </div>
  )
}

export default Comments
