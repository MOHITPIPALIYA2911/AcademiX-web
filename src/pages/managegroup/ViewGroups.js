// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const GroupSection = ({ title, groups, emptyMsg, viewAllLink, loading }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="mb-12">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-2xl font-semibold text-green-700">{title}</h3>
//         {viewAllLink && groups.length > 6 && (
//           <span
//             onClick={() => navigate(viewAllLink)}
//             className="text-green-600 text-sm hover:underline hover:text-green-800 transition cursor-pointer"
//           >
//             View All →
//           </span>
//         )}
//       </div>

//       {loading ? (
//         <p className="text-gray-500 italic">Loading {title.toLowerCase()}...</p>
//       ) : groups.length === 0 ? (
//         <p className="text-gray-500 italic">{emptyMsg}</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {groups.slice(0, 6).map((group, index) => (
//             <div
//               key={index}
//               onClick={() => navigate(`/viewgroup/${group._id}`)}
//               className="cursor-pointer bg-gray-100 border-l-4 border-green-400 rounded-lg p-4 shadow hover:shadow-md transition-all duration-300"
//             >
//               <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                 <span role="img" aria-label="group">👥</span>
//                 {group.groupName}
//               </h4>
//               <p className="text-sm text-gray-600 mt-1">{group.description}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const ViewGroups = () => {
//   const [myGroups, setMyGroups] = useState([]);
//   const [joinedGroups, setJoinedGroups] = useState([]);
//   const [allGroups, setAllGroups] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAll = async () => {
//       const token = localStorage.getItem('token');
//       const userId = localStorage.getItem('userId');

//       try {
//         const all = await fetch('http://localhost:7777/groups', {
//           headers: { Authorization: `Bearer ${token}` },
//         }).then((res) => res.json());

//         const my = await Promise.all(
//           all.map(async (group) => {
//             const res = await fetch(`http://localhost:7777/groups/${group._id}`, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             const data = await res.json();
//             return data.createdBy === userId ? group : null;
//           })
//         );

//         const joined = await Promise.all(
//           all.map(async (group) => {
//             const res = await fetch(`http://localhost:7777/groups/${group._id}/members`, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             const data = await res.json();
//             const isMember = data.some((member) => member._id === userId);
//             return isMember ? group : null;
//           })
//         );

//         setAllGroups(all);
//         setMyGroups(my.filter(Boolean));
//         setJoinedGroups(joined.filter(Boolean));
//       } catch (error) {
//         console.error('Error fetching groups:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10">
//       <h2 className="text-4xl font-bold text-center text-green-700 mb-12">Explore Groups</h2>

//       <GroupSection
//         title="My Groups"
//         groups={myGroups}
//         emptyMsg="You haven’t created any groups yet."
//         viewAllLink="/mygroups"
//         loading={loading}
//       />

//       <GroupSection
//         title="Joined Groups"
//         groups={joinedGroups}
//         emptyMsg="You haven’t joined any groups yet."
//         viewAllLink="/joinedgroups"
//         loading={loading}
//       />

//       <GroupSection
//         title="All Groups"
//         groups={allGroups}
//         emptyMsg="No groups available to join right now."
//         viewAllLink="/allgroups"
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default ViewGroups;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyGroups = [
  { _id: '1', groupName: 'Frontend Wizards', description: 'Discuss React, Vue, and frontend magic.' },
  { _id: '2', groupName: 'Backend Builders', description: 'All about APIs, databases, and Node.js.' },
  { _id: '3', groupName: 'DevOps Nation', description: 'CI/CD, cloud, and container magic.' },
  { _id: '4', groupName: 'AI Enthusiasts', description: 'Talk GPT, ML, and future tech.' },
  { _id: '5', groupName: 'UI/UX Creators', description: 'Design lovers meet here.' },
  { _id: '6', groupName: 'Code Newbies', description: 'Helping beginners grow 🚀' },
  { _id: '7', groupName: 'Next.js Masters', description: 'Advanced SSR and routing techniques.' },
  { _id: '8', groupName: 'Open Source Army', description: 'Code for the community.' },
  { _id: '9', groupName: 'JS Junkies', description: 'Pure JavaScript fun and tips.' },
  { _id: '10', groupName: 'TechTalk Tribe', description: 'Chill and chat about tech.' },
];

const GroupSection = ({ title, groups, emptyMsg, viewAllLink, limit, loading }) => {
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
              onClick={() => navigate(`/viewgroup/${group._id}`)}
              className="cursor-pointer bg-gray-100 border-l-4 border-green-400 rounded-lg p-4 shadow hover:shadow-md transition-all duration-300"
            >
              <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span role="img" aria-label="group">👥</span>
                {group.groupName}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{group.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ViewGroups = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      try {
        const res = await fetch('http://localhost:7777/groups', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch groups');
        const all = await res.json();

        const my = await Promise.all(
          all.map(async (group) => {
            const detail = await fetch(`http://localhost:7777/groups/${group._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json());
            return detail.createdBy === userId ? group : null;
          })
        );

        const joined = await Promise.all(
          all.map(async (group) => {
            const members = await fetch(`http://localhost:7777/groups/${group._id}/members`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json());
            const isMember = members.some((m) => m._id === userId);
            return isMember ? group : null;
          })
        );

        setAllGroups(all.length ? all : dummyGroups);
        setMyGroups(my.filter(Boolean).length ? my.filter(Boolean) : dummyGroups);
        setJoinedGroups(joined.filter(Boolean).length ? joined.filter(Boolean) : dummyGroups);
      } catch (error) {
        console.warn('Falling back to dummy groups:', error.message);
        setAllGroups(dummyGroups);
        setMyGroups(dummyGroups);
        setJoinedGroups(dummyGroups);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-green-700 mb-12">Explore Groups</h2>

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

export default ViewGroups;
