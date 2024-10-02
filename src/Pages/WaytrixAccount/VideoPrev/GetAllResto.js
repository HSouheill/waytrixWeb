import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ipAddress } from '../../../config';

const GetRestoAccounts = () => {
  const [restoAccounts, setRestoAccounts] = useState([]);

  useEffect(() => {
    const waytrixToken = localStorage.getItem('waytrixToken');
    axios.get(`${ipAddress}/api/VideoRoutes/GetAllRestoAccounts`, {
      headers: {
        Authorization: `${waytrixToken}`
      }
    })
      .then(response => {
        setRestoAccounts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);
  

  const handleCardClick = async (restoId) => {
    try {
      const response = await axios.post(`${ipAddress}/api/VideoRoutes/getAllTablesByRestoId`, {
        restoId
      });
      const tableId = response.data._id;
      // Navigate to `/VidPrevScreen/${tableId}` after getting `_id` from response
      // You can use your preferred navigation method here
      window.location.href = `/VidPrevScreen/${tableId}`;
    } catch (error) {
      console.error('Error fetching tables data:', error);
    }
  };

  return (
    <div className="resto-accounts-container">
      {restoAccounts.map(account => (
        <div key={account._id} className="resto-card" onClick={() => handleCardClick(account._id)}>
          <h2>{account.name}</h2>
          <p>Email: {account.email}</p>
          <p>Phone: {account.phone}</p>
          <p>Role: {account.role}</p>
          <p>Verified: {account.verified ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};

export default GetRestoAccounts;
