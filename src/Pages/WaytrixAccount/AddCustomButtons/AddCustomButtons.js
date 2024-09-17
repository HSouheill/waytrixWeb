import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddCustomButtonsScreen.css';
import Multer from '../AddVideo/multer/multer';
import { Link } from 'react-router-dom';

const AddCustomButtonsScreen = () => {
  const { id } = useParams();
  const [order, setOrder] = useState('');
  const [svgLink, setSvgLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jsonData = {
      restoId: id,
      order,
      svgLink
    };
  
    try {
      const waytrixToken = localStorage.getItem('waytrixToken');
      const headers = {
        Authorization: `${waytrixToken}`
      };
  
      await axios.post('https://waytrixback.onrender.com/api/ButtonsRoutes/AddCustomButtons', jsonData, { headers });
      setShowModal(true);
      setOrder('');
      setSvgLink('');
      setTimeout(() => {
        setShowModal(false);
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error('Error adding custom button:', error);
    }
  };
  

  return (
    <center>
      <div className="dark-theme-form">
        <Multer />
        <Link to={`/GetCustomButtons/${id}`}>
  <button>View All Custom Buttons</button>
</Link>

        <h1>Add Custom Buttons Screen</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="order">Order</label>
          <input 
            type="text" 
            id="order" 
            value={order} 
            onChange={(e) => setOrder(e.target.value)} 
          />
          <label htmlFor="svgLink">SVG Link</label>
          <input 
            type="text" 
            id="svgLink" 
            value={svgLink} 
            onChange={(e) => setSvgLink(e.target.value)} 
          />
          <button type="submit">Submit</button>
        </form>
        {showModal && (
          <div className="dark-theme-modal">
            <p>Custom button has been added successfully!</p>
          </div>
        )}
      </div>
    </center>
  );
};

export default AddCustomButtonsScreen;
