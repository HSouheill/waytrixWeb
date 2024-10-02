import React, { useState } from 'react';
import axios from 'axios';
import './WaytrixLogin.css';
import { ipAddress } from '../../config';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      // axios.defaults.withCredentials = true;
      const response = await axios.post(`${ipAddress}/api/Auth/login`, userData);
      const { token } = response.data;
      // console.log(response)
      console.log("hiewuhfiuwehfiuhhiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
      console.log(document.cookie)
      localStorage.setItem('waytrixToken', token);
      localStorage.removeItem('restoToken');
      console.log('Token stored successfully:', token);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className='containers'>
      <h1 className='headerText'>Waytix Sign In</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='input'
      />
      <input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className='input'
      />
      <button onClick={handleSignIn} className='button'>
        Sign In
      </button>
    </div>
  );
};

export default SignIn;
