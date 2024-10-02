import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ipAddress } from '../../../config';

const AddWaiterValet = () => {
  const [restoToken, setRestoToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  let {  tableId, restoId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('restoToken');
    setRestoToken(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      email,
      phone,
      password,
      role: 'waiter',
      restoId,
      tableId,
    };
  
    try {
      const waytrixToken = localStorage.getItem('waytrixToken'); // Get token from localStorage
      const response = await axios.post(`${ipAddress}/api/Auth/signupWaiter`, data, {
        headers: {
          Authorization: `${waytrixToken}` // Use waytrixToken for Authorization
        }
      });
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
          Phone:
          <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {showModal && (
        <div className="modal">
          <p style={{color:'white'}}>The account of the waiter has been added successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AddWaiterValet;
