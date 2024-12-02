import React, { useState } from "react";
import WorkoutLog from "./WorkoutLog";
import Navbar from "./Navbar";
import { auth } from "../firebase-config";

const Fitness = () => {
  const userId = auth.currentUser?.uid;
  const [workoutUpdated, setWorkoutUpdated] = useState(false);

  const handleWorkoutUpdate = () => {
    setWorkoutUpdated(!workoutUpdated);
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 min-h-screen text-white">
      <Navbar userId={userId} />
      <WorkoutLog userId={userId} onWorkoutUpdate={handleWorkoutUpdate} />
    </div>
  );
};

export default Fitness;
