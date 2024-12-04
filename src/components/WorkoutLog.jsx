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
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      let isPR = false;

      if (!querySnapshot.empty) {
        const previousWorkout = querySnapshot.docs[0].data();
        const { reps: prevReps, weight: prevWeight } = previousWorkout;
        isPR =
          parseFloat(weight) > prevWeight ||
          (parseFloat(weight) === prevWeight && parseInt(reps, 10) > prevReps);
      } else {
        isPR = true;
      }

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
    <div className="flex justify-center items-center flex-col mt-4 mx-4"> 
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl text-white space-y-8"
      >
        <h1 className="text-3xl font-extrabold text-center mb-4 text-purple-400">
          Log Your Workout
        </h1>
        <input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise Name"
          className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
          required
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Sets"
            className="p-4 rounded-lg bg-gray-900 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
            required
          />
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            className="p-4 rounded-lg bg-gray-900 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
            required
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (kg)"
            className="p-4 rounded-lg bg-gray-900 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
            required
          />
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional Notes (optional)"
          className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 focus:ring focus:ring-purple-500 focus:outline-none"
        ></textarea>
        <button
          type="submit"
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-bold transition duration-300 shadow-lg hover:shadow-xl"
        >
          Log Workout
        </button>
      </form>
    </div>
  );
};


export default WorkoutLog;
