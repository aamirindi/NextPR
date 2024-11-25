import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSignUp = async (e) => {
    e.preventDefault();

    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email."
        );
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format. Please check your email address.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    }
  };

  return (
    <div className="main">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="video-bg"
        src="/assets/bg1.mp4"
      ></video>

      {/* Glass Form */}
      <div className="p-10 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center gap-3 text-center animate form">
        <h1 className="text-[2.8rem] text-black header italic font-semibold">
          NextPR
        </h1>
        <p className="text-zinc-700 mb-3 text-sm">
          Create an account to get started
        </p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="input outline-none rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input outline-none rounded-md w-full pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <VisibilityTwoToneIcon />
            ) : (
              <VisibilityOffTwoToneIcon />
            )}
          </button>
        </div>

        <div className="relative w-full">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="input outline-none rounded-md w-full pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <VisibilityTwoToneIcon />
            ) : (
              <VisibilityOffTwoToneIcon />
            )}
          </button>
        </div>

        <button
          onClick={handleSignUp}
          className="btn p-2 rounded-lg transition-transform transform hover:scale-105 hover:bg-[#a18483b6] hover:text-white"
        >
          Sign Up
        </button>

        <p className="text-zinc-700 mb-3 text-sm">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-zinc-950 hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
