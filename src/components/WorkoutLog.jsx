import { useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

const WorkoutLog = ({ userId, onWorkoutUpdate }) => {
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const workoutsRef = collection(db, "workouts");
      const q = query(
        workoutsRef,
        where("userId", "==", userId),
        where("exercise", "==", exercise),
        orderBy("weight", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      const previousPR = querySnapshot.docs[0]?.data()?.weight || 0;

      const isPR = parseFloat(weight) > parseFloat(previousPR);

      // Add workout to Firestore
      await addDoc(workoutsRef, {
        userId,
        exercise,
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
        weight: parseFloat(weight),
        notes,
        date: new Date(),
        isPR,
      });

      // Notify parent component of workout update
      onWorkoutUpdate();

      // Clear form fields
      setExercise("");
      setSets("");
      setReps("");
      setWeight("");
      setNotes("");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col mt-20 mx-2">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gray-900 p-6 rounded-lg shadow-lg text-white space-y-6"
      >
        <h1 className="text-2xl font-semibold text-center">Log Your Workout</h1>
        <input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise"
          className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
          required
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Sets"
            className="p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
            required
          />
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            className="p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
            required
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (kg)"
            className="p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
            required
          />
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
        ></textarea>
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-semibold transition duration-300"
        >
          Log Workout
        </button>
      </form>
    </div>
  );
};

export default WorkoutLog;
