import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Tablets.module.css';
import { ipAddress } from '../../../config';

const Sequence = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const restoId = queryParams.get('id');

  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [tableNames, setTableNames] = useState({});
  const [partnerNames, setPartnerNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOption, setFilterOption] = useState('all'); // State for filtering options
  const [totalDuration, setTotalDuration] = useState(0); // New state for total duration
  const [totalDuration2, setTotalDuration2] = useState(0); // New state for total duration
  const [totalDuration3, setTotalDuration3] = useState(0); // New state for total duration

  useEffect(() => {
    const fetchVideos = async () => {
      if (!restoId) {
        setError('Restaurant ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${ipAddress}/api/Auth/getAllVideosByRestoId`, {
          params: { restoId },
        });
        if (response.data) {
          const sortedVideos = response.data.sort((a, b) => a.order - b.order);
          setVideos(sortedVideos);
          setFilteredVideos(sortedVideos); // Initially, show all videos

          const tableIds = sortedVideos.map(video => video.tableId);
          fetchTableNames(tableIds);

          const uniquePartnerIds = [...new Set(sortedVideos.map(video => video.partnerId))];
          fetchPartnerNames(uniquePartnerIds);
        } else {
          setVideos([]);
          setFilteredVideos([]);
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
          const response = await axios.post(`${ipAddress}/api/Auth/getTableNameByTableId`, {
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
          const response = await axios.post(`${ipAddress}/api/Auth/getPartnerNameByPartnerId`, {
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

  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setFilterOption(filterValue);

    let filtered;
    if (filterValue === 'rush') {
      filtered = videos.filter(video => video.rushHour);
    } else if (filterValue === 'non-rush') {
      filtered = videos.filter(video => !video.rushHour);
    } else {
      filtered = videos;
    }

    setFilteredVideos(filtered);
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`${ipAddress}/api/Auth/deleteVideoByTableId`, {
        data: { videoId },
      });
      setVideos(videos.filter(video => video._id !== videoId));
      setFilteredVideos(filteredVideos.filter(video => video._id !== videoId));
    } catch (error) {
      setError('Error deleting video.');
    }
  };

  const handleUpdateOrder = async (videoId, newOrder) => {
    try {
      await axios.patch(`${ipAddress}/api/Auth/updateVideoOrder`, {
        videoId,
        newOrder
      });

      const updatedVideos = videos.map(video =>
        video._id === videoId ? { ...video, order: newOrder } : video
      );

      const sortedVideos = updatedVideos.sort((a, b) => a.order - b.order);
      setVideos(sortedVideos);
      setFilteredVideos(sortedVideos); // Apply sorting to filtered videos as well
    } catch (error) {
      setError('Error updating video order.');
    }
  };


  useEffect(() => {
    const fetchTotalVideoLength = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const { data } = await axios.post(`${ipAddress}/api/Auth/videos-length`, {
          restoId: restoId
        }, {
          headers: {
            Authorization: waytrixToken
          }
        });
  
        console.log('API response:', data);
        setTotalDuration(data.totalDuration || 0);
      } catch (error) {
        console.error('Error fetching total video length:', error);
        setTotalDuration(0);
      }
    };
    fetchTotalVideoLength();
  }, [restoId]); // Run once on mount or when restoId changes
  
  useEffect(() => {
    const fetchTotalRushVideoLength = async () => {
      try {
        const waytrixToken = localStorage.getItem('waytrixToken');
        const { data } = await axios.post(`${ipAddress}/api/Auth/getTotalRushVideoLengthByRestoId`, {
          restoId: restoId
        }, {
          headers: {
            Authorization: waytrixToken
          }
        });
  
        console.log('API response:', data);
        setTotalDuration2(data.totalDuration || 0);
      } catch (error) {
        console.error('Error fetching rush video length:', error);
        setTotalDuration2(0);
      }
    };
    fetchTotalRushVideoLength();
  }, [restoId]); // Run once on mount or when restoId changes

//Effect to calculate totalDuration3
useEffect(() => {
  const calculateTotalDuration3 = () => {
    setTotalDuration3(totalDuration - totalDuration2);
  };

  calculateTotalDuration3();
}, [totalDuration, totalDuration2]); // Dependencies: run effect when totalDuration or totalDuration2 changes


  return (
    <div>
      <h1>Video Table</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Dropdown for filtering */}
      <div>
        <label htmlFor="filter" style={{ fontSize: 16, marginBottom: 5, marginRight: 5 }}>Filter Videos:</label>
        <select id="filter" value={filterOption} onChange={handleFilterChange} style={{marginRight: 15}}>
          <option value="all">Show All</option>
          <option value="rush">Filter Rush Hour</option>
          <option value="non-rush">Filter Non-Rush Hour</option>
        </select>
        (Total Videos Time: {Math.floor(totalDuration / 60)}m:{Math.round(totalDuration % 60)}s)
        (Rush Hour Videos Time: {Math.floor(totalDuration2 / 60)}m:{Math.round(totalDuration2 % 60)}s)
        (Non Rush Hour Videos Time: {Math.floor(totalDuration3 / 60)}m:{Math.round(totalDuration3 % 60)}s)
      </div>

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
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <tr key={video._id}>
                <td>
                  <video
                    src={video.videoURL}
                    controls
                    loop
                    muted
                    width="200"
                    height="150"
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
