import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import { ipAddress } from '../../../config';

const PartnerDashboard = () => {
  const [videoData, setVideoData] = useState(null);
  const [totalVideos, setTotalVideos] = useState(0); // State for total videos
  const partnerToken = localStorage.getItem('partnerToken');
  const partnerId = localStorage.getItem('partnerId');

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const fetchTotalVideos = async () => {
    try {
      const response = await axios.post(`${ipAddress}/api/VideoRoutes/getTotalVideosForPartner`, { partnerId });
      setTotalVideos(response.data.totalVideos); // Assuming your API returns { totalVideos: <number> }
    } catch (error) {
      console.error('Error fetching total videos:', error);
    }
  };

  useEffect(() => {
    fetchTotalVideos(); // Fetch total videos when the component mounts

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
              beginAtZero: true
            }
          }
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
        }
      });
    }
  }, [videoData, totalVideos]); // Add totalVideos as a dependency

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#121212',
      color: '#fff',
      height: '100vh',
      boxSizing: 'border-box',
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
            <canvas ref={barChartRef}></canvas>
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
            <canvas ref={lineChartRef}></canvas>
          </div>
        </>
      )}
    </div>
  );
};

export default PartnerDashboard;
