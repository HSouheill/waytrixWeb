import React, { useState } from 'react';
import axios from 'axios';
import { ipAddress } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // New state for toggling password visibility

  const handleSignIn = async () => {
    const userData = {
      phone: parseInt(email), // Sending email as an integer
      password
    };

    try {
      const response = await axios.post(`${ipAddress}/api/Auth/partner_login`, userData);
      const { token, _id } = response.data;
      localStorage.setItem('partnerId', _id);
      localStorage.setItem('partnerToken', token);
      localStorage.removeItem('waytrixToken');
      localStorage.removeItem('restoToken');
      console.log('Token stored successfully:', token);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='containers'>
      <h1 className='headerText'>Partner Sign In</h1>
      <input
        placeholder="Phone"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='input'
      />
      <div className="password-input-container">
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={passwordVisible ? "text" : "password"} // Toggle input type based on visibility state
          className='input'
        />
        <span onClick={togglePasswordVisibility} className="eye-icon">
          <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
        </span>
      </div>
      <button onClick={handleSignIn} className='button'>
        Sign In
      </button>


         {/* Add CSS at the bottom of the page */}
         <style>
        {`
          .password-input-container {
            position: relative;
            display: flex;
            align-items: center;
          }

          .eye-icon {
            position: absolute;
            right: 10px;
            cursor: pointer;
            color: #fff; /* Adjust icon color */
          }

          .input {
            width: 400px;
            padding-right: 30px; /* Space for the eye icon */
          }
        `}
      </style>
    </div>
  );
};

export default SignIn;
