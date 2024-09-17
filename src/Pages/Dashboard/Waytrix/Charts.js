import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import './Charts.css'; // Assuming this is your CSS file for custom styling

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

  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        totalRestoNum: localStorage.getItem('totalRestoNum') || 0,
        totalTableNum: localStorage.getItem('totalTableNum') || 0,
        totalWaiterNum: localStorage.getItem('totalWaiterNum') || 0,
        totalNumberOfCars: localStorage.getItem('totalNumberOfCars') || 0,
        totalContactUsClick: localStorage.getItem('totalContactUsClick') || 0,
        totalValetNum: localStorage.getItem('totalValetNum') || 0,
        totalTabletsNum: localStorage.getItem('totalTabletsNum') || 0,
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      if (ctx) {
        if (window.myLineChart !== undefined) {
          window.myLineChart.destroy();
        }
        window.myLineChart = new Chart(ctx, {
          type: 'line',
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
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [stats]);

  useEffect(() => {
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        if (window.myBarChart !== undefined) {
          window.myBarChart.destroy();
        }
        window.myBarChart = new Chart(ctx, {
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
              },
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
        });
      }
    }
  }, [stats]);

  return (
    <div className="charts-container">
      <div className="chart-item">
        <canvas ref={lineChartRef} id="lineChart" width="300" height="300"></canvas>
      </div>
      <div className="chart-item">
        <canvas ref={barChartRef} id="barChart" width="300" height="300"></canvas>
      </div>
      <div className="chart-item">
        <canvas ref={pieChartRef} id="pieChart" width="300" height="300"></canvas>
      </div>
    </div>
  );
};

export default Charts;
