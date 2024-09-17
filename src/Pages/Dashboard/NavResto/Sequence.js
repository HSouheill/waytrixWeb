import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Tablets.module.css';

const Sequence = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restoId = queryParams.get('id');

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos from the API
  useEffect(() => {
    const fetchVideos = async () => {
      if (!restoId) {
        setError('Restaurant ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://waytrixback.onrender.com/api/Auth/getAllVideosByRestoId', {
          params: { restoId },
        });
        if (response.data) {
          // Sort the videos by the `order` field
          const sortedVideos = response.data.sort((a, b) => a.order - b.order);
          setVideos(sortedVideos);
        } else {
          setVideos([]);
        }
      } catch (error) {
        setError('Error fetching videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [restoId]);

  const handleDelete = async (videoId) => {
    try {
      await axios.delete('https://waytrixback.onrender.com/api/Auth/deleteVideoByTableId', {
        data: { videoId },
      });
      setVideos(videos.filter(video => video._id !== videoId));
      // navigate(0); // Refresh the page
    } catch (error) {
      setError('Error deleting video.');
    }
  };

  const handleUpdateOrder = async (videoId, newOrder) => {
    try {
      await axios.patch('https://waytrixback.onrender.com/api/Auth/updateVideoOrder', {
        videoId,
        newOrder
      });

      // Update the local state to reflect the change
      const updatedVideos = videos.map(video =>
        video._id === videoId ? { ...video, order: newOrder } : video
      );

      // Sort the videos by the `order` field
      const sortedVideos = updatedVideos.sort((a, b) => a.order - b.order);
      setVideos(sortedVideos);
    } catch (error) {
      setError('Error updating video order.');
    }
  };

  return (
    <div>
      <h1>Video Table</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <table className={styles.excelTable}>
        <thead>
          <tr>
            <th>Video URL</th>
            <th>Table ID</th>
            <th>Order</th>
            <th>Rush Hour</th>
            <th>Partner ID</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.length > 0 ? (
            videos.map((video) => (
              <tr key={video._id}>
                <td>{video.videoURL}</td>
                <td>{video.tableId}</td>
                <td>
                  <input
                    type="number"
                    value={video.order}
                    onChange={(e) =>
                      handleUpdateOrder(video._id, parseInt(e.target.value, 10))
                    }
                    className={styles.orderInput}
                  />
                </td>
                <td>{video.rushHour ? "Yes" : "No"}</td>
                <td>{video.partnerId}</td>
                <td>{new Date(video.uploadDate).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className={styles.button}
                  >
                    Delete Video
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No videos available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.addRestoButtonContainer}>
        <Link className={styles.link} to={`/AddVideoSeq?id=${restoId}`}>
          Add Video
        </Link>
      </div>
    </div>
  );
};

export default Sequence;
