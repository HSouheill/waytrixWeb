import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Tablets.module.css';

const Valet = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id');
  const [valets, setValets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingValet, setEditingValet] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // Fetch valets from the API
  useEffect(() => {
    const fetchValets = async () => {
      try {
        const response = await axios.get(`https://waytrixback.onrender.com/api/Auth/valet-accounts?restoId=${id}`);
        if (response.data) {
          setValets(response.data);
        } else {
          setValets([]);
        }
      } catch (err) {
        setError('No valets found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchValets();
    }
  }, [id]);

  // Function to delete a valet
  const deleteValet = async (valetId) => {
    try {
      const response = await axios.delete('https://waytrixback.onrender.com/api/Auth/delete-valet', { data: { valetId } });
      if (response.status === 200) {
        setValets(valets.filter((valet) => valet._id !== valetId));
      } else {
        setError('Error deleting valet');
      }
    } catch (err) {
      setError('Error deleting valet');
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
      const response = await axios.post('https://waytrixback.onrender.com/api/Auth/update_valet', {
        valetId: editingValet,
        ...formData,
      });
      if (response.status === 200) {
        const updatedValet = response.data.updatedValet;
        setValets(valets.map((valet) => (valet._id === updatedValet._id ? updatedValet : valet)));
        setEditingValet(null);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        setError('Error updating valet');
      }
    } catch (err) {
      setError('Error updating valet');
    }
  };

  // Function to start editing
  const startEditing = (valet) => {
    setEditingValet(valet._id);
    setFormData({ name: valet.name, email: valet.email, phone: valet.phone });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Valets Section</h1>
      {error && <p>{error}</p>}

      {editingValet ? (
        <form onSubmit={handleSubmit}>
          <h2>Edit Valet</h2>
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
          <button type="button" className={styles.button} onClick={() => setEditingValet(null)}>
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
            {valets.map((valet) => (
              <tr key={valet._id}>
                <td>{valet._id}</td>
                <td>{valet.name}</td>
                <td>{valet.email}</td>
                <td>{valet.phone}</td>
                <td>
                  <button
                    className={styles.button}
                    style={{ marginRight: '10px' }}
                    onClick={() => startEditing(valet)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => deleteValet(valet._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Valet Button should always be visible */}
      <div className={styles.addRestoButtonContainer}>
        <Link className={styles.link} to={`/AddValet?restoId=${id}`}>
          Add Valet
        </Link>
      </div>
    </div>
  );
};

export default Valet;
