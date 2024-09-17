import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './GetRestoAccounts.css';

const GetRestoAccounts = () => {
  const [restoAccounts, setRestoAccounts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('waytrixToken');
    axios.get('https://waytrixback.onrender.com/api/VideoRoutes/GetAllRestoAccounts', {
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
  

  return (
    <div className="resto-accounts-container">
      {restoAccounts.map(account => (
        <Link key={account._id} to={`/AddVideo/${account._id}`} className="resto-card">
          <h2>{account.name}</h2>
          <p>Email: {account.email}</p>
          <p>Phone: {account.phone}</p>
          <p>Role: {account.role}</p>
          <p>Verified: {account.verified ? 'Yes' : 'No'}</p>
        </Link>
      ))}
    </div>
  );
};

export default GetRestoAccounts;
