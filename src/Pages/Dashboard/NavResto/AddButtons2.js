import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './AddButtons.css';
import { ipAddress } from '../../../config';

const AddButtons2 = () => {
  const location = useLocation(); // Get the location object
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id'); // Extract 'id' from the query string

  const [showModal, setShowModal] = useState(false);
  const [napkins, setNapkins] = useState(true);
  const [sugar, setSugar] = useState(false);
  const [salt, setSalt] = useState(true);
  const [oil, setOil] = useState(false);
  const [glassOfIce, setGlassOfIce] = useState(true);
  const [emptyGlass, setEmptyGlass] = useState(false);
  const [sousPlat, setSousPlat] = useState(true);
  const [bill, setBill] = useState(false);
  const [shishaCharcoal, setShishaCharcoal] = useState(true);
  const [toothpick, setToothpick] = useState(false);
  const [ketchup, setKetchup] = useState(true);

  const handleSubmit = () => {
    const waytrixToken = localStorage.getItem('waytrixToken');

    axios.post(
      `${ipAddress}/api/ButtonsRoutes/AddBooleanButtons`,
      {
        restoId: id,
        Napkins: napkins,
        Sugar: sugar,
        Salt: salt,
        Oil: oil,
        GlassOfIce: glassOfIce,
        EmptyGlass: emptyGlass,
        SousPlat: sousPlat,
        Bill: bill,
        ShishaCharcoal: shishaCharcoal,
        Toothpick: toothpick,
        Ketchup: ketchup,
      },
      {
        headers: { Authorization: `${waytrixToken}` },
      }
    )
      .then(() => {
        setShowModal(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 5000); // Redirect after 5 seconds
      })
      .catch(console.error);
  };

  return (
    <div className="luxurious-dark-theme">
      <div className="button-container">
        <button className={napkins ? 'active' : ''} onClick={() => setNapkins(!napkins)}>
          Napkins
        </button>
        <button className={sugar ? 'active' : ''} onClick={() => setSugar(!sugar)}>
          Sugar
        </button>
        <button className={salt ? 'active' : ''} onClick={() => setSalt(!salt)}>
          Salt
        </button>
        <button className={oil ? 'active' : ''} onClick={() => setOil(!oil)}>
          Oil
        </button>
        <button className={glassOfIce ? 'active' : ''} onClick={() => setGlassOfIce(!glassOfIce)}>
          Glass Of Ice
        </button>
        <button className={emptyGlass ? 'active' : ''} onClick={() => setEmptyGlass(!emptyGlass)}>
          Empty Glass
        </button>
        <button className={sousPlat ? 'active' : ''} onClick={() => setSousPlat(!sousPlat)}>
          Sous Plat
        </button>
        <button className={bill ? 'active' : ''} onClick={() => setBill(!bill)}>
          Bill
        </button>
        <button className={shishaCharcoal ? 'active' : ''} onClick={() => setShishaCharcoal(!shishaCharcoal)}>
          Shisha Charcoal
        </button>
        <button className={toothpick ? 'active' : ''} onClick={() => setToothpick(!toothpick)}>
          Toothpick
        </button>
        <button className={ketchup ? 'active' : ''} onClick={() => setKetchup(!ketchup)}>
          Ketchup
        </button>
      </div>
      <center>
        <button style={{ width: 200 }} onClick={handleSubmit}>
          Submit
        </button>
      </center>
      {showModal && (
        <div className="modal">
          <p style={{ color: 'white' }}>Buttons have been updated successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AddButtons2;
