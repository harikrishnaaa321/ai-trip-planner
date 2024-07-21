import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

const PlaceCardItem = ({ place }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (place && place.place_name) {
      GetPlacePhoto();
    }
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.place_name,
    };
  
    try {
      const result = await GetPlaceDetails(data);
      console.log(result.data.places[0].photos[0]); // Debugging line
      const photoName = result?.data?.places[0]?.photos?.[0]?.name;
      if (photoName) {
        const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
        setPhotoUrl(PhotoUrl);
      } else {
        console.error("Photo not found");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  if (!place) {
    return <div>No place data available.</div>;
  }

  return (
    <Link to={`https://www.google.com/maps/search/?api=1&query=${place.place_name}`} target="_blank">
      <div className="border rounded-xl p-4 mt-2 flex gap-4 hover:scale-105 transition-transform duration-300 hover:shadow-lg cursor-pointer">
        <div className="w-1/3 h-[130px] flex-shrink-0">
          <img 
            src={photoUrl || '/aeroplane.jpg'} 
            alt={place.place_name} 
            className='w-full h-full object-cover rounded-xl' 
          />
        </div>
        <div className="flex-1">
          <h2 className='font-bold text-lg'>{place.place_name}</h2>
          <p className='text-sm text-gray-500'>{place.details}</p>
          <p className='mt-2'><strong>Ticket Pricing:</strong> {place.ticket_pricing}</p>
          <p><strong>Time to Spend:</strong> {place.time_to_spend}</p>
          <p><strong>Best Time to Visit:</strong> {place.best_time_to_visit}</p>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCardItem;
