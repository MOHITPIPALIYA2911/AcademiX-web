import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupMembers = ({ groupId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7777/groups/${groupId}/members`,
          { withCredentials: true }
        );
        setMembers(res.data);
      } catch (error) {
        console.error("Failed to fetch group members:", error);
      }
    };

    if (groupId) fetchMembers();
  }, [groupId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Group Members</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center gap-4 bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <img
              src={member.user_id.profile_pic}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://cdn.jsdelivr.net/npm/@mdi/svg/svg/account-circle.svg";
              }}
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                {member.user_id.firstName+ " "+member.user_id.lastName}
              </h3>
              <p className="text-xs text-gray-500">{member.role_in_group}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;
