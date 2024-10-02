import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { ipAddress } from '../../../config';

import './Cards.css'; // Import CSS for styling

export const Cards = () => {
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
  
    // Fetch data initially when component mounts
    fetchSurveyData();
  
    // Fetch data every 10 seconds
    const interval = setInterval(fetchSurveyData, 10000);
  
    // Clean up interval to prevent memory leaks
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on mount
  

  const chartData = {
    labels: [
      'Survey Count',
      'Car Count',
      'Waiter Count',
      'Table Count',
      'Valet Count',
      'Spin Counts',
      'Most Frequently Requested Order'
    ],
    datasets: [
      {
        label: 'Survey Data',
        data: [
          surveyData?.surveyCount || 0,
          surveyData?.carCount || 0,
          surveyData?.waiterCount || 0,
          surveyData?.tableCount || 0,
          surveyData?.valetCount || 0,
          surveyData?.spinCounts || 0,
          surveyData?.mostFrequentlyRequestedOrder || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="cards-container">
      {surveyData && (
        <div className="charts-container">
          <div className="chart-item">
            <Bar data={chartData} />
          </div>
          <div className="chart-item">
            <Pie data={chartData} />
          </div>
          <div className="chart-item">
            <Line data={chartData} />
          </div>
          <div className="chart-item">
            <Doughnut data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
