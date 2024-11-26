import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addGuest, getGuests, deleteGuest } from '../api';
import '../styles/Guests.css';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ firstName: '', lastName: '', side: '', additionalGuests: 0 });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing!');
      navigate('/');
      return;
    }

    const fetchGuests = async () => {
      try {
        const response = await getGuests(userId);
        const sortedGuests = response.data.sort((a, b) => {
          if (a.side.toLowerCase() === b.side.toLowerCase()) {
            return a.lastName.localeCompare(b.lastName);
          }
          return a.side.localeCompare(b.side);
        });
        setGuests(sortedGuests);
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    };
    fetchGuests();
  }, [userId, navigate]);

  const handleAddGuest = async () => {
    if (newGuest.firstName && newGuest.lastName && newGuest.side) {
      try {
        const response = await addGuest({ userId, ...newGuest });
        const updatedGuests = [...guests, response.data.guest].sort((a, b) => {
          if (a.side.toLowerCase() === b.side.toLowerCase()) {
            return a.lastName.localeCompare(b.lastName);
          }
          return a.side.localeCompare(b.side);
        });
        setGuests(updatedGuests);
        setNewGuest({ firstName: '', lastName: '', side: '', additionalGuests: 0 });
      } catch (error) {
        console.error('Error adding guest:', error);
      }
    }
  };

  const handleDeleteGuest = async (id) => {
    try {
      await deleteGuest(id);
      setGuests(guests.filter((guest) => guest._id !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const calculateTotalGuests = () => {
    return guests.reduce((total, guest) => total + 1 + guest.additionalGuests, 0);
  };

  return (
    <div className="guests-container">
      <h2 className="guests-title">Manage Guests</h2>
      <form className="guests-form">
        <input
          type="text"
          placeholder="First Name"
          value={newGuest.firstName}
          onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
          className="guest-input"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newGuest.lastName}
          onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
          className="guest-input"
        />
        <input
          type="text"
          placeholder="Side (e.g., Bride/Groom)"
          value={newGuest.side}
          onChange={(e) => setNewGuest({ ...newGuest, side: e.target.value })}
          className="guest-input"
        />
        <input
          type="number"
          placeholder="Additional Guests"
          value={newGuest.additionalGuests}
          min="0"
          onChange={(e) => setNewGuest({ ...newGuest, additionalGuests: parseInt(e.target.value) || 0 })}
          className="guest-input"
        />
        <button type="button" onClick={handleAddGuest} className="guest-button">
          Add Guest
        </button>
      </form>
      <h3 className="guests-list-title">Guest List</h3>
      <table className="guests-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Side</th>
            <th>Additional Guests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest._id}>
              <td>{guest.firstName}</td>
              <td>{guest.lastName}</td>
              <td>{guest.side}</td>
              <td>{guest.additionalGuests}</td>
              <td>
                <button onClick={() => handleDeleteGuest(guest._id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="total-guests">Total Guests: {calculateTotalGuests()}</h3>
      <button onClick={() => navigate('/dashboard')} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );
};

export default Guests;
