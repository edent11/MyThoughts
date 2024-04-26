import React, { createContext, useState, useContext } from 'react'
import useSWR, { mutate } from 'swr'
import { useLocalStorage } from 'usehooks-ts'

export interface User {
  _id: string
  username: string
  avatar: string
  session_token: string
}

export interface UserNotification {
  _id: string
  username: string
  avatar: string
}

export interface UserProfileData {
  user: User
  thoughts: number
  comments: number
  commentsReceived: number
  likes: number
  likesReceived: number
  tags: number

}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData extends LoginData {
  username: string,
  password: string,
  avatarImg: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

interface AuthContextType {
  isAuthenticated: () => boolean
  getUser: () => User | null
  login: (loginData: LoginData) => null | Promise<boolean | string>
  logout: () => null | Promise<boolean>
  register: (registerData: RegisterData) => null | Promise<boolean | string>
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
}

interface Props {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: () => false,
  login: () => null,
  register: () => null,
  logout: () => null,
  getUser: () => null,
})

export const useAuth = () => useContext(AuthContext)

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [authState, setAuthState] = useLocalStorage<AuthState>(
    'authState',
    initialAuthState,
  )

  const fetchAndSetUser = async (
    fetch_url: string,
    data: LoginData | RegisterData,
  ): Promise<string | boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(fetch_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify(data),
          credentials: 'include',
        })

        if (!response.ok) {
          // Get the response message
          const message = await response.text()
          throw new Error(message)
        }

        const session_token = response.headers.get('session_token')

        if (!session_token) {
          console.log(session_token)
          throw new Error("Couldn't get session token")
        }

        await response.json().then((userDetails) => {
          setAuthState({
            isAuthenticated: true,
            user: {
              _id: userDetails._id,
              username: userDetails.username,
              avatar: userDetails.avatar,
              session_token: session_token,
            },
          })
        })
        // Invalidate the cache for the /api/user endpoint
        mutate(fetch_url)
        resolve(true)
      } catch (error: any) {
        console.error(error.message)
        reject(error.message)
      }
    })
  }

  const login = (loginData: LoginData): Promise<string | boolean> => {
    return fetchAndSetUser('http://localhost:5000/auth/login', loginData)
  }

  const register = (registerData: RegisterData): Promise<string | boolean> => {
    return fetchAndSetUser('http://localhost:5000/auth/register', registerData)
  }

  const logout = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setAuthState({
        isAuthenticated: false,
        user: null,
      })

      resolve(true)
    })
  }

  const getUser = (): User | null => {
    if (authState.user) return authState?.user
    return null
  }

  const isAuthenticated = (): boolean => {
    return authState.isAuthenticated
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, getUser }}>

      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
