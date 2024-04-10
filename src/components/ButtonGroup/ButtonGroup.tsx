import React from 'react';
import './ButtonGroup.css';

interface ButtonGroupProps {
  onShowdowns: () => void;
  onSettings: () => void;
  onAction: (action: string) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ onShowdowns, onSettings, onAction }) => {
  const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onAction(event.target.value);
  };

  return (
    <div className="button-group">
      <button onClick={onShowdowns}>Showdowns</button>
      <button onClick={onSettings}>Settings</button>
      <select onChange={handleActionChange}>
        <option value="">Select an action</option>
        <option value="Go to gym">Go to gym</option>
        <option value="Read book">Read a book</option>
        <option value="Go for a run">Go for a run</option>
      </select>
    </div>
  );
};

export default ButtonGroup;
