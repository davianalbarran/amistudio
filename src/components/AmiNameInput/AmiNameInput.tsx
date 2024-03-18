import React from 'react';
import './AmiNameInput.css';

interface AmiNameInputProps {
  onNameChange: (name: string) => void;
}

const AmiNameInput: React.FC<AmiNameInputProps> = ({ onNameChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(event.target.value);
  };

  return (
    <div className="ami-name-input">
      <label htmlFor="amiName">What's your Ami's name?</label>
      <input type="text" id="amiName" onChange={handleChange} />
    </div>
  );
};

export default AmiNameInput;
