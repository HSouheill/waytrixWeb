import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditVoucher.css';
import { ipAddress } from '../../../config';

const EditVoucher = () => {
  const [partners, setPartners] = useState([]);
  const [partnerRestoAccounts, setPartnerRestoAccounts] = useState([]);
  const [editPartner, setEditPartner] = useState(null);
  const [editFields, setEditFields] = useState({ name: '', email: '', description: '',pointsCost: '',Quantity: '', restoIdArray: [] });

  useEffect(() => {
    fetchPartners();
    fetchPartnerRestoAccounts();
  }, []);

  const fetchPartners = async () => {
    const token = localStorage.getItem('waytrixToken');
    if (token) {
      try {
        const response = await axios.get(`${ipAddress}/api/ContactUsRoutes/GetAllVouchers2`, {
          headers: { Authorization: `${token}` },
        });
        setPartners(response.data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    }
  };

  const fetchPartnerRestoAccounts = async () => {
    try {
      const token = localStorage.getItem('waytrixToken');
      if (token) {
        const response = await axios.get(`${ipAddress}/api/PartnerAccountRoutes/partner_get_resto_account`, {
          headers: { Authorization: token },
        });
        setPartnerRestoAccounts(response.data.map((account) => ({ ...account, selected: false })));
      }
    } catch (error) {
      console.error('Error fetching restaurant accounts:', error);
    }
  };

  const handleDelete = async (partnerId) => {
    const token = localStorage.getItem('waytrixToken');
    try {
        await axios.post(`${ipAddress}/api/ContactUsRoutes/deleteVoucher`, 
            { voucherId: partnerId }, // Send partnerId as voucherId
            { headers: { Authorization: `${token}` } } // Include the token in headers
        );
        // Update the partners state to reflect the deletion
        setPartners(partners.filter((partner) => partner._id !== partnerId));
    } catch (error) {
        console.error('Error deactivating voucher:', error);
    }
};


  const handleEdit = (partner) => {
    setEditPartner(partner);
    setEditFields({
      name: partner.name,
      email: partner.email,
      description: partner.description,
      pointsCost: partner.pointsCost, // Corrected key
      Quantity: partner.Quantity,     // Corrected key
      restoIdArray: partner.restoIdArray,
    });
    setPartnerRestoAccounts((prevAccounts) =>
      prevAccounts.map((account) => ({
        ...account,
        selected: partner.restoIdArray.includes(account._id),
      }))
    );
  };

  const handleEditFieldChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (id) => {
    console.log(`Checkbox clicked for ID: ${id}`);
    setPartnerRestoAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account._id === id ? { ...account, selected: !account.selected } : account
      )
    );
  };
  

  const handleEditSubmit = async () => {
    const selectedRestoIds = partnerRestoAccounts.filter((account) => account.selected).map((account) => account._id);
    const updatedPartner = { ...editFields, restoIdArray: selectedRestoIds };

    try {
      const token = localStorage.getItem('waytrixToken');
      if (token) {
        await axios.post(`${ipAddress}/api/ContactUsRoutes/editVoucher2`, { voucherId: editPartner._id, ...updatedPartner }, {
          headers: { Authorization: token },
        });
        setEditPartner(null);
        fetchPartners(); // Refresh partner list
      }
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  };

  useEffect(() => {
    console.log("Fetched partnerRestoAccounts:", partnerRestoAccounts);
  }, [partnerRestoAccounts]);
  
  return (
    <div className="partner-container">
      {partners.map((partner) => (
        <div key={partner._id} className="partner-card">
          <div className="partner-header">
            <img src={partner.image} alt="Partner Logo" className="partner-logo" />
            <h3 className="partner-name">{partner.name}</h3>
          </div>
          <div className="partner-body">
            <p className="partner-phone">Email: {partner.email}</p>
            <p className="partner-description">Description: {partner.description}</p>
            <p className="partner-points">Cost: {partner.pointsCost}</p>
            <p className="partner-quantity">Qty: {partner.Quantity}</p>
          </div>
          <button 
            onClick={() => handleEdit(partner)} 
            className="edit-button" 
            style={{ marginRight: '8px', padding: '10px 15px' }}
            >
            Edit
          </button>

          <button onClick={() => handleDelete(partner._id)} className="delete-button">Delete</button>
        </div>
      ))}
      {editPartner && (
        <div className="edit-modal">
          <h3>Edit Partner: {editPartner.name}</h3>
          <div className="form-group">
            <label htmlFor="editName">Name</label>
            <input
              type="text"
              id="editName"
              value={editFields.name}
              onChange={(e) => handleEditFieldChange('name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editPhone">Email</label>
            <input
              type="text"
              id="editPhone"
              value={editFields.email}
              onChange={(e) => handleEditFieldChange('email', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editDescription">Description</label>
            <textarea
              id="editDescription"
              value={editFields.description}
              onChange={(e) => handleEditFieldChange('description', e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="editPhone">Cost</label>
            <input
              type="number"
              id="editCost"
              value={editFields.pointsCost}
              onChange={(e) => handleEditFieldChange('pointsCost', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editPhone">Quantity</label>
            <input
              type="number"
              id="editQuantity"
              value={editFields.Quantity}
              onChange={(e) => handleEditFieldChange('Quantity', e.target.value)}
            />
          </div>
          <div className="grid-container-checkt">
                {partnerRestoAccounts.map((account) => (
                    <div key={account._id} className="card-checkt">
                    <label className="checkbox-container-checkt">
                        <input
                        type="checkbox"
                        checked={account.selected}
                        onChange={() => handleCheckboxChange(account._id)}
                        />
                        <span className="custom-checkmark"></span>
                        {account.name}
                    </label>
                    </div>
                ))}
          </div>



          <button onClick={handleEditSubmit} className="submit-button">Save Changes</button>
          <button onClick={() => setEditPartner(null)} className="cancel-button">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default EditVoucher;
