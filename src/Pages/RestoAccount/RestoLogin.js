import React, { useState } from 'react';
import axios from 'axios';
import { ipAddress } from '../../config';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      alert('Please enter a valid email');
      return;
    }

 

    const userData = {
      email,
      password,
      role: "resto"
    };

    try {
      const response = await axios.post(`${ipAddress}/api/Auth/login`, userData);
      const { token, _id } = response.data;
      console.log("hdiuewhdiuwttttttttt::::::")
      localStorage.setItem('restoId', _id);
      localStorage.setItem('restoToken', token);
      localStorage.removeItem('waytrixToken');
      console.log('Token stored successfully:', token);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className='containers'>
      <h1 className='headerText'>Resto Sign In</h1>
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
