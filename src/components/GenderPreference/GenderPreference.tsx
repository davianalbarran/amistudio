import React from 'react';

interface GenderPreferenceProps {
  onPreferenceChange: (preference: string) => void;
}

const GenderPreference: React.FC<GenderPreferenceProps> = ({ onPreferenceChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onPreferenceChange(event.target.value);
  };

  return (
    <div className="gender-preference">
      <label htmlFor="genderPreference">Gender Preference:</label>
      <select id="genderPreference" onChange={handleChange}>
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="non-binary">Non-binary</option>
      </select>
    </div>
  );
};

export default GenderPreference;
