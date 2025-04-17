import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const JoinedGroups = () => {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(`http://localhost:7777/groups/user/${user._id}`, {
          withCredentials: true,
        });

        const joined = res.data.filter((group) => group.created_by !== user._id);
        setJoinedGroups(joined);
      } catch (err) {
        console.error("Error fetching joined groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-8">Joined Groups</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading your joined groups...</p>
      ) : joinedGroups.length === 0 ? (
        <p className="text-center text-gray-500 italic">You haven’t joined any groups yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedGroups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/viewgroup/${group._id}`)}
              className="cursor-pointer bg-gray-100 border-l-4 border-green-500 p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span role="img" aria-label="group">👥</span> {group.group_name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{group.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinedGroups;
