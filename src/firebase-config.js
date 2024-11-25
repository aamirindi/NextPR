import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFoD2tLzdJ0zvlGBAxy7U4F0uRS2BCSNM",
  authDomain: "todos-cf1d1.firebaseapp.com",
  projectId: "todos-cf1d1",
  storageBucket: "todos-cf1d1.appspot.com",
  messagingSenderId: "740741663657",
  appId: "1:740741663657:web:ad3fff8f0d18e5dc1c12b8",
  measurementId: "G-RMBFDZZHYX"
};

let auth, db;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication
  auth = getAuth(app);

  // Set authentication persistence
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting persistence:", error);
  });

  // Initialize Firestore
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Export Firebase utilities
export { auth, db };
