import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col items-center justify-between px-6 md:flex-row">
        <div className="flex items-center mb-4 md:mb-0">
          <img src="/Designer.png" alt="Logo" className="h-12 w-auto mr-3" />
          <h2 className="text-lg font-bold">AI Travel Planner</h2>
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm">Created by Harikrishna</p>
          <a 
            href="mailto:harikrishnaaa64@gmail.com"
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
          >
            harikrishnaaa64@gmail.com
          </a>
        </div>
      </div>
      <div className="mt-4 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} AI Travel Planner. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
