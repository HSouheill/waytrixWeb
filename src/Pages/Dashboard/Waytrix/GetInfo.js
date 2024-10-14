import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GetInfo.css'; // Import the custom styles
import { ipAddress } from '../../../config';

export const GetInfo = () => {
  const [totalRestoNum, setTotalRestoNum] = useState(null);
  const [totalTableNum, setTotalTableNum] = useState(null);
  const [totalWaiterNum, setTotalWaiterNum] = useState(null);
  const [totalNumberOfCars, setTotalNumberOfCars] = useState(null);
  const [totalContactUsClick, setTotalContactUsClick] = useState(null);
  const [totalValetNum, setTotalValetNum] = useState(null);
  const [totalTabletsNum, setTotalTabletsNum] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');

        const fetchRestoData = async () => {
          const responseResto = await axios.get(
            `${ipAddress}/api/DashBoardRoutes/total_resto_num_for_waytrix`,
            {
              headers: {
                Authorization: waytrixToken
              }
            }
          );
          const { totalRestoNum } = responseResto.data;
          localStorage.setItem('totalRestoNum', totalRestoNum.toString());
          setTotalRestoNum(totalRestoNum);
        };

        const fetchTableData = async () => {
          const responseTable = await axios.get(
            `${ipAddress}/api/DashBoardRoutes/total_table_num_for_waytrix`,
            {
              headers: {
                Authorization: waytrixToken
              }
            }
          );
          const { totalTableNum } = responseTable.data;
          localStorage.setItem('totalTableNum', totalTableNum.toString());
          setTotalTableNum(totalTableNum);
        };

        const fetchWaiterData = async () => {
          const responseWaiter = await axios.get(
            `${ipAddress}/api/DashBoardRoutes/total_waiter_num_for_waytrix`,
            {
              headers: {
                Authorization: waytrixToken
              }
            }
          );
          const { totalWaiterNum } = responseWaiter.data;
          localStorage.setItem('totalWaiterNum', totalWaiterNum.toString());
          setTotalWaiterNum(totalWaiterNum);
        };

        const fetchCarsData = async () => {
          const responseCars = await axios.get(
            `${ipAddress}/api/DashBoardRoutes/total_cars_num_for_waytrix`,
            {
              headers: {
                Authorization: waytrixToken
              }
            }
          );
          const { totalNumberOfCars } = responseCars.data;
          localStorage.setItem('totalNumberOfCars', totalNumberOfCars.toString());
          setTotalNumberOfCars(totalNumberOfCars);
        };

        const fetchContactUsClickData = async () => {
          const responseContactUs = await axios.get(
            `${ipAddress}/api/DashBoardRoutes/get_total_contact_us_click_for_waytrix`,
            {
              headers: {
                Authorization: waytrixToken
              }
            }
          );
          const { totalContactUsClick } = responseContactUs.data;
          localStorage.setItem('totalContactUsClick', totalContactUsClick.toString());
          setTotalContactUsClick(totalContactUsClick);
        };

        const fetchValetData = async () => {
          const responseValet = await axios.get(
            `${ipAddress}/api/DashBoardRoutes/total_valet_num_for_waytrix`,
            {
              headers: {
                Authorization: waytrixToken
              }
            }
          );
          const { totalValetNum } = responseValet.data;
          localStorage.setItem('totalValetNum', totalValetNum.toString());
          setTotalValetNum(totalValetNum);
        };

        const fetchTabletData = async () => {
          const responseTablet = await axios.get(
            `${ipAddress}/api/DashBoardRoutes/total_tablet_num_for_waytrix`,
            {
              headers: {
                Authorization: waytrixToken
              }
            }
          );
          const { totalTabletsNum } = responseTablet.data;
          localStorage.setItem('totalTabletsNum', totalTabletsNum.toString());
          setTotalTabletsNum(totalTabletsNum);
        };

        await fetchRestoData();
        await fetchTableData();
        await fetchWaiterData();
        await fetchCarsData();
        await fetchContactUsClickData();
        await fetchValetData();
        await fetchTabletData();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid-container-carrds">
      <div className="card">
        <h1>Total Resto Num: {totalRestoNum}</h1>
      </div>
      <div className="card">
        <h1>Total Table Num: {totalTableNum}</h1>
      </div>
      <div className="card">
        <h1>Total Waiter Num: {totalWaiterNum}</h1>
      </div>
      <div className="card">
        <h1>Total Number Of Cars: {totalNumberOfCars}</h1>
      </div>
      <div className="card">
        <h1>Total Contact Us Click: {totalContactUsClick}</h1>
      </div>
      <div className="card">
        <h1>Total Valet Num: {totalValetNum}</h1>
      </div>
      {/* <div className="card">
        <h1>Total Tablets Num: {totalTabletsNum}</h1>
      </div> redundant*/}
    </div>
  );
};

export default GetInfo;
