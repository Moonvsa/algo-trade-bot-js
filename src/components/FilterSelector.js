import React from 'react';

const FilterSelector = ({ filters, setFilters }) => {
  const handleChange = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h3>Выберите активные фильтры:</h3>
      {Object.keys(filters).map(key => (
        <label key={key}>
          <input
            type="checkbox"
            checked={filters[key]}
            onChange={() => handleChange(key)}
          />
          {key}
        </label>
      ))}
    </div>
  );
};

export default FilterSelector;