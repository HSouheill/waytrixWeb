import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GetWaiters.css';

const GetWaiters = () => {
  const [waiters, setWaiters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWaiters = async () => {
      const restoId = localStorage.getItem('restoId');
      const restoToken = localStorage.getItem('restoToken'); // Assuming 'restoToken' is stored in localStorage
  
      try {
        const response = await axios.post(
          'https://waytrixback.onrender.com/api/Auth/GetWaytersByRestoId',
          { restoId },
          {
            headers: {
              Authorization: `${restoToken}` // Include Authorization header with restoToken
            }
          }
        );
        setWaiters(response.data);
      } catch (error) {
        console.error('Error fetching waiters:', error);
      }
    };
  
    fetchWaiters();
  }, []);
  

  const handleCardClick = (id) => {
    console.log(id);
    navigate(`/AssignTablesToWaiter/${id}`);
  };

  return (
    <div className="waiters-grid">
      {waiters.map(waiter => (
        <div className="waiter-card" key={waiter._id} onClick={() => handleCardClick(waiter._id)}>
          <h2 className="waiter-name">{waiter.name}</h2>
          <p className="waiter-info"><strong> Email:</strong> {waiter.email}</p>
          <p className="waiter-info"><strong> Phone:</strong> {waiter.phone}</p>
          <p className="waiter-info"><strong> Role: </strong>{waiter.role}</p>
        </div>
      ))}
    </div>
  );
}

export default GetWaiters;
