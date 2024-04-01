import React, { useState, useCallback } from 'react'
import { User } from '../../contexts/UserAuth'
import Comment, { CommentType } from './Comment'
import useSWR, { mutate } from 'swr'

interface Props {
  thoughtID: string
}

const Comments: React.FC<Props> = ({ thoughtID }) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const [comments, setComments] = useState<[CommentType]>()

  const { data: commentsList, isLoading } = useSWR<[CommentType]>(
    `http://localhost:5000/thoughts/${thoughtID}/comments`,
    fetcher,
  )

  return (
    <div id="commentsBox" className="mt-2 flex flex-col gap-4">
      {commentsList?.map((comment) => {
        return <Comment comment={comment} />
      })}
    </div>
  )
}

export default Comments
