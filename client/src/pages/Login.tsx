import React, { useEffect, useRef } from 'react'
import LoginBox from '../components/authentication/LoginBox'

const Login = () => {

  return (
    <div
      id="loginContainer"
      className="flex flex-col items-center justify-center border-box relative w-[95vw] max-h-[600px] h-[calc(100vh-4rem)] ease-in-out duration-700"
    >
      <LoginBox />
    </div>
  )
}

export default Login
