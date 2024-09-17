import React, { useState } from 'react';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const userData = {
      phone: parseInt(email), // Sending email as an integer
      password
    };

    try {
      const response = await axios.post('https://waytrixback.onrender.com/api/Auth/partner_login', userData);
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

  return (
    <div className='containers'>
      <h1 className='headerText'>Partner Sign In</h1>
      <input
        placeholder="Phone"
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
