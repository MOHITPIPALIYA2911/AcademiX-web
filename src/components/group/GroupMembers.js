import React, { useEffect, useState } from "react";

const GroupMembers = ({ groupId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Dummy data — replace with actual fetch using groupId
    const dummy = [
      { id: "1", name: "Alice Johnson", img: "https://i.pravatar.cc/150?img=1" },
      { id: "2", name: "Bob Singh", img: "https://i.pravatar.cc/150?img=2" },
      { id: "3", name: "Clara Ray", img: "https://i.pravatar.cc/150?img=3" },
      { id: "4", name: "David Wu", img: "https://i.pravatar.cc/150?img=4" },
      { id: "5", name: "Eva Thomas", img: "https://i.pravatar.cc/150?img=5" },
    ];
    setMembers(dummy);
  }, [groupId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Group Members</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <img
              src={member.img}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{member.name}</h3>
              <p className="text-xs text-gray-500">Member</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;
