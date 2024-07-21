// GlobalApi.js
import axios from 'axios';

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': 'places.photos,places.displayName,places.id'
  }
};

export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config);

export const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=" + API_KEY;
