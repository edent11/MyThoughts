import React, { useEffect, useRef, useState } from 'react'
import { useFetcher } from 'react-router-dom'
import useSWR, { mutate } from 'swr'

import { ThoughtType } from './shared/types/ThoughtTypes'
import { fetcher, fetcherData } from './shared/utils'
import Thought from './card/Thought'

const debounce = (func: Function, delay: number) => {
  let timerId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

type Props = {
  session_token?: string
}

const ThoughtsList: React.FC<Props> = ({ session_token }) => {

  const THOUGHTS_THRESHOLD: number = 2; // equals the THOUGHTS_THRESHOLD in the server thoughts file
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollThoughtIndex, setScrollThoughtIndex] = useState<number>(0);
  const [thoughtsList, setThoughtsList] = useState<ThoughtType[]>([]);
  const [fetching, setFetching] = useState(false);


  const { data: newThoughts, error, isLoading } = useSWR<ThoughtType[]>(`http://localhost:5000/thoughts/${scrollThoughtIndex}`, fetcher);


  const handleScroll = debounce(() => {
    const scrollBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
    if (scrollBottom && !fetching && !error && newThoughts && newThoughts.length > 0) {
      setFetching(true); // Set fetching state to prevent multiple fetches
      setScrollThoughtIndex(prevIndex => prevIndex + THOUGHTS_THRESHOLD);
    }
  }, 300); // Debounce time (adjust as needed)

  // Update data when new data is fetched
  useEffect(() => {
    if (newThoughts) {
      setThoughtsList((prevThoughts: ThoughtType[]) => [...prevThoughts, ...newThoughts]);
    }
    console.log(scrollThoughtIndex)
  }, [newThoughts]);

  useEffect(() => {
    containerRef.current?.addEventListener('scroll', handleScroll);
    return () => containerRef.current?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (fetching && !error && newThoughts) {
      setFetching(false); // Reset fetching state after fetch is complete
    }
  }, [fetching, error, newThoughts]);


  if (error) {
    return <div>Error loading user profiles</div>
  }

  if (!thoughtsList || thoughtsList == undefined) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-full gap-5 w-full overflow-y-scroll py-6" ref={containerRef}>
      {thoughtsList
        // ?.sort((a: ThoughtType, b: ThoughtType) => {
        //   var date_a = new Date(a.createdAt).getMilliseconds();
        //   var date_b = new Date(b.createdAt).getMilliseconds();
        //   return date_b - date_a;
        // })
        .map((thought) => {
          return <Thought thought={thought} key={thought._id} />
        })}
    </div>
  )
}

export default ThoughtsList
