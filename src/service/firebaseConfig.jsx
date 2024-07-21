// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmfyBilzHTrHFLz_pvwOgc68e8aWZ2yEc",
  authDomain: "travel-assist-dd637.firebaseapp.com",
  projectId: "travel-assist-dd637",
  storageBucket: "travel-assist-dd637.appspot.com",
  messagingSenderId: "358776925389",
  appId: "1:358776925389:web:69a8879294f99f679b8d84"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)