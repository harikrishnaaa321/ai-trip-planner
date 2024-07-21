import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "@/constants/options";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { FaGoogle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate, useNavigation } from "react-router-dom";

const CreateTrip = () => {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [tripData, setTripData] = useState(null);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    if (name === "noOfDays" && value > 7) {
      console.log("Please enter trip days less than 7");
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      GetUserProfile(tokenResponse);
    },
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (
      (formData?.noOfDays > 7 && !formData?.location) ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast.error("Please fill all details");
      return;
    }

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location?.label)
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    console.log(FINAL_PROMPT);
    setLoading(true);
    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result.response.text();
      console.log(responseText);
      setTripData(responseText);
      await SaveAiTrip(responseText);
    } catch (error) {
      console.error("Error generating trip:", error);
    }
    setLoading(false);
  };

  const SaveAiTrip = async (tripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    try {
      await setDoc(doc(db, "AiTrips", docId), {
        userSelection: formData,
        tripData:JSON.parse(tripData),
        userEmail: user?.email,
        id: docId,
      });
    } catch (error) {
      console.error("Error saving trip:", error);
    }
    setLoading(false);
    navigate('/view-trip/'+docId)
  };

  const GetUserProfile = (tokenInfo) => {
    const accessToken = tokenInfo.access_token;
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      })
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        OnGenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preference</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip preference⛵
      </p>
      <div className="mt-20 flex-col gap-9">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice? 🏝️
          </h2>

          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning in your trip 🍁
          </h2>
          <Input
            placeholder={"Ex.3"}
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          ></Input>
        </div>
      </div>
      <div>
        <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow${
                formData?.budget === item.title ? " shadow-lg border-black" : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">
          Who do you plan on travelling with on your adventure{" "}
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveler", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow${
                formData?.traveler === item.people ? " shadow-lg border-black" : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10 justify-end flex">
        <Button onClick={OnGenerateTrip}>
          {loading ? <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" /> : 'Generate Trip'}
        </Button>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <img src="/Designer.png" alt="logo" />
              <h2 className="font-bold text-lg mt-7">Sign in with Google</h2>
              <div>Sign in to the app with Google authentication securely</div>
              <Button className="w-full mt-5 flex gap-4 items-center" onClick={login}>
                <FaGoogle className="h-7 w-7" />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
