import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import '../styles/VenueLayout.css'; // ייבוא עיצוב CSS

const VenueLayout = () => {
  const [elements, setElements] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedElementId, setSelectedElementId] = useState(null); // זיהוי האלמנט שנבחר
  const userId = localStorage.getItem('userId'); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLayout = async () => {
      if (!userId) {
        setMessage('User ID is missing. Please log in again.');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/layouts/${userId}`);
        setElements(response.data.elements || []);
        setMessage('Layout fetched successfully!');
      } catch (error) {
        console.error('Error fetching layout:', error);
        setMessage('Could not fetch layout.');
      }
    };
    fetchLayout();
  }, [userId]);

  const saveLayout = async () => {
    if (!userId) {
      setMessage('User ID is missing. Please log in again.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/layouts', {
        userId,
        elements,
      });
      setMessage('Layout saved successfully!');
    } catch (error) {
      console.error('Error saving layout:', error);
      setMessage('Error saving layout.');
    }
  };

  const deleteLayout = async () => {
    if (!userId) {
      setMessage('User ID is missing. Please log in again.');
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/layouts/${userId}`);
      setElements([]);
      setMessage('Layout deleted successfully!');
    } catch (error) {
      console.error('Error deleting layout:', error);
      setMessage('Error deleting layout.');
    }
  };

  const addElement = (type) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      x: 50,
      y: 50,
      width: type === 'rectangle' ? 100 : 80,
      height: type === 'rectangle' ? 100 : 80,
      text: '',
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (id, updates) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const deleteElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null); // מנקה את הבחירה אם האלמנט נמחק
  };

  const duplicateElement = (id) => {
    const elementToDuplicate = elements.find((el) => el.id === id);
    if (elementToDuplicate) {
      const duplicatedElement = {
        ...elementToDuplicate,
        id: Date.now().toString(),
        x: elementToDuplicate.x + 20,
        y: elementToDuplicate.y + 20,
      };
      setElements([...elements, duplicatedElement]);
    }
  };

  return (
    <div className="venue-container">
      <h1 className="venue-title">Venue Layout</h1>

      {message && <p className="venue-message">{message}</p>}

      <div className="venue-buttons">
        <button onClick={() => addElement('rectangle')} className="venue-button">Add Rectangle</button>
        <button onClick={() => addElement('circle')} className="venue-button">Add Circle</button>
        <button onClick={saveLayout} className="venue-button save-button">Save Layout</button>
        <button onClick={deleteLayout} className="venue-button delete-button">Delete Layout</button>
        <button onClick={() => navigate('/dashboard')} className="venue-button">Back to Dashboard</button>
      </div>

      <div className="venue-canvas">
        {elements.map((el) => (
          <Rnd
          key={el.id}
          default={{
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
          }}
          bounds="parent"
          minWidth={20} // גודל מינימלי לרוחב
          minHeight={20} // גודל מינימלי לגובה
          maxWidth={800} // גודל מקסימלי לרוחב
          maxHeight={500} // גודל מקסימלי לגובה
          onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => {
            updateElement(el.id, {
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              ...position,
            });
          }}
          onClick={() => setSelectedElementId(el.id)}
          className="venue-element"
          style={{
            backgroundColor: el.type === 'rectangle' ? '#ffe5b4' : '#add8e6',
            border: el.type === 'rectangle' ? '2px solid #cd853f' : '2px solid #4682b4',
            borderRadius: el.type === 'circle' ? '50%' : '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
            
            
          >
            <div className="element-content">
              <input
                type="text"
                value={el.text}
                onChange={(e) => updateElement(el.id, { text: e.target.value })}
                className="element-input"
              />
            </div>
          </Rnd>
        ))}
      </div>

      {selectedElementId && (
        <div className="action-buttons">
          <button onClick={() => deleteElement(selectedElementId)} className="action-button delete-button">Delete</button>
          <button onClick={() => duplicateElement(selectedElementId)} className="action-button duplicate-button">Duplicate</button>
        </div>
      )}
    </div>
  );
};

export default VenueLayout;
