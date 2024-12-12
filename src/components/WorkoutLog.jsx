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
  const [time, setTime] = useState({ minutes: "", seconds: "" });
  const [view, setView] = useState("NO");
  const navigate = useNavigate();

  const normalizeExerciseName = (name) => name.trim().toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedExercise = normalizeExerciseName(exercise);

    const normalizedTime = {
      minutes: time.minutes ? parseInt(time.minutes, 10) : 0,
      seconds: time.seconds ? parseInt(time.seconds, 10) : 0,
    };
    const normalizedReps = reps ? parseInt(reps, 10) : 0;

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

        isPR =
          parseFloat(weight) > prevWeight ||
          (parseFloat(weight) === prevWeight && normalizedReps > prevReps);

        if (isPR) {
          const prevPRRef = doc(db, "workouts", previousWorkoutDoc.id);
          await updateDoc(prevPRRef, { isPR: false });
        }
      } else {
        isPR = true;
      }

      await addDoc(workoutsRef, {
        userId,
        exercise: normalizedExercise,
        sets: parseInt(sets, 10) || 0,
        reps: normalizedReps,
        weight: weight ? parseFloat(weight) : 0,
        time: normalizedTime,
        notes,
        view,
        date: new Date(),
        isPR,
      });

      onWorkoutUpdate();
      setExercise("");
      setSets("");
      setReps("");
      setWeight("");
      setNotes("");
      setTime({ minutes: "", seconds: "" });
      setView("YES");
      navigate("/home");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <div className="flex justify-center workout items-center flex-col mx-2">
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
          />
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (kg)"
            className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={time.minutes}
            onChange={(e) =>
              setTime((prev) => ({ ...prev, minutes: e.target.value }))
            }
            placeholder="Minutes"
            className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
          />
          <input
            type="number"
            value={time.seconds}
            onChange={(e) =>
              setTime((prev) => ({ ...prev, seconds: e.target.value }))
            }
            placeholder="Seconds"
            className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
          />
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="w-full p-3 rounded-md bg-[#474848]  border-[#797d7d] border-2 outline-none"
        ></textarea>

        <p>View on Home Page?</p>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="w-full p-3 rounded-md bg-[#474848] select  border-[#797d7d] border-2 outline-none"
          required
        >
          <option value="YES">Yes</option>
          <option value="NO">No</option>
        </select>
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
