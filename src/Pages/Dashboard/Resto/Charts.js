import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { ipAddress } from '../../../config';
import './Cards.css'; // Import CSS for styling

export const Cards = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [maleCustomerCounts, setMaleCustomerCounts] = useState([]);
  const [femaleCustomerCounts, setFemaleCustomerCounts] = useState([]); // New state for female counts
  const maleBarChartRef = useRef(null);
  const femaleBarChartRef = useRef(null); // New ref for female chart

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

    const fetchMaleCustomerCounts = async () => {
      try {
        const response = await fetch(`${ipAddress}/api/Auth/getMaleCustomerCountByAgeGroupTotalSigned`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // If any data is needed in the request body, include it here
        });
        const data = await response.json();
        
        const formattedData = data.map(item => ({
          ageGroup: item.ageGroup,
          count: item.totalTimesSigned // Now using totalTimesSigned instead of count
        }));
    
        setMaleCustomerCounts(formattedData);
      } catch (error) {
        console.error('Error fetching male customer counts:', error);
      }
    };

    const fetchFemaleCustomerCounts = async () => { // New function for fetching female counts
      try {
        const response = await fetch(`${ipAddress}/api/Auth/getFemaleCustomerCountByAgeGroupTotalSigned`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // If any data is needed in the request body, include it here
        });
        const data = await response.json();

        const formattedData = data.map(item => ({
          ageGroup: item.ageGroup,
          count: item.totalTimesSigned // Now using totalTimesSigned instead of count
        }));

        setFemaleCustomerCounts(formattedData);
      } catch (error) {
        console.error('Error fetching female customer counts:', error);
      }
    };

    // Fetch data initially when component mounts
    fetchSurveyData();
    fetchMaleCustomerCounts();
    fetchFemaleCustomerCounts(); // Fetch female counts too

    // Fetch data every 10 seconds
    const interval = setInterval(() => {
      fetchSurveyData();
      fetchMaleCustomerCounts();
      fetchFemaleCustomerCounts(); // Fetch female counts too
    }, 10000);

    // Clean up interval to prevent memory leaks
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Chart data for the main dashboard
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

  // Chart data for male customers by age group
  const maleCustomerChartData = {
    labels: maleCustomerCounts.map(item => item.ageGroup),
    datasets: [
      {
        label: 'Total Male Logins Per Age',
        data: maleCustomerCounts.map(item => item.count), // Now using totalTimesSigned as count
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ]
  };

  const maleChartOptions = {
    maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        color: 'white', // Set x-axis labels to white
      },
    },
    y: {
      ticks: {
        color: 'white', // Set y-axis labels to white
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: 'white', // Set legend text to white
      },
    },
    tooltip: {
      bodyColor: 'white', // Set tooltip text to white
      titleColor: 'white',
    },
  },
};

  // Chart data for female customers by age group
  const femaleCustomerChartData = { // New chart data for females
    labels: femaleCustomerCounts.map(item => item.ageGroup),
    datasets: [
      {
        label: 'Total Female Logins Per Age',
        data: femaleCustomerCounts.map(item => item.count), // Now using totalTimesSigned as count
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  const femaleChartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: 'white', // Set x-axis labels to white
        },
      },
      y: {
        ticks: {
          color: 'white', // Set y-axis labels to white
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white', // Set legend text to white
        },
      },
      tooltip: {
        bodyColor: 'white', // Set tooltip text to white
        titleColor: 'white',
      },
    },
  };
  
  
     // General chart options to set text color to white
     const commonChartOptions = {
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: 'white', // Set x-axis labels to white
          },
        },
        y: {
          ticks: {
            color: 'white', // Set y-axis labels to white
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: 'white', // Set legend text to white
          },
        },
        tooltip: {
          bodyColor: 'white', // Set tooltip text to white
          titleColor: 'white',
        },
      },
    };

  return (
    <div className="cards-container">
      {surveyData && (
        <div className="charts-container">
          {/* <div className="chart-item">
            <Bar data={chartData} options={commonChartOptions}/>
          </div> */}
          <div className="chart-item">
            <Pie data={chartData} options={commonChartOptions}/>
          </div>
          {/* <div className="chart-item">
            <Line data={chartData} options={commonChartOptions}/>
          </div>
          <div className="chart-item">
            <Doughnut data={chartData} options={commonChartOptions}/>
          </div> */}
          <div className="chart-item male-bar-chart">
            <Bar data={maleCustomerChartData} options={maleChartOptions} ref={maleBarChartRef} />
          </div>
          <div className="chart-item female-bar-chart">
            <Bar data={femaleCustomerChartData} options={femaleChartOptions} ref={femaleBarChartRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
