import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle button click
  const handleButtonClick = (path) => {
    navigate(`${path}?id=${id}`); // Append id as query parameter
  };

  return (
    <div>
      <div className="container">
        <div className="buttons-container" style={{ marginTop: '30px', width: '400px' }}>
          <button
            className="button"
            style={{ fontStyle: 'normal' }}
            onClick={() => handleButtonClick('/tablets')}
          >
            Tablets
          </button>
          <button
            className="button"
            style={{ fontStyle: 'normal' }}
            onClick={() => handleButtonClick('/watches')}
          >
            Watches
          </button>
          <button
            className="button"
            style={{ fontStyle: 'normal' }}
            onClick={() => handleButtonClick('/valet')}
          >
            Valet
          </button>
          <button
            className="button"
            style={{ fontStyle: 'normal' }}
            onClick={() => handleButtonClick('/Sequence')}
          >
            Sequences
          </button>
          <button
            className="button"
            style={{ fontStyle: 'normal' }}
            onClick={() => handleButtonClick('/AddButtons2')}
          >
            Add Buttons
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
