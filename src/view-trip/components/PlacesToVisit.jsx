import React from "react";
import PlaceCardItem from "./PlaceCardItem";

const PlacesToVisit = ({ trip }) => {
  if (!trip || !trip.tripData || !trip.tripData.itinerary) {
    return <div>No itinerary data available.</div>;
  }

  return (
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>
      <div>
        {Object.keys(trip.tripData.itinerary).map((dayKey, index) => {
          const day = trip.tripData.itinerary[dayKey];
          return (
            <div key={index} className='mt-5'>
              <h2 className='font-medium text-lg'>{dayKey}</h2>
              <div className='grid md:grid-cols-2 gap-5'>
                {Object.keys(day).map((timeOfDay, timeIndex) => (
                  <PlaceCardItem key={timeIndex} place={day[timeOfDay]} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlacesToVisit;
