import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GetSurveys.css';

const GetSurveys = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const restoId = localStorage.getItem('restoId');
        const restoToken = localStorage.getItem('restoToken'); // Assuming 'tableToken' is correct
        const response = await axios.post(
          'https://waytrixback.onrender.com/api/ContactUsRoutes/GetAllSurveys',
          { restoId },
          {
            headers: {
              Authorization: `${restoToken}`
            }
          }
        );
        setSurveys(response.data);
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };
  
    fetchSurveys();
  }, []);
  

  return (
    <div className="dark-theme">
      <h1 className="title">Survey Results</h1>
      <div className="survey-list">
        {surveys.map(survey => (
          <div key={survey._id} className="survey-item">
            <h2 className="survey-name">{survey.name}</h2>
            <p className="survey-detail"><strong>Phone:</strong> {survey.phone}</p>

            <div className="survey-details">
              <p className="survey-detail"><strong>Food Quality:</strong> {survey.foodQuality}</p>
              <p className="survey-detail"><strong>Service Quality:</strong> {survey.serviceQuality}</p>
              <p className="survey-detail"><strong>Staff Friendliness:</strong> {survey.staffFriendliness}</p>
              <p className="survey-detail"><strong>Value for Money:</strong> {survey.valueForMoney}</p>
              <p className="survey-detail"><strong>Restaurant Cleanliness:</strong> {survey.restaurantCleanliness}</p>
              <p className="survey-detail"><strong>Restaurant Design:</strong> {survey.restaurantDesign}</p>
              <p className="survey-detail"><strong>Way Trix Service:</strong> {survey.wayTrixService}</p>
              <p className="survey-detail"><strong>Additional Comments:</strong> {survey.additionalComments}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetSurveys;
