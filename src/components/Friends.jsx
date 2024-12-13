import React from "react";
import { auth, db } from "../firebase-config";
import Navbar from "./Navbar";

const Friends = () => {
  const userId = auth.currentUser?.uid;

  return (
    <div className=" min-h-screen text-white">
      <Navbar userId={userId} />
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <p className="text-2xl font-bold italic">Not available yet</p>
          <p className="text-lg text-gray-300 mt-2 ">
            This feature is coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Friends;
