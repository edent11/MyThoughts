import React, { useEffect, useState } from 'react'
import { useFetcher } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import Thought from './card/Thought'
import { ThoughtType } from '../components/card/Thought'

type Props = {
  session_token?: string
}

const ThoughtsList: React.FC<Props> = ({ session_token }) => {

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const {
    data: thoughtsList,
    isLoading,
    error,
  } = useSWR<ThoughtType[]>(`http://localhost:5000/thoughts/${session_token ? session_token : ''}`, fetcher)

  if (error) {
    return <div>Error loading user profiles</div>
  }

  if (!thoughtsList) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-5 h-[90%] mb-10">
      {thoughtsList
        .sort((a: ThoughtType, b: ThoughtType) => {
          var date_a = new Date(a.createdAt).getMilliseconds();
          var date_b = new Date(b.createdAt).getMilliseconds();
          return date_b - date_a;
        })
        .map((thought) => {
          return <Thought thought={thought} />
        })}
    </div>
  )
}

export default ThoughtsList
