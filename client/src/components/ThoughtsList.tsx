import React, { useEffect, useState } from 'react'
import { useFetcher } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import Thought from './card/Thought';
import { ThoughtType } from '../components/card/Thought'



const ThoughtsList = () => {

    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data: thoughtsList, isLoading, error } = useSWR<ThoughtType[]>(`http://localhost:5000/thoughts/`, fetcher);



    if (error) {
        return <div>Error loading user profiles</div>;
    }

    if (!thoughtsList) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col gap-5'>
            {thoughtsList.map((thought) => {
                return <Thought thought={thought} />
            })}
        </div>
    )
}

export default ThoughtsList