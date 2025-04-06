import React, { useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    email: "jethalal@gmail.com",
    firstName: "Jethalal",
    lastName: "Gada",
    bio: "Owner of Gada Electronics",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    console.log("Profile updated:", profile);
    // TODO: Call your API here
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
        My Profile
      </h2>

      <div className="bg-white rounded-xl shadow-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 bg-gray-200 rounded-full border-4 border-green-500 flex items-center justify-center text-gray-500 text-sm">
            Upload Photo
          </div>
          <button className="mt-4 text-sm text-green-600 hover:underline">Change</button>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={profile.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Tell us something about yourself..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
