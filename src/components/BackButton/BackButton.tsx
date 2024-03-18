import React from 'react';
import './BackButton.css';

export interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return <button className="back-button" onClick={onClick}>Back</button>;
};

export default BackButton;
