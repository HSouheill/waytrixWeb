import React, { useState } from 'react';
import axios from 'axios';
import { ipAddress } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RestoForgotPassword2 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotKey, setForgotKey] = useState('');
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleUpdatePassword = async () => {
    // Validate email format
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      alert('Please enter a valid email');
      return;
    }

    // Check if password is provided
    if (!password.trim()) {
      alert('Please enter a new password');
      return;
    }

    // Check if forgot key is provided
    if (!forgotKey.trim()) {
      alert('Please enter the forgot key');
      return;
    }

    try {
      const response = await axios.post(
        `${ipAddress}/api/Auth/updatePassword`, 
        {
          email,
          password,
          forgotKey: parseInt(forgotKey, 10), // Ensure the forgot key is sent as a number
        },
        {
          headers: { 'Content-Type': 'application/json' }, // Ensure the headers are correctly set
        }
      );
      
      setMessage(response.data.message); // Display response message
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Error updating password. Please try again.'
      );
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='containers'>
      <h1 className='headerText'>Update Password</h1>
      <input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='input'
      />
      <div className="password-input-container">
        <input
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={passwordVisible ? "text" : "password"} // Toggle input type based on visibility state
          className='input'
        />
        <span onClick={togglePasswordVisibility} className="eye-icon">
          <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
        </span>
      </div>
      <input
        placeholder="Enter forgot key (Check your email)"
        value={forgotKey}
        onChange={(e) => setForgotKey(e.target.value)}
        className='input'
      />
      <button onClick={handleUpdatePassword} className='button'>
        Update Password
      </button>
      {message && <p>{message}</p>} {/* Display success/error message */}

      <style>
        {`
          .input {
            width: 400px;
            margin-bottom: 20px; /* Add margin for spacing */
            padding: 10px; /* Add padding for better appearance */
          }

          .button {
            padding: 10px 20px; /* Add padding for the button */
            cursor: pointer; /* Change cursor on hover */
          }

          .containers {
            display: flex;
            flex-direction: column;
            align-items: center; /* Center items */
            justify-content: center;
          }

          .password-input-container {
            position: relative;
            display: flex;
            align-items: center;
          }

          .eye-icon {
            position: absolute;
            right: 10px;
            bottom: 30px;
            cursor: pointer;
            color: #fff; /* Adjust icon color */
          }
        `}
      </style>
    </div>
  );
};

export default RestoForgotPassword2;
