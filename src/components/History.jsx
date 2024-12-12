import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Navbar from "./Navbar";
import "react-calendar/dist/Calendar.css";

const History = () => {
  const userId = auth.currentUser?.uid;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState(null);

  // Fetch workouts by date range (start of the day to end of the day)
  const fetchWorkoutsByDate = async (date) => {
    if (!userId) return;

    try {
      // Get the start and end timestamps for the selected date (00:00:00 to 23:59:59)
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      // Convert to Firestore Timestamp format
      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      const workoutsRef = collection(db, "workouts");
      const q = query(
        workoutsRef,
        where("userId", "==", userId),
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp)
      );

      const querySnapshot = await getDocs(q);
      const workoutData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setWorkouts(workoutData);
    } catch (error) {
      console.error("Error fetching workouts by date:", error);
    }
  };

  useEffect(() => {
    fetchWorkoutsByDate(selectedDate);
  }, [selectedDate, userId]);

  const toggleWorkoutDetails = (id) => {
    setExpandedWorkoutId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className=" min-h-screen text-white font-sans">
      <Navbar userId={userId} />
      <div className="container mx-auto p-6 flex flex-col justify-center items-center">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Calendar */}
          <div className="p-4 rounded-xl w-full max-w-xs">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="rounded-lg p-2 shadow-2xl calendar-custom"
            />
          </div>

          {/* Workout Data */}
          <div className="lg:w-2/3 w-full">
            {workouts.length > 0 ? (
              workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-[#474848] text-white p-4 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out mb-2"
                >
                  <div className="flex items-center justify-between ">
                    <h2 className="text-2xl header-history capitalize  font-semibold">
                      {workout.exercise}
                    </h2>
                    <button
                      onClick={() => toggleWorkoutDetails(workout.id)}
                      className="text-xl font-bold px-2 ml-5 rounded-full text-white focus:outline-none"
                    >
                      {expandedWorkoutId === workout.id ? "-" : "+"}
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedWorkoutId === workout.id
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="mt-4 history-list">
                      <ul>
                        <li className="flex items-center justify-between">
                          <p className="text-lg mb-2 text-yellow-200 ">Sets :</p>
                          <p className="font-bold">
                            {workout.sets}
                          </p>
                        </li>
                        <li className="flex items-center justify-between">
                          <p className="text-lg mb-2 text-yellow-200">Reps :</p>
                          <p className=" font-bold">
                            {workout.reps}
                          </p>
                        </li>
                        <li className="flex items-center justify-between">
                          <p className="text-lg mb-2 text-yellow-200">Weight :</p>
                          <p className=" font-bold">
                            {workout.weight} kg
                          </p>
                        </li>
                      </ul>
                      <p className="text-sm text-gray-400 italic">
                        Notes: {workout.notes || "No notes provided."}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-lg text-gray-300">
                No workouts recorded for this date.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
