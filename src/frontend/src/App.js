import React, { useState, useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from './components/auth/AuthContext';
import { Nav } from './components/layout/Nav';
import { RecipeList } from './components/recipes/RecipeList';
import { Cookbook } from './components/cookbook/Cookbook';
import { Login } from './components/auth/Login';
import { Routes, Route, Navigate } from 'react-router-dom';


import './App.css';
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { token } = React.useContext(AuthContext);

  useEffect(() => {
    if (!token && currentPage !== 'login') {
      setCurrentPage('login');
    }
  }, [token, currentPage]);


  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/cookbook" element={token ? <Cookbook/> : <Navigate to="/login" />} />
          
          <Route path="/" element={token ? <RecipeList /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
    

  );
};



export default App;
