import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col items-center mx-56 gap-9 mt-16">
      <div className="text-center">
        <h1 className="font-extrabold text-[40px]">
          <span className="text-[#f56551]">
            Discover your next adventure with AI:
          </span>
          <br />
          <br />
          <p className="text-xl text-gray-500">
            Personalized itineraries at your Fingertips
          </p>
        </h1>
        <Link to={'/create-trip'}>
          <Button className="mt-6">Get Started, it's free</Button>
        </Link>
      </div>
      <img src="/landing.jpg" className="mt-8" alt="Landing" />
    </div>
  );
}

export default Hero;
