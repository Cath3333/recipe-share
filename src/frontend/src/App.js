// src/App.js

import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './components/auth/AuthContext';
import { Nav } from './components/layout/Nav';
import { RecipeList } from './components/recipes/RecipeList';
import { Cookbook } from './components/cookbook/Cookbook';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register'; // Import the Register component
import { Routes, Route, Navigate } from 'react-router-dom';

import './App.css';

const AppContent = () => {
  const { token } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/" />}
          />

          {/* Register Route */}
          <Route
            path="/register"
            element={!token ? <Register /> : <Navigate to="/" />}
          />

          {/* Cookbook Route */}
          <Route
            path="/cookbook"
            element={token ? <Cookbook /> : <Navigate to="/login" />}
          />

          {/* Home/RecipeList Route */}
          <Route
            path="/"
            element={token ? <RecipeList /> : <Navigate to="/login" />}
          />

          {/* Catch-All Route: Redirect unknown paths to home or login based on auth */}
          <Route
            path="*"
            element={token ? <Navigate to="/" /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
