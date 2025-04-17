import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { triggerNotification } from "../../utils/toastUtil";

const Profile = () => {
  const user = useSelector((state) => state.user);

  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
    profile_pic: "",
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPicUrl, setNewPicUrl] = useState("");

  useEffect(() => {
    if (user) {
      const initialData = {
        email: user.emailId || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        profile_pic:
          user.profile_pic ||
          "https://cdn.jsdelivr.net/npm/@mdi/svg/svg/account-circle.svg",
      };
      setProfile(initialData);
      setOriginalProfile(initialData);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        profile_pic: profile.profile_pic,
      };

      const response = await axios.patch(
        "http://localhost:7777/profile/edit",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      triggerNotification("success", "Profile updated successfully.");
      setOriginalProfile(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      triggerNotification("error", "Failed to update profile.");
    }
  };

  const handlePicChange = () => {
    if (!newPicUrl.trim()) return;
    setProfile((prev) => ({ ...prev, profile_pic: newPicUrl }));
    setShowModal(false);
    setNewPicUrl("");
  };

  const isProfileChanged = () => {
    return (
      originalProfile &&
      (profile.firstName !== originalProfile.firstName ||
        profile.lastName !== originalProfile.lastName ||
        profile.bio !== originalProfile.bio ||
        profile.profile_pic !== originalProfile.profile_pic)
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-center text-green-700 mb-10">
        My Profile
      </h2>

      <div className="bg-white rounded-xl shadow-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center text-center">
          <img
            src={profile.profile_pic}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-green-500 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://cdn.jsdelivr.net/npm/@mdi/svg/svg/account-circle.svg";
            }}
          />
          <button
            className="mt-4 text-sm text-green-600 hover:underline"
            onClick={() => setShowModal(true)}
          >
            Change
          </button>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 border bg-gray-100 rounded-lg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              rows="4"
              value={profile.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Tell us something about yourself..."
            />
          </div>

          {isProfileChanged() && (
            <div className="bg-yellow-50 text-yellow-800 text-sm px-4 py-2 rounded-md border border-yellow-300 mb-2">
              You have unsaved changes. Press <b>Update Profile</b> to save them.
            </div>
          )}

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

      {/* Modal for Updating Profile Picture */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-center text-green-600">
              Update Profile Picture
            </h3>
            <input
              type="text"
              placeholder="Enter image URL"
              value={newPicUrl}
              onChange={(e) => setNewPicUrl(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            {newPicUrl && (
              <img
                src={newPicUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setNewPicUrl("");
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePicChange}
                disabled={!newPicUrl.trim()}
                className={`px-4 py-2 rounded text-white transition ${
                  newPicUrl.trim()
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
