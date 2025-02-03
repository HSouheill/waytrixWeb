import React, { useState, useEffect, useRef } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);



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

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedImage(file);
  //     const fileUrl = URL.createObjectURL(file);
  //     setPreviewUrl(fileUrl);
  //   }
  // };

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  };
  const handleImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      alert('Please upload an image file');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageFile(files[0]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedRestoIds = partnerRestoAccounts.filter(account => account.selected).map(account => account._id);
    
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('description', description);
    formData.append('password', password);
    formData.append('role', 'partner');
    formData.append('restoIdArray', JSON.stringify(selectedRestoIds));
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const token = localStorage.getItem('waytrixToken');
      if (!token) {
        throw new Error('waytrixToken not found in localStorage');
      }

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
        setLogo('');
        setName('');
        setPhone('');
        setDescription('');
        setPassword('');
        setSelectedImage(null);
        setPreviewUrl('');
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
    setShowPassword((prev) => !prev);
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
              type={showPassword ? 'text' : 'password'}
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
        <div className="form-group">
          <label htmlFor="image">QR Code</label>
          <div
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <div className="drop-zone-content">
              {previewUrl ? (
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image"
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl('');
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div className="drop-zone-text">
                    <span className="drop-zone-prompt">
                      Drag and drop an image here
                    </span>
                    <span className="drop-zone-prompt">- OR -</span>
                    <button
                      type="button"
                      className="select-file-btn"
                      onClick={handleSelectFile}
                    >
                      Select File
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
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