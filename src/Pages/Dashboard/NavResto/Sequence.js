import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Tablets.module.css';

const Sequence = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restoId = queryParams.get('id');

  const [videos, setVideos] = useState([]);
  const [tableNames, setTableNames] = useState({});
  const [partnerNames, setPartnerNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          const sortedVideos = response.data.sort((a, b) => a.order - b.order);
          setVideos(sortedVideos);

          const tableIds = sortedVideos.map(video => video.tableId);
          fetchTableNames(tableIds);

          const uniquePartnerIds = [...new Set(sortedVideos.map(video => video.partnerId))];
          fetchPartnerNames(uniquePartnerIds);
        } else {
          setVideos([]);
        }
      } catch (error) {
        setError('Error fetching videos.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTableNames = async (tableIds) => {
      try {
        const tableNameRequests = tableIds.map(async (tableId) => {
          const response = await axios.post('https://waytrixback.onrender.com/api/Auth/getTableNameByTableId', {
            tableId
          });
          return { tableId, tableName: response.data.tableName };
        });

        const tableNamesArray = await Promise.all(tableNameRequests);
        const tableNamesMap = tableNamesArray.reduce((acc, { tableId, tableName }) => {
          acc[tableId] = tableName;
          return acc;
        }, {});

        setTableNames(tableNamesMap);
      } catch (error) {
        console.error('Error fetching table names:', error);
        setError('Error fetching table names.');
      }
    };

    const fetchPartnerNames = async (partnerIds) => {
      try {
        const partnerNameRequests = partnerIds.map(async (partnerId) => {
          const response = await axios.post('https://waytrixback.onrender.com/api/Auth/getPartnerNameByPartnerId', {
            partnerId
          });
          return { partnerId, partnerName: response.data.partnerName };
        });

        const partnerNamesArray = await Promise.all(partnerNameRequests);
        const partnerNamesMap = partnerNamesArray.reduce((acc, { partnerId, partnerName }) => {
          acc[partnerId] = partnerName;
          return acc;
        }, {});

        setPartnerNames(partnerNamesMap);
      } catch (error) {
        console.error('Error fetching partner names:', error);
        setError('Error fetching partner names.');
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

      const updatedVideos = videos.map(video =>
        video._id === videoId ? { ...video, order: newOrder } : video
      );

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
            <th>Video</th>
            <th>Table Name</th>
            <th>Order</th>
            <th>Rush Hour</th>
            <th>Partner Name</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.length > 0 ? (
            videos.map((video) => (
              <tr key={video._id}>
                <td>
                  <video
                    src={video.videoURL}
                    controls
                    loop
                    muted
                    width="200" // Adjust the width as needed
                    height="150" // Adjust the height as needed
                  >
                    Your browser does not support the video tag.
                  </video>
                </td>
                <td>{tableNames[video.tableId] || 'Loading...'}</td>
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
                <td>{partnerNames[video.partnerId] || 'Loading...'}</td>
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
