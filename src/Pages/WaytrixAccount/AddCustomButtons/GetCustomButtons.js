// GetCustomButtonsScreen.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './GetCustomButtons.css';

const GetCustomButtonsScreen = () => {
  const { id } = useParams();
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const response = await axios.post(
          'https://waytrixback.onrender.com/api/ButtonsRoutes/getRestoSpecificCustomButtons',
          { restoId: id },
          {
            headers: {
              Authorization: `${waytrixToken}`
            }
          }
        );
        setButtons(response.data);
      } catch (error) {
        console.error('Error fetching custom buttons:', error);
      }
    };
    

    fetchData();
  }, [id]);

  const handleDeleteButton = async (_id) => {
    try {
      const waytrixToken = localStorage.getItem('waytrixToken');
      const config = {
        headers: {
          Authorization: `${waytrixToken}`
        }
      };
  
      await axios.post(
        'https://waytrixback.onrender.com/api/ButtonsRoutes/deleteCustomButton',
        { _id },
        config
      );
  
      // After deletion, fetch updated buttons
      const response = await axios.post(
        'https://waytrixback.onrender.com/api/ButtonsRoutes/getRestoSpecificCustomButtons',
        { restoId: id },
        config
      );
  
      setButtons(response.data);
    } catch (error) {
      console.error('Error deleting custom button:', error);
    }
  };
  

  return (
    <div className="custom-buttons-container">
      <h1 style={{ color: 'white' }}>Custom Buttons for ID: {id}</h1>
      <div className="buttons-list">
        {buttons.map(button => (
          <div key={button._id} className="custom-button">
            <img style={{ filter: 'brightness(0) invert(1)', height: '50px', width: '50px' }} src={button.svgLink} alt="Custom Button" />
            <p style={{ color: 'white' }}>{button.order}</p>
            <button onClick={() => handleDeleteButton(button._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetCustomButtonsScreen;
