import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ipAddress } from '../../config';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RestoForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false); // New state for controlling the alert
  const navigate = useNavigate(); // Initialize the navigate function

  const handleForgotPassword = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      alert('Please enter a valid email');
      return;
    }

    try {
      const response = await axios.post(`${ipAddress}/api/Auth/generateForgotKey`, { email });
      setMessage(response.data.message);
      setShowAlert(true); // Show alert if successful
    } catch (error) {
      console.error('Error generating forgot key:', error);
      setMessage('Error generating forgot key. Please try again.');
      setShowAlert(true); // Show alert if there's an error
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false); // Hide the alert
  };

  // Use effect to handle navigation based on the message
  useEffect(() => {
    if (message === 'Forgot key sent successfully') {
      navigate('/RestoForgotPassword2'); // Navigate to the new route
    }
  }, [message, navigate]); // Run effect when message changes

  return (
    <div className='containers'>
      <h1 className='headerText'>Forgot Password</h1>
      <input
        placeholder="Enter valid email to verify account"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='input'
      />
      <button onClick={handleForgotPassword} className='button'>
        Generate Forgot Key
      </button>
      {showAlert && ( // Conditionally render the alert
        <div className='alert'>
          {message}
          <button onClick={handleAlertClose}>Close</button> {/* Button to close the alert */}
        </div>
      )}

      {/* Add CSS at the bottom of the page */}
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

          .alert {
            margin-top: 20px;
            padding: 10px;
            background-color: #f8d7da; /* Light red background for error */
            color: #721c24; /* Dark red text color */
            border: 1px solid #f5c6cb; /* Red border */
            border-radius: 5px;
          }

          .alert button {
            margin-left: 10px;
            padding: 5px 10px;
          }
        `}
      </style>
    </div>
  );
};

export default RestoForgotPassword;
