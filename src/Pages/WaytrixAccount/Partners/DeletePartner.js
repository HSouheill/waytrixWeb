import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeletePartner.css';
import { ipAddress } from '../../../config';

const DeletePartner = () => {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('waytrixToken');
        if (token) {
            axios.get(`${ipAddress}/api/ContactUsRoutes/GetAllPartners`, {
                headers: {
                    Authorization: `${token}`
                }
            })
            .then(response => {
                setPartners(response.data);
            })
            .catch(error => {
                console.error('Error fetching partners:', error);
            });
        }
    }, []);
    

    const handleDelete = (partnerId) => {
        const token = localStorage.getItem('waytrixToken');
        axios.delete(`${ipAddress}/api/ContactUsRoutes/DeletePartner`, {
            headers: {
                Authorization: `${token}`
            },
            data: { _id: partnerId }
        })
        .then(() => {
            setPartners(partners.filter(partner => partner._id !== partnerId));
        })
        .catch(error => {
            console.error('Error deleting partner:', error);
        });
    };
    

    return (
        <div className="partner-container">
            {partners.map(partner => (
                <div key={partner._id} className="partner-card">
                    <div className="partner-header">
                        <img src={partner.logo} alt="Partner Logo" className="partner-logo" />
                        <h3 className="partner-name">{partner.name}</h3>
                    </div>
                    <div className="partner-body">
                        <p className="partner-phone">Phone: {partner.phone}</p>
                        <p className="partner-description">{partner.description}</p>
                    </div>
                    <button onClick={() => handleDelete(partner._id)} className="delete-button">Delete</button>
                </div>
            ))}
        </div>
    );
};

export default DeletePartner;
