// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const MyGroups = () => {
//   const [myGroups, setMyGroups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMyGroups = async () => {
//       const token = localStorage.getItem("token");
//       const userId = localStorage.getItem("userId");

//       try {
//         const res = await fetch("http://localhost:7777/groups", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const allGroups = await res.json();
//         const filtered = allGroups.filter((group) => group.createdBy === userId);

//         setMyGroups(filtered);
//       } catch (err) {
//         console.error("Error fetching groups:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyGroups();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h2 className="text-3xl font-bold text-green-700 text-center mb-8">My Groups</h2>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading your groups...</p>
//       ) : myGroups.length === 0 ? (
//         <p className="text-center text-gray-500 italic">You haven’t created any groups yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {myGroups.map((group) => (
//             <div
//               key={group._id}
//               onClick={() => navigate(`/viewgroup/${group._id}`)}
//               className="bg-gray-100 border-l-4 border-green-500 p-5 rounded-lg shadow hover:shadow-md transition cursor-pointer"
//             >
//               <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <span role="img" aria-label="group">👥</span> {group.groupName}
//               </h3>
//               <p className="text-sm text-gray-600 mt-1">{group.description}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyGroups;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const dummyMyGroups = [
  { _id: "g1", groupName: "React Ninjas", description: "Mastering the React ecosystem." },
  { _id: "g2", groupName: "Node.js Gurus", description: "Server-side JavaScript pros." },
  { _id: "g3", groupName: "Fullstack Force", description: "Frontend + Backend = 💪" },
  { _id: "g4", groupName: "Open Source Squad", description: "Collab and contribute together." },
  { _id: "g5", groupName: "Hackathon Hustlers", description: "Prep and team up for tech battles." },
  { _id: "g6", groupName: "UX/UI Wizards", description: "Designing with empathy and magic." },
  { _id: "g7", groupName: "Tech Talkies", description: "Casual discussions & debates." },
  { _id: "g8", groupName: "AI & ML Thinkers", description: "Exploring the smart future." },
  { _id: "g9", groupName: "DevOps Tribe", description: "CI/CD & cloud power." },
  { _id: "g10", groupName: "Bug Bashers", description: "Squashing bugs like pros." },
  { _id: "g11", groupName: "Next.js Navigators", description: "SSR, routing, and more." },
  { _id: "g12", groupName: "Database Designers", description: "Crafting solid schemas." },
];

const MyGroups = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyGroups = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const res = await fetch("http://localhost:7777/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allGroups = await res.json();
        const filtered = allGroups.filter((group) => group.createdBy === userId);

        setMyGroups(filtered.length ? filtered : dummyMyGroups);
      } catch (err) {
        console.warn("Using dummy groups due to error:", err.message);
        setMyGroups(dummyMyGroups);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-8">My Groups</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading your groups...</p>
      ) : myGroups.length === 0 ? (
        <p className="text-center text-gray-500 italic">You haven’t created any groups yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGroups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/viewgroup/${group._id}`)}
              className="cursor-pointer bg-gray-100 border-l-4 border-green-500 p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span role="img" aria-label="group">👥</span> {group.groupName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{group.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroups;

