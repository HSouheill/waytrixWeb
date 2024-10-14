import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../Dashboard/NavResto/Tablets.module.css';
import { Link } from 'react-router-dom';
import { ipAddress } from '../../../config';

const ViewTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const restoId = localStorage.getItem('restoId'); // Retrieve restoId from localStorage
        const restoToken = localStorage.getItem('restoToken'); // Retrieve restoToken from localStorage

        if (restoId) {
          const response = await axios.post(`${ipAddress}/api/Auth/getTablesByRestoId`, { restoId }, {
            headers: {
              Authorization: `${restoToken}`, // Pass restoToken in headers if necessary
            },
          });

          if (response.data) {
            setTables(response.data);
          } else {
            setTables([]);
          }
        } else {
          setError('Restaurant ID not found');
        }
      } catch (err) {
        setError('No tables found');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const deleteTable = async (tableId) => {
    try {
      const response = await axios.delete(`${ipAddress}/api/Auth/delete-table`, { data: { tableId } });
      if (response.status === 200) {
        setTables(tables.filter((table) => table._id !== tableId));
      } else {
        setError('Error deleting table');
      }
    } catch (err) {
      setError('Error deleting table');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${ipAddress}/api/Auth/update_table`, {
        tableId: editingTable,
        ...formData,
      });
      if (response.status === 200) {
        const updatedTable = response.data.updatedTable;
        setTables(tables.map((table) => (table._id === updatedTable._id ? updatedTable : table)));
        setEditingTable(null);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        setError('Error updating table');
      }
    } catch (err) {
      setError('Error updating table');
    }
  };

  const startEditing = (table) => {
    setEditingTable(table._id);
    setFormData({ name: table.name, email: table.email, phone: table.phone });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Tablets Section</h1>
      {error && <p>{error}</p>}

      {editingTable ? (
        <form onSubmit={handleSubmit}>
          <h2>Edit Table</h2>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </label>
          <button type="submit" className={styles.button}>Save</button>
          <button type="button" className={styles.button} onClick={() => setEditingTable(null)}>Cancel</button>
        </form>
      ) : (
        <table className={styles.excelTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>IP</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table._id}>
                <td>{table._id}</td>
                <td>{table.name}</td>
                <td>{table.email}</td>
                <td>{table.phone}</td>
                <td>{table.ip}</td>
                <td>{table.password}</td>
                <td>
                  <button className={styles.button} onClick={() => startEditing(table)}>Edit</button>
                  <button className={styles.button} onClick={() => deleteTable(table._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.addRestoButtonContainer}>
        <Link className={styles.link} to={`/AddTablet2?restoId=${localStorage.getItem('restoId')}`}>Add Tablet</Link>
      </div>
    </div>
  );
};

export default ViewTables;
