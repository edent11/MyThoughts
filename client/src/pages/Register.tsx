import React, { useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeProvider'
import RegisterBox from '../components/authentication/RegisterBox'

const Register = () => {
  const theme = useTheme()

  return (
    <div
      id="loginContainer"
      className="flex flex-col items-center justify-center border-box relative w-[95vw] max-h-[600px] h-[calc(100vh-4rem)] ease-in-out duration-700"
    >
      <RegisterBox />
    </div>
  )
}

export default Register
