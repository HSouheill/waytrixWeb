import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TableLocations.css';
import { ipAddress } from '../../../config';

const TableLocations = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const config = {
          headers: {
            Authorization: `${waytrixToken}`
          }
        };
  
        const response = await axios.get(`${ipAddress}/api/Auth/GetTableLocations`, config);
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
  
    fetchLocations();
  }, []);
  

  return (
    <div className="table-locations-container">
      <h1 className="table-locations-title">TableLocations</h1>
      <div className="locations-list">
        {locations.map((location) => (
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
    </div>
  );
};

export default TableLocations;
