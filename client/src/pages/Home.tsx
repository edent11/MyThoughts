import React from 'react'
import ThoughtsList from '../components/ThoughtsList'

const Home = () => {
  return (
    <div className="w-full flex justify-center dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-900 h-full">
      <ThoughtsList />
    </div>
  )
}

export default Home
