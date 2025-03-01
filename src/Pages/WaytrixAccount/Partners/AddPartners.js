import React, { useState, useEffect } from 'react';
import './AddPartners.css';
import axios from 'axios';
import Multer from '../AddVideo/multer/multer';
import { ipAddress } from '../../../config';

const AddPartners = () => {
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [partnerRestoAccounts, setPartnerRestoAccounts] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [qrCodePreview, setQrCodePreview] = useState('');

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrCodeFile(file);
      setQrCodePreview(URL.createObjectURL(file));
    }
  };



  useEffect(() => {
    fetchPartnerRestoAccounts();
  }, []);

  const fetchPartnerRestoAccounts = async () => {
    try {
      const token = localStorage.getItem('waytrixToken');
      if (!token) {
        throw new Error('waytrixToken not found in localStorage');
      }

      const config = {
        headers: {
          'Authorization': token
        }
      };

      const response = await axios.get(`${ipAddress}/api/PartnerAccountRoutes/partner_get_resto_account`, config);
      setPartnerRestoAccounts(response.data);
    } catch (error) {
      console.error('Error fetching partner restaurant accounts:', error);
    }
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // const handleQrCodeUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setQrCodeImage(file);
  //     setQrCodePreview(URL.createObjectURL(file));
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedRestoIds = partnerRestoAccounts
        .filter(account => account.selected)
        .map(account => account._id);

    // Create FormData object
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('description', description);
    formData.append('password', password);
    formData.append('role', 'partner');
    
    // Append restoIdArray
    selectedRestoIds.forEach((id, index) => {
        formData.append(`restoIdArray[${index}]`, id);
    });

    // Append the file
    if (qrCodeFile) {
        formData.append('qrCodeImage', qrCodeFile);
    }

    try {
        const token = localStorage.getItem('waytrixToken');
        const config = {
            headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data'
            }
        };

        await axios.post(`${ipAddress}/api/ContactUsRoutes/AddPartner`, formData, config);
        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
            setLogo(''); // Reset logo field too
            setName('');
            setPhone('');
            setDescription('');
            setPassword('');
            setQrCodeFile(null);
            window.location.reload();
        }, 5000);
    } catch (error) {
        console.error('Error adding partner:', error);
    }
};



  const handleCheckboxChange = (id) => {
    const updatedAccounts = partnerRestoAccounts.map(account =>
      account._id === id ? { ...account, selected: !account.selected } : account
    );
    setPartnerRestoAccounts(updatedAccounts);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  return (
    <div className="containerPARTNERS">
      <Multer />
      <h2 style={{ color: 'white' }}>Add Partners</h2>
      
      <center className='center'>
        <button type="submit" style={{ marginBottom: 20 }} className="submit-button" onClick={() => { window.location.href = '/DeletePartners'; }}>ALL PARTNERS</button>
      </center>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="logo">Logo</label>
          <input
            type="text"
            id="logo"
            name="logo"
            value={logo}
            onChange={handleLogoChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <span 
              onClick={togglePasswordVisibility} 
              style={{ 
                position: 'absolute', 
                right: '0px', 
                top: '44%', 
                transform: 'translateY(-50%)', 
                cursor: 'pointer' 
              }}>
              {showPassword ? '👁️' : '👁️‍🗨️'} 
            </span>
          </div>
        </div>

        <label>qr code</label>
        <div className="form-group">
        <label htmlFor="qrcode">QR Code Image</label>
        <input
          type="file"
          id="qrCodeImage"
          accept="uploads/*"
          onChange={handleQrCodeUpload}
        />
        {/* <input type="file" name="image" onChange={handleQrCodeUpload} /> */}

        {qrCodePreview && (
          <div className="qr-preview">
            <img src={qrCodePreview} alt="QR Code preview" style={{ maxWidth: '200px' }} />
          </div>
        )}
      </div>

        <div className="grid-container-checkt">
          {partnerRestoAccounts.map(account => (
            <div key={account._id} className="card-checkt">
              <label className="checkbox-container-checkt">
                <span style={{marginTop:45}}>{account.name}</span>
                <input
                  type="checkbox"
                  checked={account.selected || false}
                  onChange={() => handleCheckboxChange(account._id)}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          ))}
        </div>

        
        <center className='center'>
          <button type="submit" className="submit-button">Submit</button>
        </center>


      </form>
      {modalVisible && (
        <div className="modal">
          <p style={{ color: 'white', fontWeight: 'bold' }}>Partner has been added successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AddPartners;