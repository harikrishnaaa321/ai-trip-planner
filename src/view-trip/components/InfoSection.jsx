import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";

const InfoSection = ({ trip }) => {
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
    <div className="space-y-4">
      <div className="relative w-full h-[340px]">
        <img
          src={photoUrl || "/aeroplane.jpg"} // Fallback image if photoUrl is not available
          alt="wallpaper"
          className="absolute inset-0 h-full w-full object-cover rounded"
        />
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between items-start">
        <div className="flex flex-col gap-2 w-full md:w-3/4">
          <h2 className="font-bold text-2xl">
            {trip.userSelection.location?.label || "Location not available"}
          </h2>
          <div className="flex flex-wrap gap-4">
            <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray text-xs md:text-md">
              📅 {trip.userSelection.noOfDays || "N/A"} Day
            </h2>
            <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray text-xs md:text-md">
              💰 {trip.userSelection.budget || "N/A"}
            </h2>
            <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray text-xs md:text-md">
              🍷 No of traveler {trip.userSelection.traveler || "N/A"}
            </h2>
          </div>
        </div>
        <Button className="w-full md:w-auto">
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
};

export default InfoSection;
