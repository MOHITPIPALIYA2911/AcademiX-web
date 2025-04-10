import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mdiThumbUpOutline } from "@mdi/js";
import Icon from "@mdi/react";



const GroupQA = () => {
    const navigate = useNavigate();
    const { grpID } = useParams() 

  const [questions, setQuestions] = useState([
    {
      id: "q1",
      title: "How does useEffect differ from useLayoutEffect?",
      description:
        "I know both run after rendering, but useLayoutEffect runs before paint. Can someone give a practical example where this difference matters?",
      votes: 5,
    },
    {
      id: "q2",
      title: "Best way to manage state in large React apps?",
      description:
        "Should I use Redux, Recoil, Zustand or stick with Context API? Looking for scalable and developer-friendly approach. Also what about performance in each?",
      votes: 3,
    },
    {
      id: "q3",
      title: "How to debounce input in React?",
      description:
        "What’s the best way to implement debounce in controlled inputs for search/filter functionality?",
    },
  ]);

  const [votedIds, setVotedIds] = useState([]);
  const [expanded, setExpanded] = useState({});

  const handleUpvote = (id) => {
    if (votedIds.includes(id)) return;

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, votes: (q.votes || 0) + 1 } : q
      )
    );
    setVotedIds([...votedIds, id]);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-green-700">Academic Q&A</h2>

      {questions.map((q) => (
        <div
          key={q.id}
          onClick={() => navigate(`/question/${q.id}/group/${grpID}`)}
          className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-green-700">{q.title}</h3>

          <p className="text-gray-700 mt-2 text-sm leading-relaxed">
            {(expanded[q.id] || q.description.length <= 150)
              ? q.description
              : q.description.slice(0, 150) + "..."}
            {q.description.length > 150 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(q.id);
                }}
                className="text-green-600 cursor-pointer hover:underline ml-2"
              >
                {expanded[q.id] ? "Show less" : "Read more"}
              </span>
            )}
          </p>

          <div
            className="mt-4 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()} // stop nav on button click
          >
            <button
              onClick={() => handleUpvote(q.id)}
              disabled={votedIds.includes(q.id)}
              className={`flex items-center gap-1 px-3 py-1 border text-sm rounded-md transition ${
                votedIds.includes(q.id)
                  ? "border-gray-300 text-gray-400 cursor-default"
                  : "border-green-500 text-green-600 hover:bg-green-50"
              }`}
            >
              <Icon path={mdiThumbUpOutline} size={0.85} />
              Upvote
            </button>
            <span className="text-sm text-gray-700">
              {q.votes || 0} vote{(q.votes || 0) !== 1 && "s"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupQA;
