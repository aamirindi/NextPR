import React from "react";
import WorkoutLog from "./WorkoutLog";
import Navbar from "./Navbar";
import { auth } from "../firebase-config";

const Home = () => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return <p>
      <img src="/assests/loading.gif" alt="loading" width={100} height={100} />
    </p>;
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
