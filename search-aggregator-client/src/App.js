import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import HotelList from './HotelList';
import axios from 'axios';
import './App.css';

const App = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:3001/subscribe?id=${encodeURIComponent('123')}`);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        console.log('Data received from server:', parsedData);
        if (Array.isArray(parsedData)) {
          // const flattenedData = parsedData.flatMap(provider => provider.data);
          setResults(parsedData);
        } else {
          console.error('Invalid data format received:', parsedData);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await axios.get(`http://localhost:3001/search?searchTerm=${encodeURIComponent(JSON.stringify(searchTerm))}`);
      console.log('Search results:', response.data);

      if (response.data?.length > 0 && Array.isArray(response.data) && !(response.message === 'Search initiated')) {
        setResults(response.data);
      } else {
        console.error('Invalid search results format:', response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
    <div className="search-bar-container">
      <SearchBar onSubmit={handleSearch} />
    </div>
    <div className="results-container">
      <HotelList hotels={results} />
    </div>
  </div>
  );
};

export default App;
