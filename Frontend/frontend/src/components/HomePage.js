import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import WeddingImage from '../assets/wedding-image.png'; // נתיב התמונה

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <img src={WeddingImage} alt="Wedding Ceremony" className="home-image" />
      <h1 className="home-title">Wedding Organization System</h1>
      <p className="home-description">
        Welcome to the Wedding Organization System, designed to simplify your event planning process. 
        Manage guests, design seating arrangements, track costs, and ensure everything runs smoothly.
      </p>
      <p className="home-details">
        This system is built with React for the frontend and Node.js for the backend, providing you with a seamless and efficient user experience.
      </p>
      <div className="button-container">
        <button className="home-button" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="home-button" onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
    </div>
  );
};

export default HomePage;
