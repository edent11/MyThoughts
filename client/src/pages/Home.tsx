import React from 'react'
import ThoughtsList from '../components/ThoughtsList'

const Home = () => {
  return (
    <div className="w-full dark:bg-blue-950 max-h-[calc(100vh - 4rem)] overflow-hidden">
      <ThoughtsList />
    </div>
  )
}

export default Home
