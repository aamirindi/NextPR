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
        where("isPR", "==", true),
        where("view", "==", "YES"),
        orderBy("weight", "desc"),
        orderBy("reps", "desc")
      );

      const querySnapshot = await getDocs(q);
      const exerciseMap = new Map();

      querySnapshot.docs.forEach((doc) => {
        const workout = { id: doc.id, ...doc.data() };
        const { exercise, weight, reps } = workout;

        if (!exerciseMap.has(exercise)) {
          exerciseMap.set(exercise, workout);
        }
      });

      // Convert the map to an array for rendering
      const workoutData = Array.from(exerciseMap.values());

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
        <img
          src="/assets/loading6.gif"
          alt="loading"
          width={100}
          height={100}
        />
      </div>
    );
  }

  return (
    <div className=" min-h-screen text-white">
      <Navbar userId={userId} />
      <div className="container mx-auto p-4">
        {workouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-2xl font-bold italic">No Records Found</p>
            <p className="text-lg text-gray-300 mt-2 ">
              Start logging your workouts to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pl-16 pr">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-[#474848] text-white p-3 rounded-lg shadow-2xl hover:shadow-2xl transition-transform transform hover:scale-y-105 w-full"
              >
                <h2 className="text-2xl capitalize header-history italic font-bold mb-4">
                  {workout.exercise}
                </h2>

                <ul className="mt-4 history-list">
                  <li className="flex items-center justify-between">
                    <p className="text-md mb-2 text-yellow-200 ">Sets :</p>
                    <p className="font-bold">{workout.sets}</p>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-md mb-2 text-yellow-200">Reps :</p>
                    <p className="font-bold">{workout.reps}</p>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-md mb-2 text-yellow-200">Weight :</p>
                    <p className="font-bold">{workout.weight} kg</p>
                  </li>
                  <li className="flex items-center justify-between">
                    <p className="text-md mb-2 text-yellow-200">Time :</p>
                    <p>{`${workout.time.minutes} min,
               ${workout.time.seconds} sec`}</p>
                  </li>
                </ul>

                <p className="text-gray-400 text-sm mt-2">
                  {new Date(workout.date.seconds * 1000).toLocaleDateString()}
                </p>
                {workout.isPR && (
                  <span className="mt-4 inline-block border-yellow-200 border-[3px] text-white py-2 px-4 rounded-md">
                    New PR!
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
