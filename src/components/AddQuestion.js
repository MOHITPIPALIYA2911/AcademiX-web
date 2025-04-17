// src/components/AddQuestion.js
import React, { useState } from "react";
import axios from "axios";

const AddQuestion = ({ groupId = null, isPublic = false, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        content: content.trim(),
        post_type: "question",
        groupId,         // will be null for public
        is_public: isPublic,
      };
      const res = await axios.post(
        "http://localhost:7777/posts",
        payload,
        { withCredentials: true }
      );
      // clear form
      setTitle("");
      setContent("");
      // notify parent to refresh list or navigate
      onSuccess(res.data.post);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "An error occurred while creating your question."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-lg p-4 shadow mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Ask a Question
      </h3>

      <label className="block mb-2">
        <span className="text-sm font-medium text-gray-700">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a short, descriptive title"
          className="mt-1 block w-full border rounded p-2 text-sm"
          required
        />
      </label>

      <label className="block mb-2">
        <span className="text-sm font-medium text-gray-700">Details</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Describe your question in detail..."
          className="mt-1 block w-full border rounded p-2 text-sm resize-none"
          required
        />
      </label>

      {error && (
        <p className="text-sm text-red-600 mb-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`px-4 py-2 rounded text-white transition ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {submitting ? "Posting..." : "Post Question"}
      </button>
    </form>
  );
};

export default AddQuestion;
