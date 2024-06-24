import React, { useState } from 'react';

const destinations = [
  { id: 1, name: 'Val Thorens' },
  { id: 2, name: 'Courchevel' },
  { id: 3, name: 'Tignes' },
  { id: 4, name: 'La Plagne' },
  { id: 5, name: 'Chamonix' }
];

const SearchBar = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !groupSize || !dateRange.startDate || !dateRange.endDate) {
      alert('Please fill in all fields');
      return;
    }
    const searchData = {
      ski_site: destination,
      group_size: parseInt(groupSize),
      from_date: dateRange.startDate,
      to_date: dateRange.endDate,
      id: '123'
    };
    onSubmit(searchData);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <label className="search-label">
          Destination:
          <select
            className="search-select"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          >
            <option value="">Select a destination</option>
            {destinations.map(dest => (
              <option key={dest.id} value={dest.id}>{dest.name}</option>
            ))}
          </select>
        </label>
        <label className="search-label">
          Group Size (1-10):
          <input
            className="search-input"
            type="number"
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
            min="1"
            max="10"
            required
          />
        </label>
        <label className="search-label">
          Dates:
          <input
            className="search-input"
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            required
          />
          &nbsp;-&nbsp;
          <input
            className="search-input"
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            required
          />
        </label>
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
