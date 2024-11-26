import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import Guests from './components/Guests';
import Expenses from './components/Expenses';
import VenueLayout from './components/VenueLayout';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/guests" element={<Guests />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/venue-layout" element={<VenueLayout />} />
    </Routes>
  );
};

export default App;
