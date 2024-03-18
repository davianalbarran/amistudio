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
        <option value="action1">Action 1</option>
        <option value="action2">Action 2</option>
        <option value="action3">Action 3</option>
      </select>
    </div>
  );
};

export default ButtonGroup;
