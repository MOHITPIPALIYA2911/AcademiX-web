// import React, { useEffect, useState } from "react";

// const JoinedGroups = () => {
//   const [joinedGroups, setJoinedGroups] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchJoinedGroups = async () => {
//       const token = localStorage.getItem("token");
//       const userId = localStorage.getItem("userId");

//       try {
//         const res = await fetch("http://localhost:7777/groups", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const allGroups = await res.json();

//         const joined = await Promise.all(
//           allGroups.map(async (group) => {
//             try {
//               const membersRes = await fetch(
//                 `http://localhost:7777/groups/${group._id}/members`,
//                 {
//                   headers: { Authorization: `Bearer ${token}` },
//                 }
//               );
//               const members = await membersRes.json();
//               const isMember = members.some((member) => member._id === userId);
//               return isMember ? group : null;
//             } catch (err) {
//               console.warn(`Couldn't fetch members for group ${group._id}`);
//               return null;
//             }
//           })
//         );

//         setJoinedGroups(joined.filter(Boolean));
//       } catch (err) {
//         console.error("Error fetching groups:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJoinedGroups();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h2 className="text-3xl font-bold text-green-700 text-center mb-8">Joined Groups</h2>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading your joined groups...</p>
//       ) : joinedGroups.length === 0 ? (
//         <p className="text-center text-gray-500 italic">You haven’t joined any groups yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {joinedGroups.map((group) => (
//             <div
//               key={group._id}
//               className="bg-gray-100 border-l-4 border-green-500 p-5 rounded-lg shadow hover:shadow-md transition"
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

// export default JoinedGroups;

import React, { useEffect, useState } from "react";

// Dummy groups as fallback
const dummyJoinedGroups = [
  { _id: "j1", groupName: "JS Ninjas", description: "Level up your JavaScript skills." },
  { _id: "j2", groupName: "Cloud Explorers", description: "Explore AWS, Azure & GCP." },
  { _id: "j3", groupName: "Open Source Champs", description: "Hack on real-world open-source." },
  { _id: "j4", groupName: "Hackathon Heroes", description: "Weekly prep & practice." },
  { _id: "j5", groupName: "Next.js League", description: "Dive deep into Next.js." },
  { _id: "j6", groupName: "Reactverse", description: "React, Redux, Hooks and more." },
  { _id: "j7", groupName: "Backend Brains", description: "Discuss API, Auth & DB design." },
  { _id: "j8", groupName: "Dev Chat Café", description: "Chill group for all devs." },
  { _id: "j9", groupName: "Linux & CLI Guild", description: "Master the terminal like a wizard." },
  { _id: "j10", groupName: "Productive Programmers", description: "Tools, tips, workflows." },
  { _id: "j11", groupName: "Code & Coffee", description: "Daily coding + caffeine shots." },
];

const JoinedGroups = () => {
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const res = await fetch("http://localhost:7777/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allGroups = await res.json();

        const joined = await Promise.all(
          allGroups.map(async (group) => {
            try {
              const membersRes = await fetch(
                `http://localhost:7777/groups/${group._id}/members`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const members = await membersRes.json();
              const isMember = members.some((member) => member._id === userId);
              return isMember ? group : null;
            } catch (err) {
              console.warn(`Couldn't fetch members for group ${group._id}`);
              return null;
            }
          })
        );

        const filtered = joined.filter(Boolean);
        setJoinedGroups(filtered.length ? filtered : dummyJoinedGroups);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setJoinedGroups(dummyJoinedGroups);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedGroups();
  }, []);

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
              className="bg-gray-100 border-l-4 border-green-500 p-5 rounded-lg shadow hover:shadow-md transition"
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

export default JoinedGroups;
