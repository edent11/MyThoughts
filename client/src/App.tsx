import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import logo from './logo.svg';
import { useTheme } from './contexts/ThemeProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {

  const theme = useTheme();

  return (
    <div className="w-full h-full">

      <NavBar />

      <main className={` w-full flex flex-col items-center justify-center
       text-white bg-gradient-to-l ${theme?.isDarkMode() ? 'from-gray-900 to-gray-800' : 'bg-gray-400'}`}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Home />} />
        </Routes>

      </main>
    </div>
  );
}

export default App;
