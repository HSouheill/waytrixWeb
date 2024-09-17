import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection/HeroSection';
import GetInfo from './Waytrix/GetInfo';
import WaytrixCharts from './Waytrix/Charts';
import UserInfo from './Waytrix/UserInfo';
import RestoCharts from './Resto/Charts'
import RestoCardsInfo from './Resto/Cards'
import PartnerDashboard from './Partner/CardsDashboard'
import NumOfVideosOfEahResto from './Partner/NumOfVideosOfEahResto'
import PartnerCharts from './Partner/Charts'
const Home = () => {
  const [waytrixToken, setWaytrixToken] = useState(localStorage.getItem('waytrixToken'));
  const [restoToken, setRestoToken] = useState(localStorage.getItem('restoToken'));
  const [partnerToken, setPartnerToken] = useState(localStorage.getItem('partnerToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setWaytrixToken(localStorage.getItem('waytrixToken'));
      setRestoToken(localStorage.getItem('restoToken'));
      setPartnerToken(localStorage.getItem('partnerToken'));

    };

    // Set the interval to check the localStorage every second
    const intervalId = setInterval(handleStorageChange, 1000);

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Cleanup the interval and event listener
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div>
      {(!waytrixToken && !restoToken && !partnerToken) &&
      <HeroSection />}

      {waytrixToken &&
      <>
      <div style={{ margin: 40 }}>
        <GetInfo />
      </div>
      <div style={{ marginBottom: 40 }}>
        <WaytrixCharts />
      </div>
      <div style={{ marginBottom: 40 }}>
        <UserInfo />
      </div></>}
      { restoToken &&
      <>
      <RestoCardsInfo/>
      <RestoCharts/>
      </>
      }

      {
        partnerToken && <> <div style={{margin:20}}> <PartnerDashboard/> <NumOfVideosOfEahResto/> <PartnerCharts/></div> </>
      }
    </div>
  );
};

export default Home;
