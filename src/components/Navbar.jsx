import React, { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

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
          className="menu-icon lg:hidden cursor-pointer nav-icon flex flex-col justify-center"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <div className="w-6 h-0.5 bg-zinc-300 mb-1"></div>
          <div className="w-6 h-0.5 bg-zinc-300 mb-1"></div>
          <div className="w-6 h-0.5 bg-zinc-300"></div>
        </div>
        <div className="lg:ml-auto text-black">
          {/* <img src="/assets/logo.png" alt="logo" width={40} height={40} />
           */}
          <h2 className="logo text-xl text-zinc-300 mr-2">NextPR</h2>
        </div>
      </div>

      {/* Sidebar */}
      <div>
        {/* For larger screens */}
        <div className="hidden lg:flex lg:text-center lg:justify-between p-3 fixed left-0 top-0 h-full w-fit bg-[#111214] text-center text-white flex-col">
          <div className="flex flex-col gap-4">
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/home")
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToHome}
            >
              <HomeOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/profile")
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToProfile}
            >
              <AccountCircleOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/fitness")
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToFitness}
            >
              <FitnessCenterIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/history")
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={() => navigate("/history", { state: { userId } })}
            >
              <HistoryOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/friends")
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={() => navigate("/friends", { state: { userId } })}
            >
              <PersonAddAltOutlinedIcon />
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
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToHome}
            >
              <HomeOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/profile")
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToProfile}
            >
              <AccountCircleOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/fitness")
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={handleNavigateToFitness}
            >
              <FitnessCenterIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/history")
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={() => navigate("/history", { state: { userId } })}
            >
              <HistoryOutlinedIcon />
            </div>
            <div
              className={`cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out ${
                isActive("/friends")
                  ? "bg-[#474848] text-white"
                  : "hover:bg-white hover:text-black"
              }`}
              onClick={() => navigate("/friends", { state: { userId } })}
            >
              <PersonAddAltOutlinedIcon />
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
