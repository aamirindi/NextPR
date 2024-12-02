import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setTimeout(() => setLoading(false), 4000);
    });
  
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#8c81fa]">
        <img
          src="/assets/loading4.gif"
          alt="loading"
          width={500}
        />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/home" replace /> : <SignUp />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute user={user}>
              <Home user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
