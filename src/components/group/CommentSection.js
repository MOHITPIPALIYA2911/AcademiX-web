import React, { useState, useEffect } from "react";
import axios from "axios";
import { mdiReply } from "@mdi/js";
import Icon from "@mdi/react";

// Helper component for rendering nested (threaded) comments recursively.
const CommentTree = ({
  comments,
  onReplyClick,
  openReplies,
  replyInput,
  handleReplyChange,
  handlePostReply,
}) => {
  if (!comments || comments.length === 0) return null;

  return (
    <ul className="ml-4 border-l pl-4 mt-2 space-y-3">
      {comments.map((comment) => (
        <li key={comment._id || comment.id}>
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-800">
              {comment.deleted ? "Deleted Comment" : comment.content}
            </p>
            <button
              onClick={() => onReplyClick(comment)}
              className="text-xs text-gray-500 hover:text-green-600 flex items-center gap-1 ml-2"
            >
              <Icon path={mdiReply} size={0.6} />
              Reply
            </button>
          </div>
          {openReplies && openReplies[comment._id || comment.id] && (
            <div className="mt-2 ml-2 space-y-1">
              <textarea
                value={replyInput[comment._id || comment.id] || ""}
                onChange={(e) =>
                  handleReplyChange(comment._id || comment.id, e.target.value)
                }
                className="w-full border rounded p-2 text-sm resize-none"
                rows={2}
                placeholder="Write a reply..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handlePostReply(comment)}
                  className={`text-sm px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700 transition ${
                    !(replyInput[comment._id || comment.id]?.trim())
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!replyInput[comment._id || comment.id]?.trim()}
                >
                  Post
                </button>
                <button
                  onClick={() =>
                    onReplyClick(comment, true) // pass extra param to close reply box
                  }
                  className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* Render nested replies */}
          <CommentTree
            comments={comment.replies}
            onReplyClick={onReplyClick}
            openReplies={openReplies}
            replyInput={replyInput}
            handleReplyChange={handleReplyChange}
            handlePostReply={handlePostReply}
          />
        </li>
      ))}
    </ul>
  );
};

const CommentSection = ({ answerId }) => {
  const [comments, setComments] = useState([]);
  const [openReplies, setOpenReplies] = useState({}); // tracks open reply boxes per comment
  const [replyInput, setReplyInput] = useState({}); // tracks reply inputs per comment
  const [newComment, setNewComment] = useState(""); // new top-level comment input

  // Fetch comments for this answer
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7777/comments/${answerId}`,
          { withCredentials: true }
        );
        // Optionally, process the flat list into a nested structure here.
        // For simplicity, assume the backend returns a flat array and we do a basic nesting:
        const nestedComments = buildNestedComments(res.data);
        setComments(nestedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [answerId]);

  // Utility function: convert flat list of comments to nested threaded structure
  const buildNestedComments = (flatComments) => {
    const commentMap = {};
    const nested = [];

    // Initialize map
    flatComments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment._id] = comment;
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = commentMap[comment.parent_comment_id];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        nested.push(comment);
      }
    });
    return nested;
  };

  // Toggle reply box open/close for a comment
  const handleReplyClick = (comment, close = false) => {
    setOpenReplies((prev) => ({
      ...prev,
      [comment._id || comment.id]: close ? false : !prev[comment._id || comment.id],
    }));
    if (close) {
      setReplyInput((prev) => ({ ...prev, [comment._id || comment.id]: "" }));
    }
  };

  // Handle reply input change for a comment
  const handleReplyChange = (commentId, value) => {
    setReplyInput((prev) => ({ ...prev, [commentId]: value }));
  };

  // Post a reply to a comment
  const handlePostReply = async (parentComment) => {
    const commentId = parentComment._id || parentComment.id;
    const content = replyInput[commentId]?.trim();
    if (!content) return;

    try {
      // Call your POST endpoint. This supports nested replies.
      const res = await axios.post(
        `http://localhost:7777/comments/${answerId}`,
        { content, parent_comment_id: commentId },
        { withCredentials: true }
      );
      // On success, add the new reply to the comments tree.
      // For simplicity, re-fetch the comments (or merge the new reply manually).
      const updated = await axios.get(
        `http://localhost:7777/comments/${answerId}`,
        { withCredentials: true }
      );
      setComments(buildNestedComments(updated.data));
      // Close and clear reply input.
      setOpenReplies((prev) => ({ ...prev, [commentId]: false }));
      setReplyInput((prev) => ({ ...prev, [commentId]: "" }));
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  // Post a new top-level comment
  const handlePostNewComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:7777/comments/${answerId}`,
        { content: newComment },
        { withCredentials: true }
      );
      // Re-fetch comments on success.
      const updated = await axios.get(
        `http://localhost:7777/comments/${answerId}`,
        { withCredentials: true }
      );
      setComments(buildNestedComments(updated.data));
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-700">Comments</h4>

      {/* Render the threaded comment tree */}
      <CommentTree
        comments={comments}
        onReplyClick={handleReplyClick}
        openReplies={openReplies}
        replyInput={replyInput}
        handleReplyChange={handleReplyChange}
        handlePostReply={handlePostReply}
      />

      {/* New top-level comment input */}
      <div className="mt-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full border rounded p-2 text-sm resize-none"
          placeholder="Write a comment..."
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handlePostNewComment}
            className={`text-sm px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700 transition ${
              !newComment.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
