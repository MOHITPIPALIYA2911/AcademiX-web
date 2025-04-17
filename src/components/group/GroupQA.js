import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mdiThumbUpOutline } from "@mdi/js";
import Icon from "@mdi/react";
import axios from "axios";
import { useSelector } from "react-redux";
import AddQuestion from "../AddQuestion";

const GroupQA = ({ title, isPublic, groupId }) => {
  const navigate = useNavigate();
  const { grpID } = useParams();
  const user = useSelector((store) => store.user);

  const [questions, setQuestions] = useState([]);
  const [votedIds, setVotedIds] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Toggle visibility of the AddQuestion form
  const [showAdd, setShowAdd] = useState(false);

  // Optimistic vote toggle
  const handleUpvote = async (id) => {
    const alreadyVoted = votedIds.includes(id);
    setQuestions((prev) =>
      prev.map((q) =>
        (q._id || q.id) === id
          ? {
              ...q,
              votes: alreadyVoted
                ? Math.max((q.votes || 1) - 1, 0)
                : (q.votes || 0) + 1,
            }
          : q
      )
    );
    try {
      const { data } = await axios.post(
        `http://localhost:7777/votes/${id}`,
        {},
        { withCredentials: true }
      );
      setQuestions((prev) =>
        prev.map((q) =>
          (q._id || q.id) === id ? { ...q, votes: data.votes } : q
        )
      );
      setVotedIds((prev) =>
        alreadyVoted ? prev.filter((vid) => vid !== id) : [...prev, id]
      );
    } catch {
      // revert on error
      setQuestions((prev) =>
        prev.map((q) =>
          (q._id || q.id) === id
            ? {
                ...q,
                votes: alreadyVoted
                  ? (q.votes || 0) + 1
                  : Math.max((q.votes || 1) - 1, 0),
              }
            : q
        )
      );
    }
  };

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const fetchUserVotes = async () => {
    try {
      const res = await axios.get("http://localhost:7777/votes/myVotes", {
        withCredentials: true,
      });
      setVotedIds(res.data.votedPostIds || []);
    } catch {
      /* ignore */
    }
  };

  const fetchingPublicQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:7777/posts/public", {
        withCredentials: true,
      });
      setQuestions(res.data || []);
      await fetchUserVotes();
    } catch {
      /* ignore */
    } finally {
      setIsLoading(false);
    }
  };

  const fetchingPrivateQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:7777/posts/private/${groupId}`,
        { withCredentials: true }
      );
      setQuestions(res.data || []);
      await fetchUserVotes();
    } catch {
      /* ignore */
    } finally {
      setIsLoading(false);
    }
  };

  const refreshQuestions = () => {
    if (isPublic) fetchingPublicQuestions();
    else fetchingPrivateQuestions();
  };

  useEffect(() => {
    if (user) refreshQuestions();
  }, [isPublic, groupId, user]);

  return (
    <div className="space-y-6 p-4">
      {/* Header with title + Add Question button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-700">{title}</h2>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {showAdd ? "Cancel" : "Add Question"}
        </button>
      </div>

      {/* Conditionally render the AddQuestion form */}
      {showAdd && (
        <AddQuestion
          groupId={groupId}
          isPublic={isPublic}
          onSuccess={() => {
            setShowAdd(false);
            refreshQuestions();
          }}
        />
      )}

      {/* Questions list */}
      {isLoading ? (
        <div>Loading...</div>
      ) : questions.length === 0 ? (
        <p className="text-gray-500">No questions available.</p>
      ) : (
        questions.map((q) => {
          const id = q._id || q.id;
          const desc = q.description || "";
          const hasVoted = votedIds.includes(id);

          return (
            <div
              key={id}
              onClick={() => navigate(`/publicdiscussion/question/${id}`)}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer m-3"
            >
              <h3 className="text-lg font-semibold text-green-700">
                {q.title}
              </h3>
              <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                {expanded[id] || desc.length <= 150
                  ? desc
                  : desc.slice(0, 150) + "..."}
                {desc.length > 150 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(id);
                    }}
                    className="text-green-600 cursor-pointer hover:underline ml-2"
                  >
                    {expanded[id] ? "Show less" : "Read more"}
                  </span>
                )}
              </p>
              <div
                className="mt-4 flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleUpvote(id)}
                  className={`flex items-center gap-1 px-3 py-1 border text-sm rounded-md transition ${
                    hasVoted
                      ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                      : "border-green-500 text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Icon path={mdiThumbUpOutline} size={0.85} />
                  {hasVoted ? "Undo Upvote" : "Upvote"}
                </button>
                <span className="text-sm text-gray-700">
                  {q.votes || 0} vote{(q.votes || 0) !== 1 && "s"}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GroupQA;
