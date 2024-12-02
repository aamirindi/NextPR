import React, { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const Navbar = ({ userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const handleNavigateToHome = () => {
    navigate("/home", { state: { userId } });
  };
  const handleNavigateToFitness = () => {
    navigate("/fitness", { state: { userId } });
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

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative z-10">
      {/* Navbar */}
      <div className="flex justify-between w-full p-3 navbar">
        <div
          className="menu-icon lg:hidden cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </div>
        <div className="lg:ml-auto text-black">logo</div>
      </div>

      {/* Sidebar */}
      <div>
        {/* For larger screens */}
        <div className="hidden lg:flex lg:text-center lg:justify-between p-3 fixed left-0 top-0 h-full w-fit bg-[#111214] text-center text-white flex-col">
          <div className="flex flex-col gap-4">
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/home")
                  ? "bg-[#8c81fa] text-black"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToHome}
            >
              <HomeOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/profile")
                  ? "bg-[#8c81fa] text-black"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToProfile}
            >
              <AccountCircleOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/fitness")
                  ? "bg-[#8c81fa] text-black"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToFitness}
            >
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
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/home")
                  ? "bg-[#8c81fa] text-black"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToHome}
            >
              <HomeOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/profile")
                  ? "bg-[#8c81fa] text-black"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToProfile}
            >
              <AccountCircleOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/fitness")
                  ? "bg-[#8c81fa] text-black"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToFitness}
            >
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
