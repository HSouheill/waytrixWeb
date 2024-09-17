import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './getTableAccounts.css';
import { useNavigate } from 'react-router-dom';

const GetTableAccountsLuxurious = () => {
  const [accounts, setAccounts] = useState([]);
  const [restoInfo, setRestoInfo] = useState({});
  const navigate = useNavigate();

  const fetchAccounts = useCallback(async () => {
    const waytrixToken = localStorage.getItem('waytrixToken');
    if (!waytrixToken) {
      console.error('Waytrix token not found in localStorage');
      return;
    }

    try {
      const response = await axios.get('https://waytrixback.onrender.com/api/Auth/getTableAccounts', {
        headers: {
          Authorization: waytrixToken,
        },
      });
      setAccounts(response.data);

      // Fetch restaurant info for each account
      await Promise.all(response.data.map(async (account, index) => {
        try {
          const res = await axios.post('https://waytrixback.onrender.com/api/Auth/getRestoInfo', { restoId: account.restoId }, {
            headers: {
              Authorization: waytrixToken,
            },
          });
          setRestoInfo(prevState => ({
            ...prevState,
            [account._id]: res.data,
          }));

          // Delay the second request
          if (index < response.data.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
          }
        } catch (error) {
          console.error('Error fetching restaurant info: ', error);
        }
      }));
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <div className="containerwaiter">
      {accounts.map(account => (
        <div className="card" key={account._id}>
          <div className="content">
            <h3>{account.name}</h3>
            <p><span className='bold'>Email:</span> {account.email}</p>
            <p><span className='bold'>Phone:</span> {account.phone}</p>
            <p><span className='bold'>Role:</span> {account.role}</p>
            <p><span className='bold'>Restaurant:</span> {restoInfo[account._id] ? restoInfo[account._id].name : 'Loading...'}</p>
            <button onClick={() => navigate(`/AddWaiter/${account.restoId}/${account._id}`)}>View Details</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GetTableAccountsLuxurious;
