import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './NavResto.module.css';
import { ipAddress } from '../../../config';

const GetRestoAccounts = () => {
  const [restoAccounts, setRestoAccounts] = useState([]);
  const [waiterCounts, setWaiterCounts] = useState({});
  const [tableCounts, setTableCounts] = useState({});
  const [allTableLocations, setAllTableLocations] = useState({});

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const token = localStorage.getItem("waytrixToken");
        const headers = { Authorization: `${token}` };

        // Fetch restaurant accounts
        const { data: accounts } = await axios.get(
          `${ipAddress}/api/VideoRoutes/GetAllRestoAccounts`,
          { headers }
        );
        setRestoAccounts(accounts);

        // Fetch waiter and table counts for each restaurant
        await Promise.all(
          accounts.map(async (account) => {
            // Fetch waiters
            const waiterResponse = await axios.post(
              `${ipAddress}/api/Auth/getNumberOfWaitersByRestoId`,
              { restoId: account._id },
              { headers }
            );
            setWaiterCounts((prevCounts) => ({
              ...prevCounts,
              [account._id]: waiterResponse.data.count,
            }));

            // Fetch tables
            const tableResponse = await axios.post(
              `${ipAddress}/api/Auth/getNumberOfTablesByRestoId`,
              { restoId: account._id },
              { headers }
            );
            setTableCounts((prevCounts) => ({
              ...prevCounts,
              [account._id]: tableResponse.data.count,
            }));
          })
        );

        // Fetch all table locations
        const tableLocationsResponse = await axios.get(
          `${ipAddress}/api/Auth/GetTableLocations`,
          { headers }
        );
        const locations = tableLocationsResponse.data;
        // Organize locations by restoId
        const locationsByRestoId = locations.reduce((acc, location) => {
          if (!acc[location.restoId]) {
            acc[location.restoId] = [];
          }
          acc[location.restoId].push(location);
          return acc;
        }, {});
        setAllTableLocations(locationsByRestoId);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchRestaurantData();
  }, []);

  return (
    <>
      <div className="resto-accounts-container">
        {restoAccounts.map(account => (
          <Link key={account._id} to={`/restaurant/${account._id}`} className="resto-link">
            <div className="resto-card">
              <h2>{account.name}</h2>
              <p>Email: {account.email}</p>
              <p>Phone: {account.phone}</p>
              <p>Tables: {tableCounts[account._id] || 0}</p>
              <p>Waiters: {waiterCounts[account._id] || 0}</p>
  
              {/* Display location of the first table */}
              {allTableLocations[account._id] && allTableLocations[account._id].length > 0 ? (
                <div>
                  <p>Latitude: {allTableLocations[account._id][0].latitude}</p>
                  <p>Longitude: {allTableLocations[account._id][0].longitude}</p>
                  <iframe
                    title={`Map for First Table in ${account.name}`}
                    className={styles.map}
                    height="300"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${allTableLocations[account._id][0].longitude},${allTableLocations[account._id][0].latitude},${allTableLocations[account._id][0].longitude},${allTableLocations[account._id][0].latitude}`}
                  />
                </div>
              ) : (
                <p>No table locations available</p>
              )}
            </div>
          </Link>
        ))}
      </div>
  
      <div className={styles.addRestoButtonContainer}>
        <Link className={styles.link} to="/AddResto">Add Resto</Link>
      </div>
    </>
  );
};

export default GetRestoAccounts;
