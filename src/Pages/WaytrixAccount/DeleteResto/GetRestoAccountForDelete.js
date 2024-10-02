import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './GetRestoAccounts.css';
import { ipAddress } from '../../../config';

const GetRestoAccounts = () => {
  const [restoAccounts, setRestoAccounts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('waytrixToken');
    axios.get(`${ipAddress}/api/VideoRoutes/GetAllRestoAccounts`, {
      headers: {
        Authorization: `${token}`
      }
    })
    .then(response => {
      setRestoAccounts(response.data);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, []);

  const handleDelete = (restoId) => {
    const token = localStorage.getItem('waytrixToken');
    axios.post(`${ipAddress}/api/Auth/delete_resto`, 
      { restoId },
      {
        headers: {
          Authorization: `${token}`
        }
      }
    )
    .then(response => {
      setRestoAccounts(prevAccounts => prevAccounts.filter(account => account._id !== restoId));
    })
    .catch(error => {
      console.error('Error deleting record: ', error);
    });
  };

  return (
    <div className="resto-accounts-container">
      {restoAccounts.map(account => (
        <div key={account._id} className="resto-card">
          <h2>{account.name}</h2>
          <p>Email: {account.email}</p>
          <p>Phone: {account.phone}</p>
          <p>Role: {account.role}</p>
          <p>Verified: {account.verified ? 'Yes' : 'No'}</p>
          <button onClick={() => handleDelete(account._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default GetRestoAccounts;
