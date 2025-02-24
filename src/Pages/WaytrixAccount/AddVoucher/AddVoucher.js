import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddVoucher.css';
import Multer from '../AddVideo/multer/multer';
import { ipAddress } from '../../../config';

const AddVoucher = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    pointsCost: '',
    Quantity: '',
    email: '',
    restoIdArray: [], // Array to store selected restaurant IDs
    partnerId: '',
  });

  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [partners, setPartners] = useState([]); // To store partners

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const config = {
          headers: {
            Authorization: `${waytrixToken}`
          }
        };
        const response = await axios.get(`${ipAddress}/api/PartnerAccountRoutes/partner_get_resto_account`, config);
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const config = {
          headers: {
            Authorization: `${waytrixToken}`,
          },
        };
        const response = await axios.get(`${ipAddress}/api/ContactUsRoutes/getAllPartners`, config);
        setPartners(response.data); // Assuming the API response contains an array of partner objects
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };
  
    fetchPartners();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Quantity' || name === 'pointsCost') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.trim() === '' ? '' : parseInt(value) || '',
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        restoIdArray: [...prevData.restoIdArray, value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        restoIdArray: prevData.restoIdArray.filter(id => id !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const waytrixToken = localStorage.getItem('waytrixToken');
      const config = {
        headers: {
          Authorization: `${waytrixToken}`,
        },
      };
      const response = await axios.post(`${ipAddress}/api/ContactUsRoutes/AddVoucher`, formData, config);
      console.log(response.data);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        window.location.reload(); // Force refresh the page
      }, 5000);
  
      setFormData({
        name: '',
        description: '',
        image: '',
        pointsCost: '',
        Quantity: '',
        email: '',
        restoIdArray: [],
        partnerId: '', // Reset partnerId after submission
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <center>
      <div className="add-voucher-container">
        <Multer />
        <h1 className="form-title">Voucher Page</h1>
        <center className='center'>
        <button type="submit" style={{ marginBottom: 20 }} className="submit-button" onClick={() => { window.location.href = '/EditVoucher'; }}>ALL VOUCHERS</button>
      </center>
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="form-label">
            Description:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="form-label">
            Image URL:
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="form-label">
            Points Cost:
            <input
              type="number"
              name="pointsCost"
              value={formData.pointsCost}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="form-label">
            Quantity:
            <input
              type="number"
              name="Quantity"
              value={formData.Quantity}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="form-label">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="form-label">
              Select Partner:
                <select
                    name="partnerId"
                    value={formData.partnerId}
                    onChange={handleChange}
                    className="dropdown1"
                    style={{ marginTop: '5px' }} // Add your desired margin here
                  >
                    <option value="">--Select Partner--</option>
                    {partners.map((partner) => (
                      <option key={partner._id} value={partner._id}>
                        {partner.name}
                      </option>
                    ))}
                </select>
          </label>

          <div className="restaurants-list">
            {restaurants.map((restaurant) => (
              <label key={restaurant._id} className="checkbox-label">
                <input
                  type="checkbox"
                  name="restoIdArray"
                  value={restaurant._id}
                  checked={formData.restoIdArray.includes(restaurant._id)}
                  onChange={handleCheckboxChange}
                />
                {restaurant.name}
              </label>
            ))}
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      {showModal && (
        <div className="modal">
          <p style={{ color: 'white' }}>Vouchers added successfully!</p>
        </div>
      )}
    </center>
  );
};

export default AddVoucher;
