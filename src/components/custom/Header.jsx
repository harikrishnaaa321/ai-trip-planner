import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function Header() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (user) {
    //  console .log("user", user);
    }
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      GetUserProfile(tokenResponse);
    },
    onError: (error) => console.log(error),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const { access_token } = tokenInfo;
      const resp = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      });
      setUser(resp.data);
      localStorage.setItem("user", JSON.stringify(resp.data));
      setOpenDialog(false);
      // Optional: Update state/context instead of reloading
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user");
    setUser(null);
    // Optional: Update state/context instead of reloading
  };

  return (
    <header className="p-4 shadow-md flex justify-between items-center px-6 bg-white border-b border-gray-200">
      <a href="/"><img src="/travel.png" className="w-14 h-14 rounded-full" alt="logo" /></a>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <a href='/create-trip'>
              <Button variant="outline" className="rounded-full px-4 py-2 border-gray-400 hover:border-gray-600 text-gray-700 hover:text-gray-900 transition">
                Create Trip
              </Button>
            </a>
            <a href='/my-trips'>
              <Button variant="outline" className="rounded-full px-4 py-2 border-gray-400 hover:border-gray-600 text-gray-700 hover:text-gray-900 transition">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user.picture}
                  className="h-12 w-12 rounded-full border border-gray-300 shadow-md"
                  alt="profile"
                />
              </PopoverTrigger>
              <PopoverContent className="p-4 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Log out
                </button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button 
            onClick={() => setOpenDialog(true)}
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6 py-2 transition"
          >
            Get Started
          </Button>
        )}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Sign in with Google</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              <img src="/travel.png" alt="logo" className="w-16 mx-auto" /> {/* Adjusted size */}
              <h2 className="font-bold text-lg mt-5">Sign in with Google</h2>
              <p className="mt-2">Sign in to the app with Google authentication securely.</p>
              <Button 
                className="w-full mt-5 flex gap-3 items-center bg-blue-500 text-white hover:bg-blue-600 rounded-full px-4 py-2 transition"
                onClick={login}
              >
                <FaGoogle className="h-5 w-5" />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;
