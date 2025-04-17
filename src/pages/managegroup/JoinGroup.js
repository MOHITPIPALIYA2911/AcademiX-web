import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { triggerNotification } from "../../utils/toastUtil";
import { useSelector } from "react-redux";

const JoinGroup = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [joinedGroupIds, setJoinedGroupIds] = useState([]);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const [allRes, joinedRes] = await Promise.all([
          axios.get("http://localhost:7777/groups", { withCredentials: true }),
          axios.get(`http://localhost:7777/groups/user/${user._id}`, {
            withCredentials: true,
          }),
        ]);

        setAllGroups(allRes.data);
        setFilteredGroups(allRes.data);
        setJoinedGroupIds(joinedRes.data.map((g) => g._id));
      } catch (err) {
        triggerNotification("error", "Failed to fetch group data");
        console.error(err);
      }
    };

    if (user?._id) fetchGroups();
  }, [user]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = allGroups.filter((group) =>
      (group.group_name || "").toLowerCase().includes(value.trim())
    );
    setFilteredGroups(filtered);
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setInviteCode("");
    setShowModal(true);
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      triggerNotification("error", "Please enter the invitation code");
      return;
    }

    try {
      await axios.post(
        `http://localhost:7777/groups/${selectedGroup._id}/join`,
        { invitationCode: inviteCode.trim() },
        { withCredentials: true }
      );
      triggerNotification("success", "Successfully joined the group");
      setShowModal(false);
      navigate(`/viewgroup/${selectedGroup._id}/from/joingrp`);
    } catch (err) {
      triggerNotification("error", err.response?.data?.message || "Invalid invitation code");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">Join a Group</h2>

      <input
        type="text"
        placeholder="Search groups..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-green-400"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredGroups.map((group) => {
          const isJoined = joinedGroupIds.includes(group._id);
          const isCreator = group.created_by === user._id;
          const isDisabled = isJoined || isCreator;

          return (
            <div
              key={group._id}
              onClick={() => !isDisabled && handleGroupClick(group)}
              className={`p-4 border-l-4 rounded-lg shadow transition ${
                isDisabled
                  ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:shadow-md bg-white border-green-300"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800">{group.group_name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{group.description}</p>
              {isCreator && (
                <p className="text-xs text-green-700 mt-1 italic">You created this group</p>
              )}
              {isJoined && !isCreator && (
                <p className="text-xs text-gray-500 mt-1 italic">Already joined</p>
              )}
            </div>
          );
        })}
      </div>

      {showModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-green-700">
              Join: {selectedGroup.group_name}
            </h2>
            <input
              type="text"
              placeholder="Enter Invitation Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-400"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinGroup;
