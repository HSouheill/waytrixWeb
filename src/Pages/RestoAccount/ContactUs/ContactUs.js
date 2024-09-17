import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ContactUs.css';

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const restoId = localStorage.getItem('restoId');
        const restoToken = localStorage.getItem('restoToken');
        
        const response = await axios.post(
          'https://waytrixback.onrender.com/api/ContactUsRoutes/GetContactUs',
          { restoId: restoId },
          { headers: { Authorization: `${restoToken}` } }
        );
  
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
  
    fetchContacts();
  }, []);
  

  return (
    <div className="contact-us-container">
      {contacts.map(contact => (
        <div key={contact._id} className="contact-card">
          <h2>{contact.Name}</h2>
          <p>Phone: {contact.Phone}</p>
          <p>{contact.Text}</p>
        </div>
      ))}
    </div>
  );
};

export default ContactUs;
