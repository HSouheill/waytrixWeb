import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Multer from '../../WaytrixAccount/AddVideo/multer/multer';
import { ipAddress } from '../../../config';

const AddVideoSeq = () => {
  const location = useLocation();

  const [formData, setFormData] = useState({
    videoURL: '',

   
    partnerId: '',
    uploadDate: '',
    duration: 0
  });

  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalDuration, setTotalDuration] = useState(0); // New state for total duration
  const [totalDuration2, setTotalDuration2] = useState(0); // New state for total duration
  const [totalDuration3, setTotalDuration3] = useState(0); // New state for total duration

  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  const queryParams = getQueryParams(location.search);
  const restoId = queryParams.get('id');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const { data } = await axios.get(`${ipAddress}/api/PartnerAccountRoutes/get_partners`, {
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

  const calculateVideoDuration = (videoURL) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoURL;
      video.addEventListener('loadedmetadata', () => {
        resolve(video.duration); // Duration in seconds
      });
      video.addEventListener('error', () => {
        reject(new Error('Failed to load video metadata'));
      });
    });
  };

  const fetchTotalVideoLength = async () => {
    try {
      const waytrixToken = localStorage.getItem('waytrixToken');

      // Send POST request with restoId in the request body
      const { data } = await axios.post(`${ipAddress}/api/Auth/videos-length`, {
        restoId: restoId // Send restoId in the request body
      }, {
        headers: {
          Authorization: waytrixToken
        }
      });
  
      console.log('API response:', data); // Debugging line
      setTotalDuration(data.totalDuration || 0); // Set total duration from API response
    } catch (error) {
      console.error('Error fetching total video length:', error);
      setTotalDuration(0); // Fallback value if the request fails
    }
  };
  
  fetchTotalVideoLength(); // Fetch total video length on mount



  const fetchTotalRushVideoLength = async () => {
    try {
      const waytrixToken = localStorage.getItem('waytrixToken');

      // Send POST request with restoId in the request body
      const { data } = await axios.post(`${ipAddress}/api/Auth/getTotalRushVideoLengthByRestoId`, {
        restoId: restoId // Send restoId in the request body
      }, {
        headers: {
          Authorization: waytrixToken
        }
      });
  
      console.log('API response:', data); // Debugging line
      setTotalDuration2(data.totalDuration || 0); // Set total duration from API response
    } catch (error) {
      console.error('Error fetching total video length:', error);
      setTotalDuration2(0); // Fallback value if the request fails
    }
  };
  fetchTotalRushVideoLength(); // Fetch total video length on mount


  // Effect to calculate totalDuration3
useEffect(() => {
  const calculateTotalDuration3 = () => {
    setTotalDuration3(totalDuration - totalDuration2);
  };
  calculateTotalDuration3();
}, [totalDuration, totalDuration2]); // Dependencies: run effect when totalDuration or totalDuration2 changes


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const videoDuration = await calculateVideoDuration(formData.videoURL);
      console.log('Calculated video duration:', videoDuration); // Debugging line

      // Determine which total duration to use based on rushHour checkbox
      const exceedsLimit = formData.rushHour 
        ? totalDuration2 + videoDuration > 3600 
        : totalDuration3 + videoDuration > 3600;

      if (exceedsLimit) { 
        setErrorMessage('Cannot add more videos. The total length exceeds one hour.');
        console.error('Error: Total video length exceeds one hour.');
        return;
      }

      const waytrixToken = localStorage.getItem('waytrixToken');
      const { data } = await axios.post(`${ipAddress}/api/VideoRoutes/AddVideo`, {
        videoURL: formData.videoURL,
        restoId: restoId,
        Displayed: 0,
        partnerId: formData.partnerId,
        uploadDate: formData.uploadDate,
        duration: videoDuration,
        rushHour: formData.rushHour // Include rushHour here
      }, {
        headers: {
          Authorization: waytrixToken
        }
      });

      console.log('Response:', data);
      setShowModal(true);
      setTimeout(() => {
        window.location.reload(); // Force refresh the page
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while adding the video.');
    }
  };
  
  

  return (
    <div className="form-container">
      <Multer />
      <h1 className="title">Upload Advertisement  {/* <br /> */}
      {/* (Total Videos Time: {Math.floor(totalDuration / 60)}m:{Math.round(totalDuration % 60)}s) */}
      </h1>
      <form className="luxurious-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="videoURL">
            Enter Video URL:
          </label>
          <center>
            <input
              className="input"
              type="text"
              id="videoURL"
              name="videoURL"
              value={formData.videoURL}
              onChange={handleChange}
            />
          </center>
        </div>
       
        
        <div className="form-group">
          <label className="label" htmlFor="uploadDate">
            Select Upload Date:
          </label>
          <center>
            <input
              className="input"
              type="date"
              id="uploadDate"
              name="uploadDate"
              value={formData.uploadDate}
              onChange={handleChange}
            />
          </center>
        </div>
        <div className="form-group" style={{ border: '1px solid white', padding: '15px' }}>
          <label className="label" htmlFor="rushHour">
            Tick if Rush Hour <br /> (1PM-3PM & 9PM-11PM):
          </label>
          <center>
            <input
              className="checkbox"
              type="checkbox"
              id="rushHour"
              name="rushHour"
              checked={formData.rushHour}
              onChange={(e) =>
                setFormData({ ...formData, rushHour: e.target.checked })
              }
            />
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
        <button className="submit-btn" type="submit">
          Upload Video
        </button>
      </form>
      {showModal && (
        <div className="modal">
          <p style={{ color: "white", fontWeight: "bold" }}>
            Advertisement added successfully!
          </p>
        </div>
      )}
      {errorMessage && (
        <div className="error-message">
          <p style={{ color: "red" }}>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AddVideoSeq;
