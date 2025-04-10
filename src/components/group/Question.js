import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { mdiThumbUpOutline, mdiReply } from "@mdi/js";
import Icon from "@mdi/react";

const Question = () => { 
  const { qid, grpID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const groupId = location.state?.groupId;

  const [answers, setAnswers] = useState([
    {
      id: "a1",
      content: "Use a recursive CommentTree component with tree-structured data!",
      votes: 7,
      comments: [
        {
          id: "c1",
          text: "Can you give an example?",
          replies: [
            {
              id: "c2",
              text: "Sure! Just call the component inside itself.",
              replies: [
                {
                  id: "c3",
                  text: "Ah! That makes sense now.",
                  replies: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  const [mainComment, setMainComment] = useState("");
  const [showMainInput, setShowMainInput] = useState(false);
  const [replyBoxOpen, setReplyBoxOpen] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [votedAnswers, setVotedAnswers] = useState([]);

  const question = {
    id: qid,
    title: "How to build a nested comment system in React?",
    description:
      "I'm trying to allow threaded discussions inside my app like Reddit or GitHub discussions. What's the best data model and rendering strategy?",
  };

  const handleUpvote = (answerId) => {
    if (votedAnswers.includes(answerId)) return;
    setAnswers((prev) =>
      prev.map((a) =>
        a.id === answerId ? { ...a, votes: (a.votes || 0) + 1 } : a
      )
    );
    setVotedAnswers([...votedAnswers, answerId]);
  };

  const handleReplyInputChange = (commentId, value) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  const handlePostReply = (parentId) => {
    const inputValue = replyInputs[parentId]?.trim();
    if (!inputValue) return;

    const newReply = {
      id: `r-${Date.now()}`,
      text: inputValue,
      replies: [],
    };

    const updateReplies = (comments) =>
      comments.map((c) => {
        if (c.id === parentId) {
          return { ...c, replies: [...c.replies, newReply] };
        }
        return { ...c, replies: updateReplies(c.replies || []) };
      });

    setAnswers((prev) =>
      prev.map((a) => ({
        ...a,
        comments: updateReplies(a.comments),
      }))
    );

    setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
    setReplyBoxOpen((prev) => ({ ...prev, [parentId]: false }));
  };

  const handlePostMainComment = () => {
    if (!mainComment.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      text: mainComment.trim(),
      replies: [],
    };

    setAnswers((prev) =>
      prev.map((a, i) =>
        i === 0 ? { ...a, comments: [...a.comments, newComment] } : a
      )
    );

    setMainComment("");
    setShowMainInput(false);
  };

  const CommentTree = ({ comments }) => {
    if (!comments?.length) return null;

    return (
      <ul className="ml-4 border-l pl-4 mt-2 space-y-3">
        {comments.map((c) => (
          <li key={c.id}>
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-800">{c.text}</p>
              <button
                onClick={() =>
                  setReplyBoxOpen((prev) => ({
                    ...prev,
                    [c.id]: !prev[c.id],
                  }))
                }
                className="text-xs text-gray-500 hover:text-green-600 flex items-center gap-1 ml-2"
              >
                <Icon path={mdiReply} size={0.6} />
                Reply
              </button>
            </div>

            {replyBoxOpen[c.id] && (
              <div className="mt-2 ml-2 space-y-1">
                <textarea
                  value={replyInputs[c.id] || ""}
                  onChange={(e) =>
                    handleReplyInputChange(c.id, e.target.value)
                  }
                  className="w-full border rounded p-2 text-sm resize-none"
                  rows={2}
                  placeholder="Write a reply..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePostReply(c.id)}
                    className={`text-sm px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700 transition ${
                      !(replyInputs[c.id]?.trim()) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!replyInputs[c.id]?.trim()}
                  >
                    Post
                  </button>
                  <button
                    onClick={() =>
                      setReplyBoxOpen((prev) => ({
                        ...prev,
                        [c.id]: false,
                      }))
                    }
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <CommentTree comments={c.replies} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* ✅ Back Button */}
      {grpID && (
        <button
        onClick={() => navigate(`/viewgroup/${grpID}`)}
          className="text-sm text-green-700 hover:underline"
        >
          ← Back to Group
        </button>
      )}
      <div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">{question.title}</h1>
        <p className="text-gray-700">{question.description}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Answers</h2>
        {answers.map((answer) => (
          <div
            key={answer.id}
            className="bg-white border rounded p-4 shadow hover:shadow-md transition mb-6"
          >
            <p className="text-gray-800">{answer.content}</p>

            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={() => handleUpvote(answer.id)}
                className={`flex items-center gap-1 text-sm px-3 py-1 rounded border transition ${
                  votedAnswers.includes(answer.id)
                    ? "border-gray-300 text-gray-400"
                    : "border-green-500 text-green-600 hover:bg-green-50"
                }`}
              >
                <Icon path={mdiThumbUpOutline} size={0.8} />
                Upvote
              </button>
              <span className="text-sm text-gray-600">
                {answer.votes || 0} vote{(answer.votes || 0) !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Comments */}
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Comments</h4>
              <CommentTree comments={answer.comments} />

              {/* Main comment box */}
              {showMainInput ? (
                <div className="mt-3 space-y-1">
                  <textarea
                    value={mainComment}
                    onChange={(e) => setMainComment(e.target.value)}
                    rows={3}
                    className="w-full border rounded p-2 text-sm resize-none"
                    placeholder="Write a comment..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handlePostMainComment}
                      className={`text-sm px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700 transition ${
                        !mainComment.trim() ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!mainComment.trim()}
                    >
                      Post
                    </button>
                    <button
                      onClick={() => {
                        setShowMainInput(false);
                        setMainComment("");
                      }}
                      className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowMainInput(true)}
                  className="text-sm text-green-600 hover:underline mt-2"
                >
                  Add a comment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
