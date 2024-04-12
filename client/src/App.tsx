import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { FaArrowCircleUp } from "react-icons/fa";
import NavBar from './components/NavBar'
import PrivateRoute from './components/authentication/PrivateRoute'
import { useTheme } from './contexts/ThemeProvider'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewThought from './pages/NewThought'


function App() {
  const theme = useTheme();

  const handleScroll = () => {

    window.scrollTo(0, 0);
  }

  return (
    <div className={`${theme?.isDarkMode() ? 'dark' : ''}  w-full h-full overflow-x-hidden`}>
      <NavBar />

      <main
        className={`w-full h-full flex flex-col items-center justify-center 
       text-white bg-gradient-to-l bg-gray-400 dark:from-gray-900 dark:to-gray-800`}
      >
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/newThought" element={<NewThought />} />

          {/* private routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/account" element={<Home />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
        <FaArrowCircleUp
          size={30}
          color='rgba(255, 0, 221, 1)'
          onClick={handleScroll}
          className='cursor-pointer bg-white fixed right-[10px] bottom-[10px] ring-2 ring-white rounded-full' />
      </main>
    </div>
  )
}

export default App
