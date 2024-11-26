import React, { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";

const Navbar = ({ userId }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNavigateToProfile = () => {
    navigate("/profile", { state: { userId } });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

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
        <div className="hidden lg:flex lg:text-center lg:justify-between p-3 fixed left-0 top-0 h-full w-fit bg-[#111214] text-center text-white flex-col">
          <div className="flex flex-col gap-4">
            <div
              className="cursor-pointer p-2 rounded-md hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
              onClick={handleNavigateToProfile} // Navigate to profile
            >
              <AccountCircleOutlinedIcon />
            </div>
            <div className="cursor-pointer p-2 rounded-md hover:bg-white hover:text-black transition-all duration-300 ease-in-out">
              <FitnessCenterIcon />
            </div>
          </div>
          <div
            onClick={handleSignOut}
            className="cursor-pointer p-2 rounded-md hover:bg-white hover:text-red-500 transition-all duration-300 ease-in-out"
          >
            <ExitToAppOutlinedIcon />
          </div>
        </div>

        {/* For smaller screens */}
        <div
          ref={sidebarRef}
          className={`lg:hidden fixed top-0 left-0 h-full w-fit bg-[#111214] flex flex-col justify-between text-white p-4 transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div
              className="cursor-pointer p-2 rounded-md hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
              onClick={handleNavigateToProfile} // Navigate to profile
            >
              <AccountCircleOutlinedIcon />
            </div>
            <div className="cursor-pointer p-2 rounded-md hover:bg-white hover:text-black transition-all duration-300 ease-in-out">
              <FitnessCenterIcon />
            </div>
          </div>
          <div
            onClick={handleSignOut}
            className="cursor-pointer p-2 rounded-md hover:bg-white hover:text-red-500 transition-all duration-300 ease-in-out"
          >
            <ExitToAppOutlinedIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
