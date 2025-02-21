import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Charts.css'; // Assuming this is your CSS file for custom styling
import { ipAddress } from '../../../config';

const Charts = () => {
  const [stats, setStats] = useState({
    totalRestoNum: localStorage.getItem('totalRestoNum') || 0,
    totalTableNum: localStorage.getItem('totalTableNum') || 0,
    totalWaiterNum: localStorage.getItem('totalWaiterNum') || 0,
    totalNumberOfCars: localStorage.getItem('totalNumberOfCars') || 0,
    totalContactUsClick: localStorage.getItem('totalContactUsClick') || 0,
    totalValetNum: localStorage.getItem('totalValetNum') || 0,
    totalTabletsNum: localStorage.getItem('totalTabletsNum') || 0,
  });

  const [maleCustomerCounts, setMaleCustomerCounts] = useState([]);
  const [femaleCustomerCounts, setFemaleCustomerCounts] = useState([]); // New state for female counts
  
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const femaleBarChartRef = useRef(null); // New ref for female bar chart
  const pieChartRef = useRef(null);
  const additionalBarChartRef = useRef(null); // New ref for the additional bar chart

  // Function to fetch male customer counts
  const fetchMaleCustomerCounts = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getMaleCustomerCountByAgeGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      // Ensure data is an array before setting state
      setMaleCustomerCounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching male customer counts:', error);
      setMaleCustomerCounts([]); // Set empty array on error
    }
  };

  // Function to fetch female customer counts
  const fetchFemaleCustomerCounts = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getFemaleCustomerCountByAgeGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setFemaleCustomerCounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching female customer counts:', error);
      setFemaleCustomerCounts([]); // Set empty array on error
    }
  };

  useEffect(() => {
    // Fetch initial male and female customer counts
    fetchMaleCustomerCounts();
    fetchFemaleCustomerCounts();

    // Set intervals to refresh counts
    const interval = setInterval(() => {
      fetchMaleCustomerCounts();
      fetchFemaleCustomerCounts();
    }, 10000); // Adjust the interval as needed

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => ({
        totalRestoNum: localStorage.getItem('totalRestoNum') || prevStats.totalRestoNum,
        totalTableNum: localStorage.getItem('totalTableNum') || prevStats.totalTableNum,
        totalWaiterNum: localStorage.getItem('totalWaiterNum') || prevStats.totalWaiterNum,
        totalNumberOfCars: localStorage.getItem('totalNumberOfCars') || prevStats.totalNumberOfCars,
        totalContactUsClick: localStorage.getItem('totalContactUsClick') || prevStats.totalContactUsClick,
        totalValetNum: localStorage.getItem('totalValetNum') || prevStats.totalValetNum,
        totalTabletsNum: localStorage.getItem('totalTabletsNum') || prevStats.totalTabletsNum,
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to create chart data
  const createChartData = (type, data) => {
    const chartConfig = {
      type,
      data: {
        labels: [],
        datasets: [{
          label: '',
          data: [],
          backgroundColor: '',
          borderColor: '',
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: 'white' },
          },
          x: {
            ticks: { color: 'white' },
          },
        },
        plugins: {
          legend: {
            labels: { color: 'white' },
          },
          datalabels: false,
        },
      },
    };

    return chartConfig;
  };

  useEffect(() => {
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        if (window.myBarChart !== undefined) {
          window.myBarChart.destroy();
        }

        // Prepare the data for the male bar chart
        const labels = maleCustomerCounts.map(item => item.ageGroup);
        const data = maleCustomerCounts.map(item => item.count);

        window.myBarChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Male Customers Age Groups',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
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
          },          
        });
      }
    }
  }, [maleCustomerCounts]);

  useEffect(() => {
    if (femaleBarChartRef.current && Array.isArray(femaleCustomerCounts)) {
      const ctx = femaleBarChartRef.current.getContext('2d');
      if (ctx) {
        if (window.myFemaleBarChart) {
          window.myFemaleBarChart.destroy();
        }

        const labels = femaleCustomerCounts.map(item => item.ageGroup);
        const data = femaleCustomerCounts.map(item => item.count);

        const chartConfig = createChartData('bar');
        chartConfig.data.labels = labels;
        chartConfig.data.datasets[0] = {
          label: 'Female Customers Age Groups',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        };

        window.myFemaleBarChart = new Chart(ctx, chartConfig);
      }
    }
  }, [femaleCustomerCounts]);

  useEffect(() => {
    if (additionalBarChartRef.current) {
      const ctx = additionalBarChartRef.current.getContext('2d');
      if (ctx) {
        if (window.myAdditionalBarChart !== undefined) {
          window.myAdditionalBarChart.destroy();
        }
        window.myAdditionalBarChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              'Resto',
              'Table',
              'Waiter',
              'Car',
              'Contact Us',
              'Valet',
              'Tablets'
            ],
            datasets: [
              {
                label: 'Statistics',
                data: [
                  stats.totalRestoNum,
                  stats.totalTableNum,
                  stats.totalWaiterNum,
                  stats.totalNumberOfCars,
                  stats.totalContactUsClick,
                  stats.totalValetNum,
                  stats.totalTabletsNum
                ],
                backgroundColor: 'rgba(75, 192, 75, 0.2)', // Change to a green background
                borderColor: 'rgba(75, 192, 75, 1)', // Change to a darker green border
                borderWidth: 1,
              },
            ],
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
          },
          
        });
      }
    }
  }, [stats]);

  useEffect(() => {
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      if (ctx) {
        if (window.myPieChart !== undefined) {
          window.myPieChart.destroy();
        }
        window.myPieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: [
              'Resto',
              'Table',
              'Waiter',
              'Car',
              'Contact Us',
              'Valet',
              'Tablets'
            ],
            datasets: [
              {
                label: 'Statistics',
                data: [
                  stats.totalRestoNum,
                  stats.totalTableNum,
                  stats.totalWaiterNum,
                  stats.totalNumberOfCars,
                  stats.totalContactUsClick,
                  stats.totalValetNum,
                  stats.totalTabletsNum
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                ],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                labels: {
                  color: 'white', // Legend text color
                },
              },
              // title: {
              //   display: true,
              //   text: 'Pie Chart Title',
              //   color: 'white', // Title text color
              // },
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
          },
          
        });
      }
    }
  }, [stats]);

  return (
    <div className="charts-container">
      <div className="chart-item">
        <canvas ref={lineChartRef} id="lineChartUnique" width="300" height="300"></canvas>
      </div>
      <div className="chart-item">
        <canvas ref={barChartRef} id="barChartUnique" width="300" height="300"></canvas>
      </div>
      <div className="chart-item">
        <canvas ref={femaleBarChartRef} id="femaleBarChartUnique" width="300" height="300"></canvas> {/* New female bar chart */}
      </div>
      <div className="chart-item">
        <canvas ref={pieChartRef} id="pieChartUnique" width="300" height="300"></canvas>
      </div>
      <div className="chart-item">
        <canvas ref={additionalBarChartRef} id="additionalBarChartUnique" width="300" height="300"></canvas>
      </div>
    </div>
  );
};

export default Charts;
