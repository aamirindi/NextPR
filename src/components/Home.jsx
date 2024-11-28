import React from "react";
import WorkoutLog from "./WorkoutLog";
import Navbar from "./Navbar";
import { auth } from "../firebase-config";

const Home = () => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-red-500">
      <Navbar userId={userId} />
      {/* <WorkoutLog userId={userId} /> */}

      <p className="">
       lorem
      </p>
    </div>
  );
};

export default Home;
