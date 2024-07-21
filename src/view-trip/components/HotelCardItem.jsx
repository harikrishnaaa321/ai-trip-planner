import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";

const HotelCardItem = ({ hotel }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (hotel?.hotel_name) {
      GetPlacePhoto();
    }
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel.hotel_name,
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

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link
        to={
          "https://www.google.com/maps/search/?api=1&query=" +
          hotel.hotel_name +
          "," +
          hotel?.hotel_address
        }
        target="_blank"
      >
        <div className="hover:scale-105 transition-all cursor-pointer">
          <img
            src={photoUrl || "/aeroplane.jpg"} // Fallback image if photoUrl is not available
            alt={hotel.hotel_name}
            className="rounded-xl h-[180px] w-full object-cover"
          />
          <div className="my-2 flex flex-col gap-2">
            <h2 className="font-medium">{hotel.hotel_name}</h2>
            <h2 className="text-xs text-gray-500">📍{hotel.address}</h2>
            <h2 className="text-sm">💰{hotel.price}</h2>
            <h2 className="text-sm">⭐{hotel.rating}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HotelCardItem;
