import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddResto.css';
import { ipAddress } from '../../config';

const AddResto = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [restoToken, setRestoToken] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const waytrixToken = localStorage.getItem('waytrixToken'); // Get waytrixToken from localStorage
  
      const response = await axios.post(
        `${ipAddress}/api/Auth/signupResto`,
        {
          name,
          email,
          phone: parseInt(phone), // assuming phone is a number in the API
          password,
          role: 'resto'
        },
        {
          headers: {
            Authorization: `${waytrixToken}`
          }
        }
      );
  
      console.log(response.data); // log the response from the API
      setRestoToken(response.data.token); // store the token in the state
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setSuccessModalVisible(true); // show the success modal
  
      setTimeout(() => {
        setSuccessModalVisible(false);
        navigate('/'); // navigate to '/' after 5 seconds
      }, 5000); // navigate to '/' after 5 seconds
  
    } catch (error) {
      console.error(error); // log any errors
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  return (
    <div className="form-container">
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Add Resto</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="name" style={{ color: 'white' }}>Name:</label>
        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required style={{ backgroundColor: 'black', color: 'white', padding: '5px', marginBottom: '10px' }} />

        <label htmlFor="email" style={{ color: 'white' }}>Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ backgroundColor: 'black', color: 'white', padding: '5px', marginBottom: '10px' }} />

        <label htmlFor="phone" style={{ color: 'white' }}>Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setPhone(e.target.value);
            }
          }}
          required
          style={{ backgroundColor: 'black', color: 'white', padding: '5px', marginBottom: '10px' }}
        />

        <label htmlFor="password" style={{ color: 'white' }}>Password:</label>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input 
            type={showPassword ? 'text' : 'password'} 
            id="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ backgroundColor: 'black', color: 'white', padding: '5px', width: '100%' }} 
          />
          <span 
            onClick={togglePasswordVisibility} 
            style={{ 
              position: 'absolute', 
              right: '1px', 
              top: '43%', 
              transform: 'translateY(-50%)', 
              cursor: 'pointer' 
            }}>
            {showPassword ? '👁️' : '👁️‍🗨️'} {/* Eye icon to toggle visibility */}
          </span>
        </div>

        <button type="submit" style={{ backgroundColor: 'white', color: 'black', padding: '8px 15px', marginTop: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
        {/* Your existing form inputs */}
      </form>

      {successModalVisible && (
        <div className="dark-theme-modal" style={{ backgroundColor: 'black', color: 'white', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', borderRadius: '5px', zIndex: '9999', animation: 'fade-in 1s ease-in-out' }}>
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Resto added successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AddResto;
