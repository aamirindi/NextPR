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

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 min-h-screen text-white font-sans">
      <Navbar userId={userId} />
      <div className="container mx-auto p-6 flex flex-col justify-center items-center">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Calendar */}
          <div className="p-4 rounded-xl border shadow-xl bg-white text-zinc-800 w-full max-w-xs">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            />
          </div>
          {/* Workout Data */}
          <div className="lg:w-2/3 w-full">
            {workouts.length > 0 ? (
              workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out mb-6"
                >
                  <h2 className="text-3xl font-bold mb-4 text-gradient bg-clip-text italic capitalize text-red-500">
                    {workout.exercise}
                  </h2>
                  <p className="text-lg mb-2">
                    <strong>Sets:</strong> {workout.sets}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>Reps:</strong> {workout.reps}
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Weight:</strong> {workout.weight} kg
                  </p>
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
