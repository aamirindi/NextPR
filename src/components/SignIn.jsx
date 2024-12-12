import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";
import { doc, getDoc } from "firebase/firestore";

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
        });
      }

      navigate("/home");
    } catch (err) {
      setError("Failed to sign in. Please try again later.");
    }
  };

  return (
    <div className="main">
      {/* Video Background */}
      {/* <video
        autoPlay
        loop
        muted
        className="video-bg"
        src="/assets/bg1.mp4"
      ></video> */}

      {/* Glass Form */}
      <div className="p-10 flex flex-col items-center justify-center gap-3 text-center animate form ">
        <h1 className="text-[2.8rem] text-zinc-300 header italic font-semibold">
          NextPR
        </h1>
        <p className="text-zinc-400 mb-3 text-sm">
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-100 hover:text-gray-300"
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
          className="btn p-2 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-700 text-white bg-blue-600"
        >
          Login
        </button>

        <div className="flex items-center gap-2 relative mb-3 text-zinc-300 font-thin">
          <p className=" pr-3 font-['san-serif']">________________</p>
          <p className="absolute top-2 left-[46.5%] ">OR</p>
          <p className=" pl-3 font-['san-serif']">________________</p>
        </div>
        <p className="text-zinc-400 mb-3 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-zinc-50 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
