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
  const [sets, setSets] = useState([{ reps: "", weight: "", unit: "kg" }]);
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState({ minutes: "", seconds: "" });
  const [view, setView] = useState("NO");
  const navigate = useNavigate();

  const normalizeExerciseName = (name) => name.trim().toLowerCase();

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index][field] = value;
    setSets(updatedSets);
  };

  const handleUnitToggle = (index) => {
    const updatedSets = [...sets];
    const currentSet = updatedSets[index];
    const weightValue = parseFloat(currentSet.weight) || 0;

    if (currentSet.unit === "kg") {
      currentSet.weight = (weightValue * 2.20462).toFixed(2);
      currentSet.unit = "lb";
    } else {
      currentSet.weight = (weightValue / 2.20462).toFixed(2);
      currentSet.unit = "kg";
    }

    setSets(updatedSets);
  };

  const handleAddSet = () => {
    setSets([...sets, { reps: "", weight: "", unit: "kg" }]);
  };

  const handleRemoveSet = (index) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedExercise = normalizeExerciseName(exercise);

    const normalizedTime = {
      minutes: time.minutes ? parseInt(time.minutes, 10) : 0,
      seconds: time.seconds ? parseInt(time.seconds, 10) : 0,
    };

    try {
      const workoutsRef = collection(db, "workouts");
      const q = query(
        workoutsRef,
        where("userId", "==", userId),
        where("exercise", "==", normalizedExercise),
        orderBy("date", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      let isPR = false;

      if (!querySnapshot.empty) {
        const previousWorkoutDoc = querySnapshot.docs[0];
        const { sets: prevSets } = previousWorkoutDoc.data();

        isPR = sets.some((set, idx) => {
          const prevSet = prevSets[idx] || {};
          return (
            parseFloat(set.weight) > prevSet.weight ||
            (parseFloat(set.weight) === prevSet.weight &&
              parseInt(set.reps, 10) > prevSet.reps)
          );
        });

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
        sets: sets.map((set) => ({
          reps: parseInt(set.reps, 10) || 0,
          weight: parseFloat(set.weight) || 0,
          unit: set.unit,
        })),
        time: normalizedTime,
        notes,
        view,
        date: new Date(),
        isPR,
      });

      onWorkoutUpdate();
      setExercise("");
      setSets([{ reps: "", weight: "", unit: "kg" }]);
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
        className="max-w-lg p-2 text-white space-y-6 m-3"
      >
        <h1 className="text-3xl font-semibold text-zinc-400 text-center header">
          Log Your Workout
        </h1>
        <input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise"
          className="w-full p-3 rounded-md bg-[#474848] border-[#797d7d] border-2 outline-none"
          required
        />
        {sets.map((set, index) => (
          <div key={index} className="flex gap-2 items-center">
            {/* Reps Input */}

            <input
              type="number"
              value={set.reps}
              onChange={(e) => handleSetChange(index, "reps", e.target.value)}
              placeholder="Reps"
              className="w-full p-3 rounded-md bg-[#474848] border-[#797d7d] border-2 outline-none"
            />

            {/* Weight Input with Unit Toggle */}
            <input
              type="number"
              value={set.weight}
              onChange={(e) => handleSetChange(index, "weight", e.target.value)}
              placeholder={`Weight (${set.unit})`} // Fixed syntax error here
              className="w-full p-3 rounded-md bg-[#474848] border-[#797d7d] border-2 outline-none"
            />

            <button
              type="button"
              onClick={() => handleUnitToggle(index)}
              className="py-1 px-3 bg-gray-600 text-white rounded-md text-sm"
            >
              {set.unit === "kg" ? "To lb" : "To kg"}
            </button>

            {/* Remove Button */}

            <button
              type="button"
              onClick={() => handleRemoveSet(index)}
              className="py-3 px-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSet}
          className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md"
        >
          Add Set
        </button>
        {/* Time Input Fields */}
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={time.minutes}
            onChange={(e) => setTime({ ...time, minutes: e.target.value })}
            placeholder="Minutes"
            className="w-1/2 p-3 rounded-md bg-[#474848] border-[#797d7d] border-2 outline-none"
          />
          <input
            type="number"
            value={time.seconds}
            onChange={(e) => setTime({ ...time, seconds: e.target.value })}
            placeholder="Seconds"
            className="w-1/2 p-3 rounded-md bg-[#474848] border-[#797d7d] border-2 outline-none"
          />
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="w-full p-3 rounded-md bg-[#474848] border-[#797d7d] border-2 outline-none"
        ></textarea>

        <p>View on Home Page?</p>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="w-full p-3 select rounded-md bg-[#474848] border-[#797d7d] border-2 outline-none"
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
