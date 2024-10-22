import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const [waytrixToken, setWaytrixToken] = useState(localStorage.getItem('waytrixToken') || '');
  const [restoToken, setRestoToken] = useState(localStorage.getItem('restoToken') || '');
  const [partnerToken, setPartnerToken] = useState(localStorage.getItem('partnerToken') || '');

  useEffect(() => {
    const fetchTokens = async () => {
      const waytrixToken = localStorage.getItem('waytrixToken') || '';
      const restoToken = localStorage.getItem('restoToken') || '';
      const partnerToken = localStorage.getItem('partnerToken') || '';
      setWaytrixToken(waytrixToken);
      setRestoToken(restoToken);
      setPartnerToken(partnerToken);
    };
    fetchTokens();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const waytrixToken = localStorage.getItem('waytrixToken') || '';
      setWaytrixToken(waytrixToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const restoToken = localStorage.getItem('restoToken') || '';
      setRestoToken(restoToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const partnerToken = localStorage.getItem('partnerToken') || '';
      setPartnerToken(partnerToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    console.log("Waytrix Token on page load:", waytrixToken);
    const interval = setInterval(() => {
      const token = localStorage.getItem('waytrixToken') || '';
      if (token !== waytrixToken) {
        setWaytrixToken(token);
      }
      console.log("Waytrix Token every 1 second:", waytrixToken);
    }, 1000);
    return () => clearInterval(interval);
  }, [waytrixToken]);

  useEffect(() => {
    console.log("Resto Token on page load:", restoToken);
    const interval = setInterval(() => {
      const token = localStorage.getItem('restoToken') || '';
      if (token !== restoToken) {
        setRestoToken(token);
      }
      console.log("Resto Token every 1 second:", restoToken);
    }, 1000);
    return () => clearInterval(interval);
  }, [restoToken]);

  useEffect(() => {
    console.log("Partner Token on page load:", partnerToken);
    const interval = setInterval(() => {
      const token = localStorage.getItem('partnerToken') || '';
      if (token !== partnerToken) {
        setPartnerToken(token);
      }
      console.log("Partner Token every 1 second:", partnerToken);
    }, 1000);
    return () => clearInterval(interval);
  }, [partnerToken]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = (event) => {
    event.currentTarget.querySelector('.sub-menu').classList.toggle('show');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
      <Link to="/" style={{ textDecoration: 'none' }} className="navbar-logo">
          <p style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic' }}>Waytrix</p>
        </Link>
        <div className="navbar-toggle" onClick={toggleDrawer}>
          <div className={`hamburger ${drawerOpen ? 'open' : ''}`}>
            <div className="linee" style={{ width: '100%' }}></div>
            <div className="linee" style={{ width: '100%' }}></div>
            <div className="linee" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div ref={drawerRef} className={`drawer ${drawerOpen ? 'open' : ''}`}>
          <ul className="drawer-menu">
            <Link className='Link' to="/">
              <li className="drawer-menu-item" >
                <span className="dropdown-toggle aTitle">Waytrix Dashboard </span>
              </li>
            </Link>
            {(!waytrixToken && !restoToken && !partnerToken) &&
              <Link className='Link' to="/WaytrixLogin">
                <li className="drawer-menu-item" >
                  <span className="dropdown-toggle aTitle">Waytrix Login</span>
                </li>
              </Link>
            }
            {waytrixToken &&
              <li className="drawer-menu-item">
                <span className="dropdown-toggle aTitle" onClick={() => { localStorage.removeItem('waytrixToken'); setWaytrixToken(''); }}>
                  Waytrix Logout
                </span>
              </li>
            }
            {/* GetRestoAccountForVideoUpdate */}
            {waytrixToken &&
              <li className="drawer-menu-item" onClick={handleMenuItemClick}>
                <span className="dropdown-toggle aTitle">Waytrix Account</span>
                <ul className="sub-menu">
                  <li className='aSubTitle'>    <Link className='Link' to="/NavResto">Resto</Link></li>
                  <li className='aSubTitle'>    <Link className='Link' to="/AddResto">Add Resto</Link></li>
                  {/* <li className='aSubTitle'>    <Link className='Link' to="/GetRestoAcounts">Add Video</Link></li> */}
                  <li className='aSubTitle'>    <Link className='Link' to="/AddPartners">Add Partners</Link></li>
                  <li className='aSubTitle'>    <Link className='Link' to="/AddVoucher">Add Voucher</Link></li>
                  {/* <li className='aSubTitle'>    <Link className='Link' to="/GetRestoAccountButtons">Add Buttons</Link></li> */}
                  <li className='aSubTitle'>    <Link className='Link' to="/TableLocations">Table Locations</Link></li>
                  <li className='aSubTitle'>    <Link className='Link' to="/AddCustomButtons">Add Custom Buttons</Link></li>
                  <li className='aSubTitle'>    <Link className='Link' to="/GetAllRestoForVidPrev">Video Preview</Link></li>
                  {/* <li className='aSubTitle'>    <Link className='Link' to="/GetRestoForAddTableOrValet">Add Table Or Valet</Link></li> */}
                  {/* <li className='aSubTitle'>    <Link className='Link' to="/getTableAccounts">Add Waiter</Link></li> */}
                  {/* <li className='aSubTitle'>    <Link className='Link' to="/GetRestoAccountForVideoUpdate">Update Video</Link></li> */}
                  <li className='aSubTitle'>    <Link className='Link' to="/GetRestoAccountForDelete">Delete Resto</Link></li>


                </ul>
              </li>
            }

            {/* Resto account */}
            {(!restoToken && !partnerToken) &&
              <Link className='Link' to="/RestoLogin">
                <li className="drawer-menu-item" >
                  <span className="dropdown-toggle aTitle">Resto Login</span>
                </li>
              </Link>
            }
            {restoToken &&
              <li className="drawer-menu-item">
                <span className="dropdown-toggle aTitle" onClick={() => { localStorage.removeItem('restoToken'); setRestoToken(''); }}>
                  Resto Logout
                </span>
              </li>
            }
{/* GetWaiters */}
{restoToken &&
              <li className="drawer-menu-item" onClick={handleMenuItemClick}>
                <span className="dropdown-toggle aTitle">Resto Account</span>
                <ul className="sub-menu">
                  {/* <li className='aSubTitle'>    <Link className='Link' to="/ContactUs">Contact Us</Link></li> */}
                  <li className='aSubTitle'>    <Link className='Link' to="/AddMenu">Add Menu</Link></li>
                  <li className='aSubTitle'>    <Link className='Link' to="/ViewTables">View Tables</Link></li>
                  <li className='aSubTitle'>    <Link className='Link' to="/GetWaiters">Assign Tables To Waiters</Link></li>
                  <li className='aSubTitle'>    <Link className='Link' to="/GetSurveys">Get Surveys</Link></li>

                </ul>
              </li>
            }

            {
              partnerToken ?  <li className="drawer-menu-item">
              <span className="dropdown-toggle aTitle" onClick={() => { localStorage.removeItem('partnerToken'); setPartnerToken(''); }}>
                Partner Logout
              </span>
            </li> : <Link className='Link' to="/PartnerLogin">
                <li className="drawer-menu-item" >
                  <span className="dropdown-toggle aTitle">Partner Login</span>
                </li>
              </Link>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
