import React, { useState } from "react";
import axios from "axios";

const AddAnswer = ({ questionId, onSuccess }) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = content.trim();
    if (!trimmed) {
      setError("Answer content is required");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `http://localhost:7777/posts/${questionId}/answer`,
        { content: trimmed },
        { withCredentials: true }
      );
      setContent("");
      onSuccess(data.answer);
    } catch (err) {
      console.error("Error posting answer:", err);
      setError(
        err.response?.data?.error ||
          "An error occurred while posting your answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border rounded p-4 mb-6"
    >
      <h3 className="text-lg font-medium text-gray-800 mb-2">Your Answer</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full border rounded p-2 text-sm resize-none"
        placeholder="Type your answer here..."
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded text-white transition ${
            submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {submitting ? "Posting..." : "Post Answer"}
        </button>
      </div>
    </form>
  );
};

export default AddAnswer;
