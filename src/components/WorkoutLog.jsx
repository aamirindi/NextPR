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
import { doc, updateDoc } from "firebase/firestore";

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
        const previousWorkoutDoc = querySnapshot.docs[0];
        const { reps: prevReps, weight: prevWeight } =
          previousWorkoutDoc.data();

        // Check if the new workout is a PR
        isPR =
          parseFloat(weight) > prevWeight ||
          (parseFloat(weight) === prevWeight && parseInt(reps, 10) > prevReps);

        if (isPR) {
          // Update the old PR's isPR field to false
          const prevPRRef = doc(db, "workouts", previousWorkoutDoc.id);
          await updateDoc(prevPRRef, { isPR: false });
        }
      } else {
        // No previous PR exists, so this is the first PR
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
    <div className="flex justify-center workout items-center flex-col mt-20 mx-2">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto  p-6  text-white space-y-6 "
      >
        <h1 className="text-3xl font-semibold text-zinc-400 text-center header">
          Log Your Workout
        </h1>
        <input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise"
          className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
          required
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Sets"
            className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
            required
          />
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
            required
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (kg)"
            className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
            required
          />
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
        ></textarea>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition duration-300"
        >
          Log Workout
        </button>
      </form>
    </div>
  );
};

export default WorkoutLog;
