import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './GetForLoopId.css';
import Multer from '../multer/multer';

export const GetForLoopId = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const response = await axios.post('https://waytrixback.onrender.com/api/VideoRoutes/get_one_for_loop_id_video_for_future_update', {
          restoId: id
        }, {
          headers: {
            Authorization: waytrixToken
          }
        });
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = (index) => {
    const updatedVideos = [...videos];
    updatedVideos[index].isEditing = true; // Flag to show inputs instead of text
    setVideos(updatedVideos);
  };

  const handleInputChange = (event, index, field) => {
    const updatedVideos = [...videos];
    updatedVideos[index][field] = event.target.value;
    setVideos(updatedVideos);
  };

  const handleSave = async (index) => {
    const updatedVideos = [...videos];
    const video = updatedVideos[index];
    
    try {
      const waytrixToken = localStorage.getItem('waytrixToken');
      await axios.post('https://waytrixback.onrender.com/api/VideoRoutes/update_forLoopId_video_records', {
        forLoopId: video.forLoopId,
        videoURL: video.videoURL,
        maxTimes: video.maxTimes,
        order: video.order,
        uploadDate: video.uploadDate
      }, {
        headers: {
          Authorization: waytrixToken
        }
      });

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 4000);

      setTimeout(() => {
        window.location.href = '/';
      }, 5000);

    } catch (error) {
      console.error('Error updating video:', error);
    }

    updatedVideos[index].isEditing = false; // Clear editing flag
    setVideos(updatedVideos);
  };

  const handleDateChange = (event, index) => {
    const updatedVideos = [...videos];
    updatedVideos[index].uploadDate = event.target.value; // Assuming event.target.value is YYYY-MM-DD format
    setVideos(updatedVideos);
  };

  return (
    <div className="get-for-loop-id">
      <div className="id-text">The ID is: {id}</div>
      <div className="video-list">
        {videos.map((video, index) => (
          <div key={video._id} className="video-item">
            {video.isEditing ? (
              <>
                <Multer />
                <label className="input-label">Video URL:</label>
                <input
                  type="text"
                  value={video.videoURL}
                  onChange={(e) => handleInputChange(e, index, 'videoURL')}
                />
                <label className="input-label">Max Times:</label>
                <input
                  type="number"
                  value={video.maxTimes}
                  onChange={(e) => handleInputChange(e, index, 'maxTimes')}
                />
                <label className="input-label">Order:</label>
                <input
                  type="number"
                  value={video.order}
                  onChange={(e) => handleInputChange(e, index, 'order')}
                />
                <label className="input-label">Upload Date:</label>
                <input
                  type="date"
                  value={video.uploadDate}
                  onChange={(e) => handleDateChange(e, index)}
                />
                <button onClick={() => handleSave(index)}>Save</button>
              </>
            ) : (
              <>
                <Multer />
                <p><span className="video-label">Video URL:</span> <span className="video-detail">{video.videoURL}</span></p>
                <p><span className="video-label">Max Times:</span> <span className="video-detail">{video.maxTimes}</span></p>
                <p><span className="video-label">Order:</span> <span className="video-detail">{video.order}</span></p>
                <p><span className="video-label">Upload Date:</span> <span className="video-detail">{video.uploadDate}</span></p>
                <button onClick={() => handleUpdate(index)}>Update</button>
              </>
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal">
          <p style={{color:'white'}}>Update successful!</p>
        </div>
      )}
    </div>
  );
};

export default GetForLoopId;
