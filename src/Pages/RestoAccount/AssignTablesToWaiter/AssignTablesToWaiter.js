import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './AssignTablesToWaiter.css';
import { ipAddress } from '../../../config';

const AssignTablesToWaiter = () => {
  const { id } = useParams();
  const [tables, setTables] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const restoToken = localStorage.getItem('restoToken');
        const restoId = localStorage.getItem('restoId');
        const headers = {
          Authorization: `${restoToken}`
        };
        const response = await axios.post(`${ipAddress}/api/Auth/GetTablesByRestoId`, { restoId }, { headers });
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    fetchTables();
  }, []);
  

  const handleCheckboxChange = (tableId) => {
    setSelectedIds(prevSelectedIds =>
      prevSelectedIds.includes(tableId)
        ? prevSelectedIds.filter(id => id !== tableId)
        : [...prevSelectedIds, tableId]
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${ipAddress}/api/Auth/update_waiter_tableId_array`, {
        _id: id,
        tableId: selectedIds
      });
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        // Replace with your desired route
        window.location.href = '/'; // Using window.location.href as per instruction
      }, 5000);
    } catch (error) {
      console.error('Error updating waiter tables:', error);
    }
  };

  return (
    <div className="assign-tables-container">
      <h1 className="title">Assign Tables to Waiter</h1>
      <p className="waiter-id">Waiter ID: {id}</p>
      <div className="tables-list">
        {tables.map(table => (
          <div key={table._id} className="table-card">
            <p className="table-email">{table.email}</p>
            <div className="checkbox-container">
              <input
                type="checkbox"
                className="table-checkbox"
                onChange={() => handleCheckboxChange(table._id)}
              />
            </div>
          </div>
        ))}
      </div>
      <button className="submit-button" onClick={handleSubmit}>Submit</button>

      {/* Modal */}
      {showModal && (
        <div className="dark-theme-modal">
          <p>Tables successfully assigned to waiter!</p>
        </div>
      )}
    </div>
  );
}

export default AssignTablesToWaiter;
