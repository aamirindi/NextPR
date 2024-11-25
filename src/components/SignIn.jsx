import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError("Failed to sign in. Please try again later.");
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
          Enter your details to sign in
        </p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="input outline-none rounded-md w-full"
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

        <button
          onClick={handleSignIn}
          className="btn p-2 rounded-lg transition-transform transform hover:scale-105 hover:bg-[#a18483b6] hover:text-white"
        >
          Sign In
        </button>

        <p className="text-zinc-700 mb-3 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-zinc-950 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
