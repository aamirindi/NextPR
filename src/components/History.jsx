import React, { useState, useEffect, useMemo } from "react";
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
  const [prDates, setPrDates] = useState([]); // Store dates with PR

  // Fetch workouts by date range (start of the day to end of the day)
  const fetchWorkoutsByDate = async (date) => {
    if (!userId) return;

    try {
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

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

  // Fetch PR dates
  const fetchPrDates = async () => {
    if (!userId) return;

    try {
      const workoutsRef = collection(db, "workouts");
      const q = query(
        workoutsRef,
        where("userId", "==", userId),
        where("isPR", "==", true)
      );
      const querySnapshot = await getDocs(q);

      // Map PR dates into an array of Date objects
      const prDateData = querySnapshot.docs.map((doc) => {
        const workout = doc.data();
        return workout.date.toDate();
      });

      setPrDates(prDateData);
    } catch (error) {
      console.error("Error fetching PR dates:", error);
    }
  };

  useEffect(() => {
    fetchWorkoutsByDate(selectedDate);
    fetchPrDates();
  }, [selectedDate, userId]);

  const toggleWorkoutDetails = (id) => {
    setExpandedWorkoutId((prevId) => (prevId === id ? null : id));
  };

  const convertToKg = (weightInLb) => (weightInLb * 0.453592).toFixed(2);
  const convertToLb = (weightInKg) => (weightInKg * 2.20462).toFixed(2);

  // Check if a date is a PR date
  const isPrDate = useMemo(
    () => (date) =>
      prDates.some((prDate) => prDate.toDateString() === date.toDateString()),
    [prDates]
  );

  return (
    <div className="min-h-screen text-white font-sans">
      <Navbar userId={userId} />
      <div className="container mx-auto p-6 flex flex-col justify-center items-center">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Calendar */}
          <div className="p-4 rounded-xl w-full max-w-xs animate">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="rounded-lg p-2 shadow-2xl calendar-custom"
              tileContent={({ date, view }) =>
                view === "month" && isPrDate(date) ? (
                  <div className="flex justify-center items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  </div>
                ) : null
              }
            />
          </div>

          {/* Workout Data */}
          <div className="lg:w-2/3 w-full animate_3">
            {workouts.length > 0 ? (
              workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-[#474848] mx-2 text-white p-4 shadow-lg hover:shadow-2xl transition duration-300 ease-in-out mb-2"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl header-history capitalize font-semibold">
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
                      <ul className="mt-4 history-list">
                        <li className="flex items-center justify-between">
                          <p className="text-md mb-2 text-yellow-200">Sets :</p>
                          <p className="font-bold">{workout.sets?.length}</p>
                        </li>
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
                                Weight {index + 1} : {weight}lb{" "}
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
                                Weight {index + 1} : {weight}kg{" "}
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
