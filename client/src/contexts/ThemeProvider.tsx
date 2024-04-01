import React, { createContext, useState, useContext } from 'react'
import { useLocalStorage } from 'usehooks-ts'

interface ThemeContextType {
  theme: 'dark' | 'light'
  isDarkMode: () => boolean
  toggle: () => void
}

interface Props {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext)

const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark')

  const isDarkMode = () => {
    return theme === 'dark' ? true : false
  }

  const toggle = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  if (!ThemeContext) {
    throw new Error(
      'useCurrentUser has to be used within <CurrentUserContext.Provider>',
    )
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggle, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
