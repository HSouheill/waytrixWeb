import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TableLocations.css';
import { ipAddress } from '../../../config';

const TableLocations = () => {
  const [locations, setLocations] = useState([]);
  const [restoNames, setRestoNames] = useState({}); // Store restaurant names by restoId

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const config = {
          headers: {
            Authorization: `${waytrixToken}`,
          },
        };

        const response = await axios.get(`${ipAddress}/api/Auth/GetTableLocations`, config);
        setLocations(response.data);

        // Fetch restaurant names
        const uniqueRestoIds = [...new Set(response.data.map(location => location.restoId))];
        await fetchRestoNames(uniqueRestoIds);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const fetchRestoNames = async (restoIds) => {
      try {
        const namePromises = restoIds.map(async (restoId) => {
          // No authorization for this request
          const response = await axios.post(`${ipAddress}/api/Auth/getRestoNameById`, { userId: restoId });
          return { restoId, name: response.data.name };
        });

        // Wait for all requests to complete
        const names = await Promise.all(namePromises);
        const namesMap = names.reduce((acc, { restoId, name }) => {
          acc[restoId] = name; // Map restoId to its corresponding name
          return acc;
        }, {});

        setRestoNames(namesMap); // Store the restaurant names
      } catch (error) {
        console.error('Error fetching restaurant names:', error);
      }
    };

    fetchLocations();
  }, []);

  // Group locations by restoId
  const groupedByResto = locations.reduce((acc, location) => {
    if (!acc[location.restoId]) {
      acc[location.restoId] = [];
    }
    acc[location.restoId].push(location);
    return acc;
  }, {});

  
  // Background colors for different groups
  const backgroundColors = ['#4d4d4d', '#4d4d4d', '#4d4d4d', '#4d4d4d', '#4d4d4d'];
  return (
    <div className="table-locations-container">
      <h1 className="table-locations-title">Table Locations</h1>
      <div className="locations-list">
        {Object.keys(groupedByResto).map((restoId, index) => (
          <div
            key={restoId}
            className="resto-block"
            style={{ backgroundColor: backgroundColors[index % backgroundColors.length] }}
          >
            <h2 className="resto-title">Restaurant Name: {restoNames[restoId] || 'Loading...'}</h2>
            {groupedByResto[restoId].map((location) => (
              <div key={location._id} className="location-card">
                <h3>{location.name}</h3>
                <p className="location-info">Email: {location.email}</p>
                <p className="location-info">Phone: {location.phone}</p>
                <p className="location-info">Latitude: {location.latitude}</p>
                <p className="location-info">Longitude: {location.longitude}</p>
                <div className="osm-map">
                  <iframe
                    title={`Map for ${location.name}`}
                    width="600"
                    height="450"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude},${location.latitude},${location.longitude},${location.latitude}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableLocations;
