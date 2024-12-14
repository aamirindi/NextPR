import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Navbar from "./Navbar";

const Home = () => {
  const userId = auth.currentUser?.uid;
  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    if (!userId) {
      console.log("User ID is missing.");
      return;
    }

    try {
      const workoutsRef = collection(db, "workouts");
      const q = query(
        workoutsRef,
        where("userId", "==", userId),
        where("isPR", "==", true),
        where("view", "==", "YES")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No matching workouts found.");
        setWorkouts([]);
        return;
      }

      const exerciseMap = new Map();

      querySnapshot.docs.forEach((doc) => {
        const workout = { id: doc.id, ...doc.data() };
        const { exercise, sets } = workout;

        if (exercise && sets && sets.length > 0) {
          // Find the set with the heaviest weight
          const heaviestSet = sets.reduce((max, current) => {
            return current.weight > max.weight ? current : max;
          }, sets[0]);

          // Add only one workout per exercise
          if (!exerciseMap.has(exercise)) {
            exerciseMap.set(exercise, {
              ...workout,
              weight: heaviestSet.weight,
              reps: heaviestSet.reps,
            });
          }
        }
      });

      const workoutData = Array.from(exerciseMap.values());
      // console.log("Fetched Workouts:", workoutData);
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
  // Function to convert lb to kg
  const convertToKg = (weightInLb) => (weightInLb * 0.453592).toFixed(2);
  // Function to convert kg to lb
  const convertToLb = (weightInKg) => (weightInKg * 2.20462).toFixed(2);

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
                className="bg-[#474848] animate_3 text-white p-3 rounded-lg shadow-2xl hover:shadow-2xl transition-transform transform hover:scale-y-105 w-full"
              >
                <h2 className="text-2xl capitalize header-history italic font-bold mb-4">
                  {workout.exercise}
                </h2>

                <div className="mt-4 history-list">
                  <ul className="mt-4 history-list">
                    {/* Display the number of sets */}
                    <li className="flex items-center justify-between">
                      <p className="text-md mb-2 text-yellow-200">Sets :</p>
                      <p className="font-bold">{workout.sets?.length}</p>
                    </li>

                    {/* Map through the sets array to display each set */}
                    {workout.sets?.map((set, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <p className="text-md mb-2 text-yellow-200">
                          Set {index + 1}:
                        </p>
                        <p className="font-bold">
                          Reps: {set.reps} | Weight: {set.weight} {set.unit}
                        </p>
                      </li>
                    ))}

                    {/* Display Time Information */}
                    <li className="flex items-center justify-between">
                      <p className="text-md mb-2 text-yellow-200">Time :</p>
                      <p>{`${workout.time?.minutes || 0} minutes, ${
                        workout.time?.seconds || 0
                      } seconds`}</p>
                    </li>
                  </ul>

                  <p className="text-sm text-gray-400 italic">
                    Notes: {workout.notes || "No notes provided."} <br />
                    <br />
                    {workout.sets?.map((set, index) => {
                      const weight = set.weight;
                      const unit = set.unit;

                      if (unit === "lb") {
                        const convertedWeight = convertToKg(weight);
                        return (
                          <span key={index} className="ml-2 block ">
                            Weight {index + 1} : {weight}lb {" "}
                            <span className="text-white">
                              ({convertedWeight}kg)
                            </span>
                          </span>
                        );
                      }
                      if (unit === "kg") {
                        const convertedWeightInLb = convertToLb(weight);
                        return (
                          <span key={index} className="ml-2 block">
                            Weight {index + 1} : {weight}kg {" "}
                            <span className="text-white">
                              ({convertedWeightInLb}lb)
                            </span>
                          </span>
                        );
                      }
                      return null;
                    })}
                  </p>
                </div>

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
