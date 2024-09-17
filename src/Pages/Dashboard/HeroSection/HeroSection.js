import React from 'react';
import './HeroSection.css'; // Changed CSS file name
import HeroImage from './hero1.jpg';
import HeroTwoImage from './hero2.jpg';

export const HeroSection = () => {
  return (
    <div className="strange-hero-section"> {/* Changed class name */}
      <div className="odd-grid-container"> {/* Changed class name */}
        <div className="odd-grid-item image"> {/* Changed class name */}
          <img src={HeroImage} alt="Image 1" />
        </div>
        <div className="odd-grid-item text" style={{textAlign:'start'}}>
          <p>
            <span>Welcome to <strong>Waytrix</strong></span>
            <br />
            <span>Waytrix is dedicated to transforming the hospitality industry through the integration of innovative advertising and marketing strategies. Our primary objective is to enhance guest experiences and elevate service standards, establishing new benchmarks for excellence and innovation in the sector.</span>
          </p>
        </div>
        <div className="odd-grid-item text" style={{textAlign:'end'}}>
          <p>
            <span>We strive to revolutionize the way hotels and resorts engage with their guests, offering cutting-edge solutions that blend technology with personalized service. At Waytrix, we believe that every guest interaction is an opportunity to create a memorable experience, and we are committed to helping our clients exceed their guests' expectations. Join us in reimagining the future of hospitality.</span>
          </p>
        </div>
        <div className="odd-grid-item image"> {/* Changed class name */}
          <img src={HeroTwoImage} alt="Image 2" />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
