import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { mdiThumbUpOutline } from "@mdi/js";
import Icon from "@mdi/react";
import CommentSection from "./CommentSection";

const Question = () => {
  const { qid, grpID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State for question and answers
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  // For tracking vote state on answers
  const [votedAnswers, setVotedAnswers] = useState([]);

  // Fetch the question and its answers on mount
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:7777/posts/${qid}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setQuestion(data.post);
        setAnswers(data.answers);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };
    fetchPostDetails();
  }, [qid]);

  // Effect to fetch the current user’s voted answer IDs, so that on reload
  // the answer buttons appear in the proper toggled state.
  useEffect(() => {
    const fetchUserVotesForAnswers = async () => {
      if (answers.length > 0) {
        try {
          const res = await axios.get("http://localhost:7777/votes/myVotes", {
            withCredentials: true,
          });
          // Filter only those voted IDs matching the answers on this page
          const answerIds = answers.map((a) => a._id);
          const votedAnswerIds = (res.data.votedPostIds || []).filter((id) =>
            answerIds.includes(id)
          );
          setVotedAnswers(votedAnswerIds);
        } catch (error) {
          console.error("Error fetching user votes for answers:", error);
        }
      }
    };
    fetchUserVotesForAnswers();
  }, [answers]);

  // Answer upvote handler with optimistic update and toggle functionality
  const handleUpvoteAnswer = async (answerId) => {
    const alreadyVoted = votedAnswers.includes(answerId);

    // Optimistically update the vote count for this answer.
    setAnswers((prev) =>
      prev.map((a) =>
        a._id === answerId
          ? {
              ...a,
              votes: alreadyVoted
                ? Math.max((a.votes || 1) - 1, 0)
                : (a.votes || 0) + 1,
            }
          : a
      )
    );

    try {
      // Toggle vote via API call.
      const response = await axios.post(
        `http://localhost:7777/votes/${answerId}`,
        {},
        { withCredentials: true }
      );
      const updatedVotes = response.data.votes;

      // Update vote count with backend value.
      setAnswers((prev) =>
        prev.map((a) =>
          a._id === answerId ? { ...a, votes: updatedVotes } : a
        )
      );

      // Update local vote state.
      if (alreadyVoted) {
        setVotedAnswers((prev) => prev.filter((id) => id !== answerId));
      } else {
        setVotedAnswers((prev) => [...prev, answerId]);
      }
    } catch (error) {
      console.error("Error toggling vote:", error);
      // Revert optimistic update on error.
      setAnswers((prev) =>
        prev.map((a) =>
          a._id === answerId
            ? {
                ...a,
                votes: alreadyVoted
                  ? (a.votes || 0) + 1
                  : Math.max((a.votes || 1) - 1, 0),
              }
            : a
        )
      );
    }
  };

  if (!question) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {grpID && (
        <button
          onClick={() => navigate(`/viewgroup/${grpID}`)}
          className="text-sm text-green-700 hover:underline"
        >
          ← Back to Group
        </button>
      )}
      <div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          {question.title}
        </h1>
        <p className="text-gray-700">{question.content}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Answers</h2>
        {answers.map((answer) => (
          <div
            key={answer._id}
            className="bg-white border rounded p-4 shadow hover:shadow-md transition mb-6"
          >
            <p className="text-gray-800">{answer.content}</p>
            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={() => handleUpvoteAnswer(answer._id)}
                className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition ${
                  votedAnswers.includes(answer._id)
                    ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                    : "border-green-500 text-green-600 hover:bg-green-50"
                }`}
              >
                <Icon path={mdiThumbUpOutline} size={0.8} />
                {votedAnswers.includes(answer._id)
                  ? "Undo Upvote"
                  : "Upvote"}
              </button>
              <span className="text-sm text-gray-600">
                {answer.votes || 0} vote{(answer.votes || 0) !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Render the CommentSection component for this answer */}
            <CommentSection answerId={answer._id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
