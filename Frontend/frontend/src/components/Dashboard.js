import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import guestsIcon from '../assets/guests-icon.png'; // תמונה עבור אורחים
import expensesIcon from '../assets/expenses-icon.png'; // תמונה עבור הוצאות
import layoutIcon from '../assets/layout-icon.png'; // תמונה עבור סקיצה של אולם

const Dashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // שליפה מ-localStorage

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing!');
      navigate('/'); // חזרה לדף הבית אם אין userId
    }
  }, [userId, navigate]);

  if (!userId) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <p className="dashboard-description">
        Welcome to your dashboard! Here you can manage your event details, including guests, expenses, and the venue layout.
      </p>
      <div className="dashboard-buttons">
        <button onClick={() => navigate('/guests')} className="dashboard-button">
          <img src={guestsIcon} alt="Guests" className="button-icon-large" />
          Manage Guests
        </button>
        <button onClick={() => navigate('/expenses')} className="dashboard-button">
          <img src={expensesIcon} alt="Expenses" className="button-icon-large" />
          Manage Expenses
        </button>
        <button onClick={() => navigate('/venue-layout')} className="dashboard-button">
          <img src={layoutIcon} alt="Venue Layout" className="button-icon-large" />
          Venue Layout
        </button>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem('userId');
          navigate('/');
        }}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
