import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cards.css'; // Importing custom CSS for styling
import { ipAddress } from '../../../config';

const Cards = () => {
  const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const restoToken = localStorage.getItem('restoToken');
        const reqBody = {
          restoId: localStorage.getItem('restoId')
        };

        const response = await axios.post(
          `${ipAddress}/api/DashBoardRoutes/get_survey_num_by_restoId`,
          reqBody,
          {
            headers: {
              Authorization: `${restoToken}`
            }
          }
        );

        setSurveyData(response.data);
      } catch (error) {
        console.error('Error fetching survey data:', error);
      }
    };

    // Fetch data initially
    fetchSurveyData();

    // Fetch data every 3 seconds
    const interval = setInterval(fetchSurveyData, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dark-card" style={{marginTop:20}}>
      <h2 className="card-title">Analytics Data</h2>
      {surveyData && (
        <div className="card-content">
          <p><strong>Survey Count:</strong> {surveyData.surveyCount}</p>
          <p><strong>Car Count:</strong> {surveyData.carCount}</p>
          <p><strong>Waiter Count:</strong> {surveyData.waiterCount}</p>
          <p><strong>Table Count:</strong> {surveyData.tableCount}</p>
          <p><strong>Valet Count:</strong> {surveyData.valetCount}</p>
          <p><strong>Spin Counts:</strong> {surveyData.spinCounts}</p>
          <p><strong>Most Frequently Requested Order:</strong> {surveyData.mostFrequentlyRequestedOrder}</p>
        </div>
      )}
    </div>
  );
};

export default Cards;
