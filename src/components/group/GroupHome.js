import React from "react";

const announcements = [
  {
    id: 1,
    title: "Kickoff Meeting",
    content: "Our first group meeting will be on Monday at 6PM.",
    time: "2025-04-08T18:00:00Z",
  },
  {
    id: 2,
    title: "New Resources Added",
    content: "Check out the new React tutorials in the shared folder.",
    time: "2025-04-06T09:30:00Z",
  },
];

const formatDate = (iso) => new Date(iso).toLocaleString();

const GroupHome = ({ description }) => {
  return (
    <div className="space-y-6 p-4">
      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">About this group</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Announcements */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Announcements</h3>
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm"
              >
                <h4 className="text-md font-bold text-green-800">{ann.title}</h4>
                <p className="text-sm text-gray-700">{ann.content}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(ann.time)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No announcements yet.</p>
        )}
      </div>
    </div>
  );
};

export default GroupHome;
