import React from 'react';
import './AmiDisplay.css';

interface AmiDisplayProps {
  amiData: {
    name: string;
    // Add other Ami data properties
  };
}

const AmiDisplay: React.FC<AmiDisplayProps> = ({ amiData }) => {
  return (
    <div className="ami-display">
      <h3>{amiData.name}</h3>
      {/* Display other Ami data */}
      <p>Ami details go here...</p>
    </div>
  );
};

export default AmiDisplay;
