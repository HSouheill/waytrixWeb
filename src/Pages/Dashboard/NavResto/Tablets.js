import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Tablets.module.css';
import { Link } from 'react-router-dom';

const Tablets = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // Fetch tables from the API
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.post('https://waytrixback.onrender.com/api/Auth/getTablesByRestoId', { restoId: id });
        if (response.data) {
          setTables(response.data);
        } else {
          setTables([]);
        }
      } catch (err) {
        setError('No tablets found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTables();
    }
  }, [id]);

  // Function to delete a table
  const deleteTable = async (tableId) => {
    try {
      const response = await axios.delete('https://waytrixback.onrender.com/api/Auth/delete-table', { data: { tableId } });
      if (response.status === 200) {
        setTables(tables.filter((table) => table._id !== tableId));
      } else {
        setError('Error deleting table');
      }
    } catch (err) {
      setError('Error deleting table');
    }
  };

  // Function to handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://waytrixback.onrender.com/api/Auth/update_table', {
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

  // Function to start editing
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
          <button type="submit" className={styles.button}>
            Save
          </button>
          <button type="button" className={styles.button} onClick={() => setEditingTable(null)}>
            Cancel
          </button>
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
                  <button
                    className={styles.button}
                    style={{ marginRight: '10px' }}
                    onClick={() => startEditing(table)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => deleteTable(table._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Tablet Button should always be visible */}
      <div className={styles.addRestoButtonContainer}>
        <Link className={styles.link} to={`/AddTablet?restoId=${id}`}>
          Add Tablet
        </Link>
      </div>
    </div>
  );
};

export default Tablets;
