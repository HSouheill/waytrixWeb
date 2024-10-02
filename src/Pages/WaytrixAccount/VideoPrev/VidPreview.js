import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams for getting URL parameters
import './VidPreview.css'; // Import CSS file for styling
import { ipAddress } from '../../../config';

function HomeScreen() {
  const [mediaURL, setMediaURL] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const videoRef = useRef(null);

  const { id } = useParams(); // Get the 'id' parameter from the URL

  useEffect(() => {
    fetchMedia();
  }, [id]); // Fetch media whenever 'id' changes

  const fetchMedia = async () => {
    try {
      const waytrixToken = localStorage.getItem('waytrixToken');
      const response = await axios.post(
        `${ipAddress}/api/VideoRoutes/GetOneVideoPreview`,
        {
          tableId: id, // Use 'id' from URL params
        },
        {
          headers: {
            Authorization: `${waytrixToken}`,
          },
        }
      );
  
      const url = response.data.videoURL;
  
      if (url.endsWith('.mp4')) {
        setIsVideo(true);
        setMediaURL(url);
      } else {
        setIsVideo(false);
        setMediaURL(url);
        setTimeout(fetchMedia, 10000); // Fetch new media after 10 seconds if it's an image
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };
  

  const handlePlaybackStatusUpdate = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play(); // Resume playback if video is paused
    }
  };

  return (
    <div className="container">
      {mediaURL && isVideo ? (
        <video ref={videoRef} autoPlay controls className="video" onEnded={fetchMedia}>
          <source src={mediaURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        mediaURL && <img src={mediaURL} alt="Media" className="image" />
      )}
    </div>
  );
}

export default HomeScreen;
