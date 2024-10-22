import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import { ipAddress } from '../../../config';

const PartnerDashboard = () => {
  const [videoData, setVideoData] = useState(null);
  const [totalVideos, setTotalVideos] = useState(0); // State for total videos
  const [maleCustomerCounts, setMaleCustomerCounts] = useState([]); // State for male customers
  const [femaleCustomerCounts, setFemaleCustomerCounts] = useState([]); // State for female customers
  const partnerToken = localStorage.getItem('partnerToken');
  const partnerId = localStorage.getItem('partnerId');

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const maleBarChartRef = useRef(null); // Ref for male chart
  const femaleBarChartRef = useRef(null); // Ref for female chart

  const fetchTotalVideos = async () => {
    try {
      const response = await axios.post(`${ipAddress}/api/VideoRoutes/getTotalVideosForPartner`, { partnerId });
      setTotalVideos(response.data.totalVideos); // Assuming your API returns { totalVideos: <number> }
    } catch (error) {
      console.error('Error fetching total videos:', error);
    }
  };

  const fetchMaleCustomerCounts = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getMaleCustomerCountByAgeGroupTotalSigned`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setMaleCustomerCounts(data.map(item => ({
        ageGroup: item.ageGroup,
        count: item.totalTimesSigned,
      })));
    } catch (error) {
      console.error('Error fetching male customer counts:', error);
    }
  };

  const fetchFemaleCustomerCounts = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getFemaleCustomerCountByAgeGroupTotalSigned`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setFemaleCustomerCounts(data.map(item => ({
        ageGroup: item.ageGroup,
        count: item.totalTimesSigned,
      })));
    } catch (error) {
      console.error('Error fetching female customer counts:', error);
    }
  };

  useEffect(() => {
    fetchTotalVideos(); // Fetch total videos when the component mounts
    fetchMaleCustomerCounts();
    fetchFemaleCustomerCounts(); 

    const fetchVideoData = async () => {
      try {
        const response = await axios.post(`${ipAddress}/api/PartnerAccountRoutes/get_total_video_num`, { _id: partnerId }, {
          headers: {
            Authorization: `${partnerToken}`
          }
        });
        setVideoData(response.data);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
  }, [partnerToken, partnerId]);

  useEffect(() => {
    if (videoData) {
      const barChartCtx = barChartRef.current.getContext('2d');
      new Chart(barChartCtx, {
        type: 'bar',
        data: {
          labels: ['Total Video Number'],
          datasets: [{
            label: 'Total Video Number',
            data: [totalVideos], // Use the fetched total videos
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white', // Y-axis label color
              },
            },
            x: {
              ticks: {
                color: 'white', // X-axis label color
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: 'white', // Legend text color
              },
            },
            datalabels: false, // Disable datalabels for non-Pie charts
          },
        }
        
      });

      const pieChartCtx = pieChartRef.current.getContext('2d');
      new Chart(pieChartCtx, {
        type: 'pie',
        data: {
          labels: ['Total Contact Us Clicks'],
          datasets: [{
            label: 'Total Contact Us Clicks',
            data: [videoData.totalContactUsClicks],
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: 'white', // Legend text color
              },
            },
            datalabels: {
              color: 'white', // Set datalabel text color to white
              formatter: (value, context) => {
                return value; // Show the value
              },
              font: {
                size: 14, // Adjust font size if needed
              },
            },
          },
        }        
      });

      const lineChartCtx = lineChartRef.current.getContext('2d');
      new Chart(lineChartCtx, {
        type: 'line',
        data: {
          labels: ['Total Video Number', 'Total Contact Us Clicks'],
          datasets: [
            {
              label: 'Total Video Number',
              data: [totalVideos, 0], // Use the fetched total videos
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1
            },
            {
              label: 'Total Contact Us Clicks',
              data: [0, videoData.totalContactUsClicks],
              fill: false,
              borderColor: 'rgba(54, 162, 235, 1)',
              tension: 0.1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white', // Y-axis label color
              },
            },
            x: {
              ticks: {
                color: 'white', // X-axis label color
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: 'white', // Legend text color
              },
            },
            datalabels: false, // Disable datalabels for non-Pie charts
          },
        }        
      });
      const maleBarChartCtx = maleBarChartRef.current.getContext('2d');
      new Chart(maleBarChartCtx, {
        type: 'bar',
        data: {
          labels: maleCustomerCounts.map(item => item.ageGroup),
          datasets: [{
            label: 'Total Male Logins Per Age',
            data: maleCustomerCounts.map(item => item.count),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white', // Y-axis label color
              },
            },
            x: {
              ticks: {
                color: 'white', // X-axis label color
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: 'white', // Legend text color
              },
            },
            datalabels: false, // Disable datalabels for non-Pie charts
          },
        }        
      });

      const femaleBarChartCtx = femaleBarChartRef.current.getContext('2d');
      new Chart(femaleBarChartCtx, {
        type: 'bar',
        data: {
          labels: femaleCustomerCounts.map(item => item.ageGroup),
          datasets: [{
            label: 'Total Female Logins Per Age',
            data: femaleCustomerCounts.map(item => item.count),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white', // Y-axis label color
              },
            },
            x: {
              ticks: {
                color: 'white', // X-axis label color
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: 'white', // Legend text color
              },
            },
            datalabels: false, // Disable datalabels for non-Pie charts
          },
        }   
      });
    }
  }, [videoData, totalVideos, maleCustomerCounts, femaleCustomerCounts]); // Add totalVideos as a dependency

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#121212',
      color: '#fff',
      boxSizing: 'border-box',
      overflowY: 'auto',  // Scroll if content goes beyond the window height
    }}>
      {videoData && (
        <>
          <div style={{
            padding: '20px',
            border: '1px solid #fff',
            borderRadius: '10px',
            backgroundColor: '#1e1e1e',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
          }}>
            <h4 style={{
              color: '#fff',
              borderBottom: '1px solid #fff',
              paddingBottom: '10px',
              marginBottom: '10px'
            }}>Total Video Number (Bar Chart)</h4>
            <canvas ref={barChartRef} height="300"></canvas>
          </div>
          <div style={{
            padding: '20px',
            border: '1px solid #fff',
            borderRadius: '10px',
            backgroundColor: '#1e1e1e',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
          }}>
            <h4 style={{
              color: '#fff',
              borderBottom: '1px solid #fff',
              paddingBottom: '10px',
              marginBottom: '10px'
            }}>Total Contact Us Clicks (Pie Chart)</h4>
            <canvas ref={pieChartRef}></canvas>
          </div>
          <div style={{
            padding: '20px',
            border: '1px solid #fff',
            borderRadius: '10px',
            backgroundColor: '#1e1e1e',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
          }}>
            <h4 style={{
              color: '#fff',
              borderBottom: '1px solid #fff',
              paddingBottom: '10px',
              marginBottom: '10px'
            }}>Comparison (Line Chart)</h4>
            <canvas ref={lineChartRef} height="300"></canvas>
          </div>

            {/* Male Customer Chart */}
          <div style={{ padding: '20px', border: '1px solid #fff', borderRadius: '10px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}>
            <h4 style={{ color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '10px', marginBottom: '10px' }}>Male Customer Logins Per Age (Bar Chart)</h4>
            <canvas ref={maleBarChartRef} height="300"></canvas>
          </div>

          {/* Female Customer Chart */}
          <div style={{ padding: '20px', border: '1px solid #fff', borderRadius: '10px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)' }}>
            <h4 style={{ color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '10px', marginBottom: '10px' }}>Female Customer Logins Per Age (Bar Chart)</h4>
            <canvas ref={femaleBarChartRef} height="300"></canvas>
          </div>

        </>
      )}
    </div>
  );
};

export default PartnerDashboard;
