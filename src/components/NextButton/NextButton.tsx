import React from 'react';
import './NextButton.css';

interface NextButtonProps {
  onClick: () => void;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick }) => {
  return <button className="next-button" onClick={onClick}>Next</button>;
};

export default NextButton;
