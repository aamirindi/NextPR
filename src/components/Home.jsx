import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Navbar from "./Navbar";

const Home = () => {
  const userId = auth.currentUser?.uid;
  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    if (!userId) return;

    try {
      const workoutsRef = collection(db, "workouts");
      const q = query(
        workoutsRef,
        where("userId", "==", userId),
        where("isPR", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const workoutData = [];

      // Track the highest PR for each exercise
      const exerciseMap = new Map();

      querySnapshot.docs.forEach((doc) => {
        const workout = { id: doc.id, ...doc.data() };
        const { exercise, weight, reps } = workout;

        if (!exerciseMap.has(exercise)) {
          exerciseMap.set(exercise, workout);
        } else {
          const existingPR = exerciseMap.get(exercise);
          if (
            parseFloat(weight) > existingPR.weight ||
            (parseFloat(weight) === existingPR.weight &&
              parseInt(reps, 10) > existingPR.reps)
          ) {
            exerciseMap.set(exercise, workout);
          }
        }
      });

      // Add the best PRs to workoutData
      exerciseMap.forEach((value) => workoutData.push(value));

      setWorkouts(workoutData);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [userId]);

  if (!userId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/assets/loading.gif" alt="loading" width={100} height={100} />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 min-h-screen text-white">
      <Navbar userId={userId} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pl-14 pr">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <h2 className="text-3xl capitalize italic font-bold mb-4">
                {workout.exercise}
              </h2>
              <p className="text-lg">
                <strong>Sets:</strong> {workout.sets}
              </p>
              <p className="text-lg">
                <strong>Reps:</strong> {workout.reps}
              </p>
              <p className="text-lg">
                <strong>Weight:</strong> {workout.weight} kg
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {new Date(workout.date.seconds * 1000).toLocaleDateString()}
              </p>
              {workout.isPR && (
                <span className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-full">
                  🎉 New PR!
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
