import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AddVideo.css';
import Multer from './multer/multer';

const AddVideo = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    videoURL: '',
    maxTimes: 0,
    orderNumber: '',
    partnerId: '',
    uploadDate: '' // Add uploadDate field here
  });
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const { data } = await axios.get('https://waytrixback.onrender.com/api/PartnerAccountRoutes/get_partners', {
          headers: {
            Authorization: waytrixToken
          }
        });
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchPartners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePartnerChange = (partnerId) => {
    setSelectedPartner(partnerId);
    setFormData({ ...formData, partnerId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const waytrixToken = localStorage.getItem('waytrixToken');
      const { data } = await axios.post('https://waytrixback.onrender.com/api/VideoRoutes/AddVideo', {
        videoURL: formData.videoURL,
        restoId: id,
        maxTimes: formData.maxTimes,
        Displayed: 0,
        order: formData.orderNumber,
        partnerId: formData.partnerId,
        uploadDate: formData.uploadDate // Send uploadDate with req.body
      }, {
        headers: {
          Authorization: waytrixToken
        }
      });
      console.log('Response:', data);
      setShowModal(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container">
      <Multer />
      <h1 className="title">Upload Advertisement</h1>
      <form className="luxurious-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="videoURL">Enter Video URL:</label>
          <center>
            <input className="input" type="text" id="videoURL" name="videoURL" value={formData.videoURL} onChange={handleChange} />
          </center>
        </div>
        <div className="form-group">
          <label className="label" htmlFor="maxTimes">Enter Max Times:</label>
          <center>
            <input className="input" type="number" id="maxTimes" name="maxTimes" value={formData.maxTimes} onChange={handleChange} />
          </center>
        </div>
        <div className="form-group">
          <label className="label" htmlFor="orderNumber">Enter Order Number:</label>
          <center>
            <input className="input" type="number" id="orderNumber" name="orderNumber" value={formData.orderNumber} onChange={handleChange} />
          </center>
        </div>
        <div className="form-group">
          <label className="label" htmlFor="uploadDate">Select Upload Date:</label>
          <center>
            <input className="input" type="date" id="uploadDate" name="uploadDate" value={formData.uploadDate} onChange={handleChange} />
          </center>
        </div>
        <div className="grid-container-c">
        <label className="labelc">Select Partner:</label>
        {partners.map((partner) => (
          <div key={partner._id} className="grid-itemc">
            <input
              type="checkbox"
              id={`partner-${partner._id}`}
              name="partner"
              value={partner._id}
              checked={selectedPartner === partner._id}
              onChange={() => handlePartnerChange(partner._id)}
            />
            <label htmlFor={`partner-${partner._id}`}>{partner.name}</label>
          </div>
        ))}
      </div>
        <button className="submit-btn" type="submit">Upload Video</button>
      </form>
      {showModal && (
        <div className="modal">
          <p style={{color:'white', fontWeight:'bold'}}>Advertisement added successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AddVideo;
