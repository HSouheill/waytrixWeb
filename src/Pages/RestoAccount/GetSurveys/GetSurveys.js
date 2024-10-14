import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GetSurveys.css';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF export
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import { ipAddress } from '../../../config';

const GetSurveys = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const restoId = localStorage.getItem('restoId');
        const restoToken = localStorage.getItem('restoToken'); 
        const response = await axios.post(
          `${ipAddress}/api/ContactUsRoutes/GetAllSurveys`,
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

  // Function to export surveys as a PDF
  const exportSurveysToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    surveys.forEach((survey, index) => {
      doc.text(`Survey #${index + 1}`, 10, 10 + index * 50);
      doc.text(`Name: ${survey.name}`, 10, 20 + index * 50);
      doc.text(`Phone: ${survey.phone}`, 10, 30 + index * 50);
      doc.text(`Food Quality: ${survey.foodQuality}`, 10, 40 + index * 50);
      doc.text(`Service Quality: ${survey.serviceQuality}`, 10, 50 + index * 50);
      doc.text(`Staff Friendliness: ${survey.staffFriendliness}`, 10, 60 + index * 50);
      doc.text(`Value for Money: ${survey.valueForMoney}`, 10, 70 + index * 50);
      doc.text(`Restaurant Cleanliness: ${survey.restaurantCleanliness}`, 10, 80 + index * 50);
      doc.text(`Restaurant Design: ${survey.restaurantDesign}`, 10, 90 + index * 50);
      doc.text(`Way Trix Service: ${survey.wayTrixService}`, 10, 100 + index * 50);
      doc.text(`Additional Comments: ${survey.additionalComments}`, 10, 110 + index * 50);

      if (index !== surveys.length - 1) {
        doc.addPage();
      }
    });

    doc.save('surveys.pdf');
  };

  // Function to export surveys as an Excel file
  const exportSurveysToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(surveys.map(survey => ({
      Name: survey.name,
      Phone: survey.phone,
      'Food Quality': survey.foodQuality,
      'Service Quality': survey.serviceQuality,
      'Staff Friendliness': survey.staffFriendliness,
      'Value for Money': survey.valueForMoney,
      'Restaurant Cleanliness': survey.restaurantCleanliness,
      'Restaurant Design': survey.restaurantDesign,
      'Way Trix Service': survey.wayTrixService,
      'Additional Comments': survey.additionalComments
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Surveys');
    XLSX.writeFile(workbook, 'surveys.xlsx');
  };

  return (
    <div className="dark-theme">
      <h1 className="title">Survey Results</h1>
      <button onClick={exportSurveysToPDF}>Export Surveys as PDF</button> {/* Export PDF button */}
      <button onClick={exportSurveysToExcel}>Export Surveys as Excel</button> {/* Export Excel button */}
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
