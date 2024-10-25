import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ipAddress } from '../../../config';

const AddWaiter = () => {
  const [restoToken, setRestoToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('waiter'); // Default role set to waiter
  const [showModal, setShowModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restoId = queryParams.get('restoId');

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

    const data = {
      name,
      email,
      phone: '1234567', // Automatically set phone number
      password,
      role,
      restoId
    };

    try {
      const waytrixToken = localStorage.getItem('waytrixToken');
      console.log('Waytrix Token:', waytrixToken); // Log token

      if (!waytrixToken) {
        throw new Error('Waytrix token is missing.');
      }

      const response = await axios.post(
        `${ipAddress}/api/Auth/signupWaiter`,
        data,
        {
          headers: {
            Authorization: waytrixToken
          }
        }
      );
      console.log('Response:', response.data);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        window.location.reload(); // Force refresh the page
        //navigate('/');
      }, 5000);
    } catch (error) {
      console.error('Error occurred:', error.response ? error.response.data : error.message);
      setPasswordError('An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="luxurious-dark-form">
        <h2>Add Waiter</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span 
              onClick={togglePasswordVisibility} 
              style={{ 
                position: 'absolute', 
                right: '10px', 
                top: '44%', 
                transform: 'translateY(-50%)', 
                cursor: 'pointer' 
              }}>
              {showPassword ? '👁️' : '👁️‍🗨️'} {/* Eye icon to toggle visibility */}
            </span>
          </div>
        </label>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <button type="submit">Submit</button>
      </form>
      {showModal && (
        <div className="modal">
          <p style={{ color: 'white' }}>The account of the waiter has been added successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AddWaiter;
