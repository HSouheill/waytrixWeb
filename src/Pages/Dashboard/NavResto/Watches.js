import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Tablets.module.css';
import { Link } from 'react-router-dom';
import { ipAddress } from '../../../config';

const Watches = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');
  const [waiters, setWaiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingWaiter, setEditingWaiter] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // Fetch waiters from the API
  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const response = await axios.post(`${ipAddress}/api/Auth/waiters`, { restoId: id });
        if (response.data) {
          setWaiters(response.data);
        } else {
          setWaiters([]);
        }
      } catch (err) {
        setError('No waiters found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWaiters();
    }
  }, [id]);

  // Function to delete a waiter
  const deleteWaiter = async (waiterId) => {
    try {
      const response = await axios.delete(`${ipAddress}/api/Auth/delete-waiter`, { data: { waiterId } });
      if (response.status === 200) {
        setWaiters(waiters.filter((waiter) => waiter._id !== waiterId));
      } else {
        setError('Error deleting waiter');
      }
    } catch (err) {
      setError('Error deleting waiter');
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
      const response = await axios.post(`${ipAddress}/api/Auth/updateWaiter`, {
        waiterId: editingWaiter,
        ...formData,
      });
      if (response.status === 200) {
        const updatedWaiter = response.data.updatedWaiter;
        setWaiters(waiters.map((waiter) => (waiter._id === updatedWaiter._id ? updatedWaiter : waiter)));
        setEditingWaiter(null);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        setError('Error updating waiter');
      }
    } catch (err) {
      setError('Error updating waiter');
    }
  };

  // Function to start editing
  const startEditing = (waiter) => {
    setEditingWaiter(waiter._id);
    setFormData({ name: waiter.name, email: waiter.email, phone: waiter.phone });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Waiters Section</h1>
      {error && <p>{error}</p>}

      {editingWaiter ? (
        <form onSubmit={handleSubmit}>
          <h2>Edit Waiter</h2>
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
          <button type="button" className={styles.button} onClick={() => setEditingWaiter(null)}>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {waiters.map((waiter) => (
              <tr key={waiter._id}>
                <td>{waiter._id}</td>
                <td>{waiter.name}</td>
                <td>{waiter.email}</td>
                <td>{waiter.phone}</td>
                <td>
                  <button
                    className={styles.button}
                    style={{ marginRight: '10px' }}
                    onClick={() => startEditing(waiter)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => deleteWaiter(waiter._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Waiter Button should always be visible */}
      <div className={styles.addRestoButtonContainer}>
        <Link className={styles.link} to={`/AddWatch?restoId=${id}`}>
          Add Watch
        </Link>
      </div>
    </div>
  );
};

export default Watches;
