import React from 'react';
import './OptionSelector.css';

interface OptionSelectorProps {
  options: string[];
  onOptionSelect: (option: number) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, onOptionSelect }) => {
  const handleOptionClick = (option: number) => {
    onOptionSelect(option);
  };

  return (
    <div>
      <h3 className="option-selector">Select a sprite:</h3>
      {options.map((option, index) => (
        <button key={index} className="option-selector" onClick={() => handleOptionClick(index + 1)}>
          <img src={`/path/to/assets/${option}`} alt={`Option ${index + 1}`} />
        </button>
      ))}
    </div>
  );
};

export default OptionSelector;
