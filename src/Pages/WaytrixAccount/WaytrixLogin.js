import React, { useState } from 'react';
import axios from 'axios';
import './WaytrixLogin.css';
import { ipAddress } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility

  const handleSignIn = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      alert('Please enter a valid email');
      return;
    }

    if (password.trim().length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    const userData = {
      email,
      password,
      role: "waytrix"
    };

    try {
      const response = await axios.post(`${ipAddress}/api/Auth/login`, userData);
      const { token } = response.data;
      localStorage.setItem('waytrixToken', token);
      localStorage.removeItem('restoToken');
      console.log('Token stored successfully:', token);
    } catch (error) {
      console.error('Error signing in:', error);
      
      // Show an alert if the login fails for any other reason
      alert('Please check your email and password');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='containers'>
      <h1 className='headerText'>Waytrix Sign In</h1>
      <input
        placeholder="Email"
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

      {/* Add CSS for eye icon */}
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
