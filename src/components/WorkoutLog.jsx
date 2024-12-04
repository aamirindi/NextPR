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
import { useNavigate } from "react-router-dom";

const WorkoutLog = ({ userId, onWorkoutUpdate }) => {
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  // Function to normalize exercise names
  const normalizeExerciseName = (name) => name.trim().toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedExercise = normalizeExerciseName(exercise);

    try {
      const workoutsRef = collection(db, "workouts");
      const q = query(
        workoutsRef,
        where("userId", "==", userId),
        where("exercise", "==", normalizedExercise),
        orderBy("weight", "desc"),
        orderBy("reps", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      let isPR = false;

      if (!querySnapshot.empty) {
        const previousWorkout = querySnapshot.docs[0];
        const { reps: prevReps, weight: prevWeight } = previousWorkout.data();

        // Check if the current workout exceeds the previous PR
        isPR =
          parseFloat(weight) > prevWeight ||
          (parseFloat(weight) === prevWeight && parseInt(reps, 10) > prevReps);

        if (isPR) {
          // Correctly update the old PR to isPR = false
          await previousWorkout.ref.update({ isPR: false });
        }
      } else {
        // If no previous PR exists, this is the first PR
        isPR = true;
      }

      // Add the new workout
      await addDoc(workoutsRef, {
        userId,
        exercise: normalizedExercise,
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
        weight: parseFloat(weight),
        notes,
        date: new Date(),
        isPR,
      });

      // Update the UI and reset the form
      onWorkoutUpdate();
      setExercise("");
      setSets("");
      setReps("");
      setWeight("");
      setNotes("");
      navigate("/home");
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
