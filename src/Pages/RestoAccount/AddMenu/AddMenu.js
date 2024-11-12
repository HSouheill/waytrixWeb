import React, { useState } from 'react';
import axios from 'axios';
import './AddMenu.css';
import { ipAddress } from '../../../config';

const AddMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const restoId = localStorage.getItem('restoId');
    const imageLink = event.target.imageLink.value;
    const restoToken = localStorage.getItem('restoToken');
    const data = { restoId, imageLink };
  
    try {
      await axios.post(`${ipAddress}/api/ButtonsRoutes/AddMenu`, data, {
        headers: {
          Authorization: `${restoToken}`
        }
      });
      setModalVisible(true);
      setTimeout(() => {
        window.location.reload(); // Refresh the page after 5 seconds
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container">
      <h1>Add/Update Menu Screen</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="imageLink">Menu Link (insert website link or google drive PDF link):</label>
        <input type="text" id="imageLink" name="imageLink" required />
        <center>
          <button type="submit">Submit</button>
        </center>
      </form>

      {modalVisible && (
        <div className="modall">
          <h2>Menu Updated Successfully</h2>
        </div>
      )}
    </div>
  );
};

export default AddMenu;