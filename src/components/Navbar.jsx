import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";

const Navbar = ({ userId }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="navbar bg-[#d5d5d5] flex justify-between shadow-md w-full p-3">
        <div
          className="menu-icon lg:hidden cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </div>
        <div className="logo lg:ml-auto">logo</div>
      </div>

      {/* Sidebar */}
      <div>
        {/* For larger screens */}
        <div className="hidden lg:flex lg:text-center lg:justify-between p-3 fixed left-0 top-0 h-full w-40 bg-[#111214] text-center text-white flex-col">
          <div>
            <p className="mb-4">Workout Log</p>
            <p>Profile</p>
          </div>
          <button
            onClick={handleSignOut}
            className="btn p-2 rounded-lg transition-transform transform hover:scale-105 hover:bg-[#a18483b6] hover:text-white"
          >
            Sign Out
          </button>
        </div>

        {/* For smaller screens */}
        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-40 bg-[#111214] flex  flex-col justify-between text-white p-4 transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <p className="mb-4">Workout Log</p>
            <p>Profile</p>
          </div>
          <button
            onClick={handleSignOut}
            className="btn p-2 rounded-lg transition-transform transform hover:scale-105 hover:bg-[#a18483b6] hover:text-white"
          >
            Sign Out
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-2 right-2 text-white"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
