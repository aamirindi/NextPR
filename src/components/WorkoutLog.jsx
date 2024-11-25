import { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';

const WorkoutLog = ({ userId }) => {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add workout to Firestore
      await addDoc(collection(db, 'workouts'), {
        userId,
        exercise,
        sets,
        reps,
        weight,
        notes,
        date: new Date(),
      });

      // Clear form fields
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      setNotes('');
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-black flex justify-center items-center flex-col'>
      <input
        type="text"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        placeholder="Exercise"
        required
      />
      <input
        type="number"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
        placeholder="Sets"
        required
      />
      <input
        type="number"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        placeholder="Reps"
        required
      />
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Weight"
        required
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      ></textarea>
      <button type="submit" className='btn'>Log Workout</button>
    </form>
  );
};

export default WorkoutLog;
