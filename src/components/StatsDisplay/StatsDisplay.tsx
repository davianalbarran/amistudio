import React from 'react';
import './StatsDisplay.css';

interface StatsDisplayProps {
  stats: {
    str: number;
    end: number;
    int: number;
  };
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className="stats-display">
      <h4>Stats</h4>
      <p>Strength: {stats.str}</p>
      <p>Endurance: {stats.end}</p>
      <p>Intelligence: {stats.int}</p>
    </div>
  );
};

export default StatsDisplay;
