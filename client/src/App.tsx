import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import PrivateRoute from './components/authentication/PrivateRoute'
import { useTheme } from './contexts/ThemeProvider'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'


function App() {
  const theme = useTheme()

  return (
    <div className={`${theme?.isDarkMode() ? 'dark' : ''}  w-full h-full`}>
      <NavBar />

      <main
        className={`w-full flex flex-col items-center justify-center
       text-white bg-gradient-to-l bg-gray-400 dark:from-gray-900 dark:to-gray-800`}
      >
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* private routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/account" element={<Home />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
