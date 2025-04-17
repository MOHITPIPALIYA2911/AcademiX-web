import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GroupSection = ({
  title,
  groups,
  emptyMsg,
  viewAllLink,
  limit,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-green-700">{title}</h3>
        {viewAllLink && groups.length > limit && (
          <span
            onClick={() => navigate(viewAllLink)}
            className="text-green-600 text-sm hover:underline hover:text-green-800 transition cursor-pointer"
          >
            View All →
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 italic">Loading {title.toLowerCase()}...</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500 italic">{emptyMsg}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(limit > 0 ? groups.slice(0, limit) : groups).map((group, index) => (
            <div
              key={index}
              onClick={() => navigate(`/viewgroup/${group._id}/from/dashboard`)}
              className="cursor-pointer bg-gray-100 border-l-4 border-green-400 rounded-lg p-4 shadow hover:shadow-md transition-all duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span role="img" aria-label="group">👥</span>
                {group.group_name}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {group.description}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupsForUser = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(`http://localhost:7777/groups/user/${user._id}`, {
          withCredentials: true,
        });

        const all = res.data || [];

        setAllGroups(all);

        const created = all.filter((group) => group.created_by === user._id);
        const joined = all.filter((group) => group.created_by !== user._id);

        setMyGroups(created);
        setJoinedGroups(joined);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsForUser();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-green-700 mb-12">
        Explore Groups
      </h2>

      <GroupSection
        title="My Groups"
        groups={myGroups}
        emptyMsg="You haven’t created any groups yet."
        viewAllLink="/mygroups"
        limit={4}
        loading={loading}
      />

      <GroupSection
        title="Joined Groups"
        groups={joinedGroups}
        emptyMsg="You haven’t joined any groups yet."
        viewAllLink="/joinedgroups"
        limit={4}
        loading={loading}
      />

      <GroupSection
        title="All Groups"
        groups={allGroups}
        emptyMsg="No groups available to join right now."
        viewAllLink={null}
        limit={0}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
