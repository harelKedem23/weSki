import React from 'react';
import starIcon from './star.svg'; // Adjust the path to match your project structure
import locationIcon from './location.svg'; // Adjust the path to match your project structure

const HotelList = ({ hotels }) => {
  const renderStars = (rating) => {
    const stars = [];
    const numStars = parseInt(rating); // Convert rating to integer
    for (let i = 0; i < numStars; i++) {
      stars.push(<img key={i} src={starIcon} alt="Star" className="star-icon" />);
    }
    return stars;
  };

  return (
    <div className="hotel-list">
      {hotels && hotels.length > 0 ? (
        hotels.map((hotel, index) => (
          <div key={index} className="hotel-card">
            <div className="hotel-image">
              <img src={hotel?.HotelDescriptiveContent?.Images[0].URL} alt={hotel?.HotelName} />
            </div>
            <div className="hotel-details">
              <h2>{hotel?.HotelName}</h2>
              <div className="rating">
                <span className="stars">{renderStars(hotel?.HotelInfo?.Rating)}</span>
              </div>
              <div className="location">
                <img src={locationIcon} alt="Location Icon" className="location-icon" />
                {hotel?.HotelInfo?.Position?.Distances.map((distance, index) => (
                  <span key={index}>{distance.distance} to {distance.type}</span>
                ))}
              </div>
              <p className="price">Price per person: ${hotel?.PricesInfo?.AmountAfterTax}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default HotelList;
