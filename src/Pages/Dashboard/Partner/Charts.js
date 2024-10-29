import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import { ipAddress } from '../../../config';

const PartnerDashboard = () => {
  const [videoData, setVideoData] = useState(null);
  const [totalVideos, setTotalVideos] = useState(0); // State for total videos
  const [maleCustomerCounts, setMaleCustomerCounts] = useState([]); // State for male customers
  const [femaleCustomerCounts, setFemaleCustomerCounts] = useState([]); // State for female customers
  const [monthlyCounts, setMonthlyCounts] = useState([]); // State for monthly counts
  const [monthlyCounts2, setMonthlyCounts2] = useState([]); // State for monthly counts
  const [monthlyCounts3, setMonthlyCounts3] = useState([]); // State for monthly counts
  const [monthlyCounts4, setMonthlyCounts4] = useState([]); // State for monthly counts
  const [monthlyCounts5, setMonthlyCounts5] = useState([]); // State for monthly counts
  const [monthlyCounts6, setMonthlyCounts6] = useState([]); // State for monthly counts
  const partnerToken = localStorage.getItem('partnerToken');
  const partnerId = localStorage.getItem('partnerId');

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const maleBarChartRef = useRef(null); // Ref for male chart
  const femaleBarChartRef = useRef(null); // Ref for female chart
  const monthlyBarChartRef = useRef(null); // Ref for monthly chart
  const monthlyBarChartRef2 = useRef(null); // Ref for monthly chart
  const monthlyBarChartRef3 = useRef(null); // Ref for monthly chart
  const monthlyBarChartRef4 = useRef(null); // Ref for monthly chart
  const monthlyBarChartRef5 = useRef(null); // Ref for monthly chart
  const monthlyBarChartRef6 = useRef(null); // Ref for monthly chart


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

  const fetchMonthlyCounts = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getMonthlyRestoCount`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setMonthlyCounts(data);
    } catch (error) {
      console.error('Error fetching monthly resto counts:', error);
    }
  };

  const fetchMonthlyCounts2 = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getMonthlyTableCount`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setMonthlyCounts2(data);
    } catch (error) {
      console.error('Error fetching monthly table counts:', error);
    }
  };


  const fetchMonthlyCounts3 = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getMonthlyWaiterCount`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setMonthlyCounts3(data);
    } catch (error) {
      console.error('Error fetching monthly waiter counts:', error);
    }
  };


  const fetchMonthlyCounts4 = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getMonthlyValetCount`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setMonthlyCounts4(data);
    } catch (error) {
      console.error('Error fetching monthly valet counts:', error);
    }
  };

  const fetchMonthlyCounts5 = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getMonthlyCarCount`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setMonthlyCounts5(data);
    } catch (error) {
      console.error('Error fetching monthly car counts:', error);
    }
  };

  const fetchMonthlyCounts6 = async () => {
    try {
      const response = await fetch(`${ipAddress}/api/Auth/getMonthlyContactUsCount`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setMonthlyCounts6(data);
    } catch (error) {
      console.error('Error fetching monthly contact us counts:', error);
    }
  };

  useEffect(() => {
    fetchTotalVideos(); // Fetch total videos when the component mounts
    fetchMaleCustomerCounts();
    fetchFemaleCustomerCounts(); 
    fetchMonthlyCounts(); // Fetch monthly counts
    fetchMonthlyCounts2(); //for tables
    fetchMonthlyCounts3(); //for waiters
    fetchMonthlyCounts4(); //for valet
    fetchMonthlyCounts5(); //for cars
    fetchMonthlyCounts6(); //for cars

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

      // const pieChartCtx = pieChartRef.current.getContext('2d');
      // new Chart(pieChartCtx, {
      //   type: 'pie',
      //   data: {
      //     labels: ['Total Contact Us Clicks'],
      //     datasets: [{
      //       label: 'Total Contact Us Clicks',
      //       data: [videoData.totalContactUsClicks],
      //       backgroundColor: [
      //         'rgba(54, 162, 235, 0.2)'
      //       ],
      //       borderColor: [
      //         'rgba(54, 162, 235, 1)'
      //       ],
      //       borderWidth: 1
      //     }]
      //   },
      //   options: {
      //     plugins: {
      //       legend: {
      //         labels: {
      //           color: 'white', // Legend text color
      //         },
      //       },
      //       datalabels: {
      //         color: 'white', // Set datalabel text color to white
      //         formatter: (value, context) => {
      //           return value; // Show the value
      //         },
      //         font: {
      //           size: 14, // Adjust font size if needed
      //         },
      //       },
      //     },
      //   }        
      // });

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

    // Monthly Line Chart
if (monthlyCounts.length > 0) {
  const monthlyLineChartCtx = monthlyBarChartRef.current.getContext('2d');
  new Chart(monthlyLineChartCtx, {
    type: 'line', // Change to 'line'
    data: {
      labels: monthlyCounts.map(item => item.month),
      datasets: [{
        label: 'Monthly Restaurant Counts',
        data: monthlyCounts.map(item => item.count),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
        fill: false, // Set to false for line chart
        tension: 0.1, // Smooth lines
      }]
    },
    options: {
      layout: {
        padding: {
          top: 20, // Adjust padding as necessary
          right: 20,
          bottom: 60,
          left: 20,
        }
      },
      responsive: true, // Make the chart responsive
      maintainAspectRatio: false, // Allow the chart to fill the container
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

  // // Monthly Line Chart
  // if (monthlyCounts2.length > 0) {
  //   const monthlyLineChartCtx2 = monthlyBarChartRef2.current.getContext('2d');
  //   new Chart(monthlyLineChartCtx2, {
  //     type: 'line', // Change to 'line'
  //     data: {
  //       labels: monthlyCounts2.map(item => item.month),
  //       datasets: [{
  //         label: 'Monthly Table Counts',
  //         data: monthlyCounts2.map(item => item.count),
  //         backgroundColor: 'rgba(255, 206, 86, 0.2)',
  //         borderColor: 'rgba(255, 206, 86, 1)',
  //         borderWidth: 2,
  //         fill: false, // Set to false for line chart
  //         tension: 0.1, // Smooth lines
  //       }]
  //     },
  //     options: {
  //       layout: {
  //         padding: {
  //           top: 20, // Adjust padding as necessary
  //           right: 20,
  //           bottom: 60,
  //           left: 20,
  //         }
  //       },
  //       responsive: true, // Make the chart responsive
  //       maintainAspectRatio: false, // Allow the chart to fill the container
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           ticks: {
  //             color: 'white', // Y-axis label color
  //           },
  //         },
  //         x: {
  //           ticks: {
  //             color: 'white', // X-axis label color
  //           },
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           labels: {
  //             color: 'white', // Legend text color
  //           },
  //         },
  //         datalabels: false, // Disable datalabels for non-Pie charts
  //       },
  //     }
  //   });
  // }


  //  // Monthly Line Chart 3
  //  if (monthlyCounts3.length > 0) {
  //   const monthlyLineChartCtx3 = monthlyBarChartRef3.current.getContext('2d');
  //   new Chart(monthlyLineChartCtx3, {
  //     type: 'line', // Change to 'line'
  //     data: {
  //       labels: monthlyCounts3.map(item => item.month),
  //       datasets: [{
  //         label: 'Monthly Waiter Counts',
  //         data: monthlyCounts3.map(item => item.count),
  //         backgroundColor: 'rgba(255, 206, 86, 0.2)',
  //         borderColor: 'rgba(255, 206, 86, 1)',
  //         borderWidth: 2,
  //         fill: false, // Set to false for line chart
  //         tension: 0.1, // Smooth lines
  //       }]
  //     },
  //     options: {
  //       layout: {
  //         padding: {
  //           top: 20, // Adjust padding as necessary
  //           right: 20,
  //           bottom: 60,
  //           left: 20,
  //         }
  //       },
  //       responsive: true, // Make the chart responsive
  //       maintainAspectRatio: false, // Allow the chart to fill the container
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //           ticks: {
  //             color: 'white', // Y-axis label color
  //           },
  //         },
  //         x: {
  //           ticks: {
  //             color: 'white', // X-axis label color
  //           },
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           labels: {
  //             color: 'white', // Legend text color
  //           },
  //         },
  //         datalabels: false, // Disable datalabels for non-Pie charts
  //       },
  //     }
  //   });
  // }

    // // Monthly Line Chart 4
    // if (monthlyCounts4.length > 0) {
    //   const monthlyLineChartCtx4 = monthlyBarChartRef4.current.getContext('2d');
    //   new Chart(monthlyLineChartCtx4, {
    //     type: 'line', // Change to 'line'
    //     data: {
    //       labels: monthlyCounts4.map(item => item.month),
    //       datasets: [{
    //         label: 'Monthly Valet Counts',
    //         data: monthlyCounts4.map(item => item.count),
    //         backgroundColor: 'rgba(255, 206, 86, 0.2)',
    //         borderColor: 'rgba(255, 206, 86, 1)',
    //         borderWidth: 2,
    //         fill: false, // Set to false for line chart
    //         tension: 0.1, // Smooth lines
    //       }]
    //     },
    //     options: {
    //       layout: {
    //         padding: {
    //           top: 20, // Adjust padding as necessary
    //           right: 20,
    //           bottom: 60,
    //           left: 20,
    //         }
    //       },
    //       responsive: true, // Make the chart responsive
    //       maintainAspectRatio: false, // Allow the chart to fill the container
    //       scales: {
    //         y: {
    //           beginAtZero: true,
    //           ticks: {
    //             color: 'white', // Y-axis label color
    //           },
    //         },
    //         x: {
    //           ticks: {
    //             color: 'white', // X-axis label color
    //           },
    //         },
    //       },
    //       plugins: {
    //         legend: {
    //           labels: {
    //             color: 'white', // Legend text color
    //           },
    //         },
    //         datalabels: false, // Disable datalabels for non-Pie charts
    //       },
    //     }
    //   });
    // }


        // // Monthly Line Chart 5
        // if (monthlyCounts5.length > 0) {
        //   const monthlyLineChartCtx5 = monthlyBarChartRef5.current.getContext('2d');
        //   new Chart(monthlyLineChartCtx5, {
        //     type: 'line', // Change to 'line'
        //     data: {
        //       labels: monthlyCounts5.map(item => item.month),
        //       datasets: [{
        //         label: 'Monthly Car Counts',
        //         data: monthlyCounts5.map(item => item.count),
        //         backgroundColor: 'rgba(255, 206, 86, 0.2)',
        //         borderColor: 'rgba(255, 206, 86, 1)',
        //         borderWidth: 2,
        //         fill: false, // Set to false for line chart
        //         tension: 0.1, // Smooth lines
        //       }]
        //     },
        //     options: {
        //       layout: {
        //         padding: {
        //           top: 20, // Adjust padding as necessary
        //           right: 20,
        //           bottom: 60,
        //           left: 20,
        //         }
        //       },
        //       responsive: true, // Make the chart responsive
        //       maintainAspectRatio: false, // Allow the chart to fill the container
        //       scales: {
        //         y: {
        //           beginAtZero: true,
        //           ticks: {
        //             color: 'white', // Y-axis label color
        //           },
        //         },
        //         x: {
        //           ticks: {
        //             color: 'white', // X-axis label color
        //           },
        //         },
        //       },
        //       plugins: {
        //         legend: {
        //           labels: {
        //             color: 'white', // Legend text color
        //           },
        //         },
        //         datalabels: false, // Disable datalabels for non-Pie charts
        //       },
        //     }
        //   });
        // }


                // // Monthly Line Chart 6
                // if (monthlyCounts6.length > 0) {
                //   const monthlyLineChartCtx6 = monthlyBarChartRef6.current.getContext('2d');
                //   new Chart(monthlyLineChartCtx6, {
                //     type: 'line', // Change to 'line'
                //     data: {
                //       labels: monthlyCounts6.map(item => item.month),
                //       datasets: [{
                //         label: 'Monthly Contact Us Counts',
                //         data: monthlyCounts6.map(item => item.count),
                //         backgroundColor: 'rgba(255, 206, 86, 0.2)',
                //         borderColor: 'rgba(255, 206, 86, 1)',
                //         borderWidth: 2,
                //         fill: false, // Set to false for line chart
                //         tension: 0.1, // Smooth lines
                //       }]
                //     },
                //     options: {
                //       layout: {
                //         padding: {
                //           top: 20, // Adjust padding as necessary
                //           right: 20,
                //           bottom: 60,
                //           left: 20,
                //         }
                //       },
                //       responsive: true, // Make the chart responsive
                //       maintainAspectRatio: false, // Allow the chart to fill the container
                //       scales: {
                //         y: {
                //           beginAtZero: true,
                //           ticks: {
                //             color: 'white', // Y-axis label color
                //           },
                //         },
                //         x: {
                //           ticks: {
                //             color: 'white', // X-axis label color
                //           },
                //         },
                //       },
                //       plugins: {
                //         legend: {
                //           labels: {
                //             color: 'white', // Legend text color
                //           },
                //         },
                //         datalabels: false, // Disable datalabels for non-Pie charts
                //       },
                //     }
                //   });
                // }
    }
  }, [videoData, totalVideos, maleCustomerCounts, femaleCustomerCounts, monthlyCounts, monthlyCounts2, monthlyCounts3, monthlyCounts4, monthlyCounts5,  ]);//monthlyCounts6

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#121212',
      color: '#fff',
      boxSizing: 'border-box',
      overflowY: 'hidden',  // Scroll if content goes beyond the window height
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
          {/* <div style={{
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
          </div> */}
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



        {/* <div style={{ 
          gridColumn: '1 / -1',
          padding: '0px', height: '80px' }}>
            <h4 style={{ color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '10px', marginBottom: '0px', marginTop: '10px', fontSize: '27px' }}>All Monthly Statistics Charts</h4>
             
        </div> */}



          {/* Monthly Line Chart */}


        <div style={{ padding: '20px', border: '1px solid #fff', borderRadius: '10px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)', height: '350px' }}>
          <h4 style={{ color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '10px', marginBottom: '10px' }}>Monthly Restaurant Counts (Line Chart)</h4>
          <canvas ref={monthlyBarChartRef}></canvas> 
        </div>

          
          {/* <div style={{ padding: '20px', border: '1px solid #fff', borderRadius: '10px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)', height: '300px' }}>
          <h4 style={{ color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '10px', marginBottom: '10px' }}>Monthly Table Counts (Line Chart)</h4>
          <canvas ref={monthlyBarChartRef2}></canvas> 
        </div>

        
        <div style={{ padding: '20px', border: '1px solid #fff', borderRadius: '10px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)', height: '300px' }}>
          <h4 style={{ color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '10px', marginBottom: '10px' }}>Monthly Waiter Counts (Line Chart)</h4>
          <canvas ref={monthlyBarChartRef3}></canvas> 
        </div>

         
         <div style={{ padding: '20px', border: '1px solid #fff', borderRadius: '10px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)', height: '300px' }}>
          <h4 style={{ color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '10px', marginBottom: '10px' }}>Monthly Valet Counts (Line Chart)</h4>
          <canvas ref={monthlyBarChartRef4}></canvas> 
        </div>

          
          <div style={{ padding: '20px', border: '1px solid #fff', borderRadius: '10px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)', height: '300px' }}>
          <h4 style={{ color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '10px', marginBottom: '10px' }}>Monthly Car Counts (Line Chart)</h4>
          <canvas ref={monthlyBarChartRef5}></canvas> 
        </div> */}

        
        {/* <div style={{ padding: '20px', border: '1px solid #fff', borderRadius: '10px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)', height: '300px' }}>
          <h4 style={{ color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '10px', marginBottom: '10px' }}>Monthly Contact Us Counts (Line Chart)</h4>
          <canvas ref={monthlyBarChartRef6}></canvas> 
        </div> */}

        </>
      )}
    </div>
  );
};

export default PartnerDashboard;
