import React, { useState, useEffect } from "react";
import { useNavigation } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import UserTripCardItem from "./components/UserTripCardItem";
import { db } from "@/service/firebaseConfig"; 

function MyTrips() {
  const navigation = useNavigation();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log("user1", user);
 
    if (!user) {
      navigation("/");
      return;
    }

    const q = query(
      collection(db, "AiTrips"),
      where("userEmail", "==", user?.email)
    );


    const querySnapShot = await getDocs(q);
    const trips = [];
    querySnapShot.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      trips.push(doc.data());
    });

    setUserTrips(trips);
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 font-bold">
      <h2>My Trips</h2>
      <br/>
      <br/>
      <hr />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {userTrips.length > 0 ? (
          userTrips.map((trip, index) => (
            <UserTripCardItem key={index} trip={trip} className="object-cover rounded-xl" />
          ))
        ) : (
          [1,2,3,4,5,6].map((item,index)=>(
            <div key={index} className="h-[300px] w-full bg-slate-200 animate-pulse rounded-xl"></div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTrips;
