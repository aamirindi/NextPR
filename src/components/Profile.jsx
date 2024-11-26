import React from "react";

const Profile = ({ user }) => {
  if (!user) return <p>No user information available</p>;

  console.log(user);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-400">
      <div className="p-4 max-w-lg mx-auto form shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>UID:</strong> {user.uid}
        </p>
        <p>
          <strong>Phone:</strong> {user.phoneNumber}
        </p>
        <p>
          <strong>Photo:</strong> {user.photoURL}
        </p>
      </div>
    </div>
  );
};

export default Profile;
