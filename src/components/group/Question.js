// src/pages/Question.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  mdiThumbUpOutline,
  mdiStar,
  mdiStarOutline,
  mdiPencilOutline,
  mdiTrashCanOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import CommentSection from "./CommentSection";
import AddAnswer from "../AddAnswer";
import Breadcrumb from "../breadcrumb/Breadcrumb";

const Question = () => {
  const { qid,grpID } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [votedAnswers, setVotedAnswers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  // Editing state for answers
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerContent, setEditAnswerContent] = useState("");

  // Fetch question + answers
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:7777/posts/${qid}`,
        { withCredentials: true }
      );
      setQuestion(data.post);
      setAnswers(data.answers);
    } catch (err) {
      console.error("Error fetching question:", err);
    }
  };

  // Fetch which answers user has upvoted
  const fetchVotes = async () => {
    if (!answers.length) return;
    try {
      const res = await axios.get("http://localhost:7777/votes/myVotes", {
        withCredentials: true,
      });
      const votedSet = new Set(res.data.votedPostIds || []);
      setVotedAnswers(
        answers.map((a) => a._id).filter((id) => votedSet.has(id))
      );
    } catch (err) {
      console.error("Error fetching votes:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [qid]);

  useEffect(() => {
    fetchVotes();
  }, [answers]);

  // Toggle upvote
  const handleUpvote = async (answerId) => {
    const already = votedAnswers.includes(answerId);
    setAnswers((prev) =>
      prev.map((a) =>
        a._id === answerId
          ? { ...a, votes: already ? Math.max((a.votes || 1) - 1, 0) : (a.votes || 0) + 1 }
          : a
      )
    );
    try {
      const { data } = await axios.post(
        `http://localhost:7777/votes/${answerId}`,
        {},
        { withCredentials: true }
      );
      setAnswers((prev) =>
        prev.map((a) => (a._id === answerId ? { ...a, votes: data.votes } : a))
      );
      setVotedAnswers((prev) =>
        already ? prev.filter((id) => id !== answerId) : [...prev, answerId]
      );
    } catch (err) {
      console.error("Error toggling vote:", err);
      // revert
      setAnswers((prev) =>
        prev.map((a) =>
          a._id === answerId
            ? { ...a, votes: already ? (a.votes || 0) + 1 : Math.max((a.votes || 1) - 1, 0) }
            : a
        )
      );
    }
  };

  // Toggle approval (only server will allow)
  const handleApprove = async (answerId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:7777/posts/${answerId}/approve`,
        {},
        { withCredentials: true }
      );
      setAnswers((prev) =>
        prev.map((a) =>
          a._id === answerId ? { ...a, approved_flag: data.answer.approved_flag } : a
        )
      );
    } catch (err) {
      if (err.response?.status === 403) {
        alert("You do not have permission to approve this answer.");
      } else {
        console.error("Error toggling approval:", err);
      }
    }
  };

  // Delete answer
  const handleDeleteAnswer = async (e, answerId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this answer?")) return;
    try {
      await axios.delete(
        `http://localhost:7777/posts/${answerId}`,
        { withCredentials: true }
      );
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || "Error deleting answer";
      alert(msg);
    }
  };

  // Start editing answer
  const handleEditAnswerClick = (e, answer) => {
    e.stopPropagation();
    setEditingAnswerId(answer._id);
    setEditAnswerContent(answer.content);
  };

  // Save updated answer
  const handleUpdateAnswer = async (e, answerId) => {
    e.stopPropagation();
    try {
      await axios.put(
        `http://localhost:7777/posts/${answerId}`,
        { content: editAnswerContent },
        { withCredentials: true }
      );
      setEditingAnswerId(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || "Error updating answer";
      alert(msg);
    }
  };

  if (!question) return <div>Loading question...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Breadcrumb
        paths={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Group", path: `/viewgroup/${grpID}/from/dashboard` }, 
          { label: "Question" },
        ]}
      />


      <div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          {question.title}
        </h1>
        <p className="text-gray-700">{question.content}</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Answers</h2>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
        >
          {showAdd ? "Cancel" : "Add Answer"}
        </button>
      </div>

      {showAdd && (
        <AddAnswer
          questionId={qid}
          onSuccess={() => {
            setShowAdd(false);
            fetchData();
          }}
        />
      )}

      {answers.map((answer) => {
        // If this answer is in edit mode
        if (editingAnswerId === answer._id) {
          return (
            <div
              key={answer._id}
              className="relative bg-white border rounded p-4 shadow mb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                rows={3}
                value={editAnswerContent}
                onChange={(e) => setEditAnswerContent(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleUpdateAnswer(e, answer._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAnswerId(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        }

        // Normal view mode
        const isVoted = votedAnswers.includes(answer._id);
        return (
          <div
            key={answer._id}
            className="relative bg-white border rounded p-4 shadow mb-6 hover:shadow-md transition"
          >
            {/* Approve star (left) */}
            <button
              onClick={() => handleApprove(answer._id)}
              className="absolute top-2 left-2 p-1 hover:bg-gray-100 rounded"
              title={answer.approved_flag ? "Approved answer" : "Click to approve"}
            >
              <Icon
                path={answer.approved_flag ? mdiStar : mdiStarOutline}
                size={0.8}
                className={`opacity-60 ${answer.approved_flag ? "text-yellow-400" : "text-gray-300"
                  }`}
              />
            </button>

            {/* Edit and Delete buttons (right side) */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={(e) => handleEditAnswerClick(e, answer)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Edit answer"
              >
                <Icon
                  path={mdiPencilOutline}
                  size={0.8}
                  className="text-gray-500 hover:text-blue-600"
                />
              </button>
              <button
                onClick={(e) => handleDeleteAnswer(e, answer._id)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Delete answer"
              >
                <Icon
                  path={mdiTrashCanOutline}
                  size={0.8}
                  className="text-gray-400 hover:text-red-600"
                />
              </button>
            </div>
            <div className="mt-5"><p className="text-gray-800">{answer.content}</p></div>


            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={() => handleUpvote(answer._id)}
                className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition ${isVoted
                    ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                    : "border-green-500 text-green-600 hover:bg-green-50"
                  }`}
              >
                <Icon path={mdiThumbUpOutline} size={0.8} />
                {isVoted ? "Undo Upvote" : "Upvote"}
              </button>
              <span className="text-sm text-gray-600">
                {answer.votes || 0} vote{(answer.votes || 0) !== 1 && "s"}
              </span>
            </div>

            <CommentSection answerId={answer._id} />
          </div>
        );
      })}
    </div>
  );
};

export default Question;
