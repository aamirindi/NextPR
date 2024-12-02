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
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const workoutData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Group by exercise and get the most recent record
      const groupedWorkouts = workoutData.reduce((acc, workout) => {
        if (!acc[workout.exercise]) {
          acc[workout.exercise] = workout;
        }
        return acc;
      }, {});

      setWorkouts(Object.values(groupedWorkouts));
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
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 min-h-screen text-white ">
      <Navbar userId={userId} />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-6 italic">Recent Workouts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 workout-form">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white text-gray-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="mb-4">
                <p className="text-2xl font-semibold">{workout.exercise}</p>
                <p className="text-lg text-gray-600 mt-2">{`Sets: ${workout.sets}, Reps: ${workout.reps}, Weight: ${workout.weight}kg`}</p>
                <p className="text-gray-500 mt-1">{new Date(workout.date.seconds * 1000).toLocaleDateString()}</p>
              </div>
              {workout.isPR && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full inline-block mt-4">
                  New PR!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
