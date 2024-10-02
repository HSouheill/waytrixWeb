import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ipAddress } from '../../../config';

const AddValet = () => {
  const [restoToken, setRestoToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access the query params

  // Function to extract query parameters
  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  useEffect(() => {
    const token = localStorage.getItem('restoToken');
    setRestoToken(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    // Extract the restoId from the URL's query string
    const queryParams = getQueryParams(location.search);
    const restoId = queryParams.get('restoId'); // Get the 'id' param as restoId

    
    const data = {
      name,
      email,
      phone,
      password,
      role: 'valet', // Hardcoding the role to 'valet'
      restoId // Add restoId from query params
    };

    try {
      const waytrixToken = localStorage.getItem('waytrixToken');

      const response = await axios.post(
        `${ipAddress}/api/Auth/signupTableValet`,
        data,
        {
          headers: {
            Authorization: `${waytrixToken}`
          }
        }
      );
      console.log(response.data);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="luxurious-dark-form">
        <h2>Add VALET</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Phone:
          <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <button type="submit">Submit</button>
      </form>
      {showModal && (
        <div className="modal">
          <p style={{ color: 'white' }}>The account of the valet has been added successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AddValet;
