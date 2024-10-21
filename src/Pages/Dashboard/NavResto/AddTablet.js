import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ipAddress } from '../../../config';

const AddTablet = () => {
  const [restoToken, setRestoToken] = useState('');
  const [name, setName] = useState(''); // Name input
  const [email, setEmail] = useState(''); // Email input
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('table');
  const [showModal, setShowModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
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
    
    if (role === 'table' && password.length < 8) {
      setPasswordError('Password must be at least 8 characters long for table accounts.');
      return;
    }

    const data = {
      name, // Store the name input
      email, // Store the email input
      phone: role === 'table' ? 1234567890 : phone, // Default phone number for role 'table'
      password,
      role,
      restoId
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
        <h2>Add TABLE</h2>
        {role !== 'table' && (
          <>
            <label>
              Name: {/* Name input */}
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Phone: {/* Phone input */}
              <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
          </>
        )}
        <label>
              Num: {/* Name input */}
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email: {/* Email input */}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <label>
          Role:
          <select style={{ width: '100%' }} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="table">Table</option>
            {/* <option value="valet">Valet</option> */}
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
      {showModal && (
        <div className="modal">
          <p style={{ color: 'white' }}>The account of the {role} has been added successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AddTablet;
