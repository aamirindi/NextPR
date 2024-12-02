import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser, updateProfile } from "firebase/auth";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import Navbar from "./Navbar";
import { auth, db } from "../firebase-config";

const Profile = ({ user }) => {
  if (!user) return <p>No user information available</p>;

  const [formData, setFormData] = useState({
    name: user.displayName || "",
    phone: "",
    imgUrl: user.photoURL || "",
    gender: "",
    dob: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch user profile from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData((prevData) => ({
          ...prevData,
          phone: userData.phoneNumber || "",
          gender: userData.gender || "",
          dob: userData.dob || "",
        }));
      } else {
        console.log("No such document!");
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: formData.imgUrl,
      });
      await updateDoc(userRef, {
        displayName: formData.name,
        phoneNumber: formData.phone,
        photoURL: formData.imgUrl,
        gender: formData.gender,
        dob: formData.dob,
      });
      console.log("Profile updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef); // Delete user data from Firestore
      await deleteUser(user); // Delete user from Firebase Authentication
      console.log("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 min-h-screen text-white">
      <Navbar />
      <div className="flex flex-col justify-center w-fit p-4 max-w-lg rounded-md text-white profile-form">
        {/* Display Current Info */}
        <div className="relative profile-container flex justify-between">
          <div className="mb-4 relative profile-img-container">
            <img
              src={formData.imgUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="rounded-full"
              width="150"
            />
          </div>
          <div className="flex gap-3 flex-col mb-5 profile-text items-end">
            <p className="mb-2">
              <strong className="text-black">Name:</strong> {formData.name}
            </p>
            <p className="mb-2">
              <strong className="text-black">Phone:</strong> {formData.phone}
            </p>
            <p className="mb-2">
              <strong className="text-black">Gender:</strong> {formData.gender}
            </p>
            <p className="mb-2">
              <strong className="text-black">DOB:</strong> {formData.dob}
            </p>
          </div>
        </div>

        {/* Edit and Delete Buttons */}
        <div className="flex justify-center gap-3 mt-5 profile-button">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditModalOpen(true)}
            className="edit-btn"
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Profile
          </Button>
        </div>

        {/* Modal for Editing Profile */}
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiPaper-root": {
              padding: "20px",
              backgroundColor: "#",
            },
          }}
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Image URL"
              name="imgUrl"
              value={formData.imgUrl}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary" variant="contained">
              Update Profile
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal for Confirming Account Deletion */}
        <Dialog
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogContent>
            <p>
              Are you sure you want to delete your account? This action is
              irreversible.
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
            >
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
