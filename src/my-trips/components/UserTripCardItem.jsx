import React from 'react'
import { useState,useEffect } from 'react';
import { GetPlaceDetails,PHOTO_REF_URL } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';
const UserTripCardItem = ({trip}) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip.userSelection.location.label,
    };

    try {
      const result = await GetPlaceDetails(data);
      const photoName = result?.data?.places[0]?.photos?.[3]?.name;
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

  if (!trip || !trip.userSelection) {
    return <div>Loading...</div>;
  }
  return (
    <Link to={'/view-trip/'+trip.id}>
   <div className='hover:scale-105 transition-all'>
  <img
    src={photoUrl || '/aeroplane.jpg'}
    alt=""
    className='object-cover rounded-xl w-full h-[220px] max-w-full'
  />
  <div>
    <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
    <h2 className='text-sm text-gray-500'>
      {trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} budget
    </h2>
  </div>
</div>

      
    
    </Link>
  )
}

export default UserTripCardItem
