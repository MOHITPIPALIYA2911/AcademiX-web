import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mdiThumbUpOutline } from "@mdi/js";
import Icon from "@mdi/react";
import axios from "axios";
import { useSelector } from "react-redux";

const GroupQA = ({ title, isPublic, groupId }) => {
  const navigate = useNavigate();
  const { grpID } = useParams();
  const user = useSelector((store) => store.user);

  const [questions, setQuestions] = useState([]);
  // votedIds will store the IDs of posts the user has voted on.
  const [votedIds, setVotedIds] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Toggle the vote (upvote or undo upvote)
  const handleUpvote = async (id) => {
    const alreadyVoted = votedIds.includes(id);

    // Optimistically update the vote count
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
      const response = await axios.post(
        `http://localhost:7777/votes/${id}`,
        {},
        { withCredentials: true }
      );
      const updatedVotes = response.data.votes;

      // Update the vote count from the backend response
      setQuestions((prev) =>
        prev.map((q) =>
          (q._id || q.id) === id ? { ...q, votes: updatedVotes } : q
        )
      );

      // Toggle the vote state locally
      if (alreadyVoted) {
        setVotedIds((prev) => prev.filter((voteId) => voteId !== id));
      } else {
        setVotedIds((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Error toggling vote:", error);
      // Revert the optimistic update on error
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

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Fetch public questions from backend, then fetch user's vote status.
  const fetchingPublicQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:7777/posts/public", {
        withCredentials: true,
      });
      const data = res.data || [];
      setQuestions(data);

      // Collect post IDs and then fetch which ones the user has already voted on.
      const postIds = data.map((q) => q._id || q.id);
      await fetchUserVotes(postIds);
    } catch (error) {
      console.error("Error fetching public questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchingPrivateQuestions=async()=>{
    console.log("fetching posts questions from this group ==> ",groupId);
    try {
      const res = await axios.get(`http://localhost:7777/posts/private/${groupId}`, {
        withCredentials: true,
      });
      const data = res.data || [];
      setQuestions(data);

      // Collect post IDs and then fetch which ones the user has already voted on.
      const postIds = data.map((q) => q._id || q.id);
      await fetchUserVotes(postIds);
    } catch (error) {
      console.error("Error fetching public questions:", error);
    } finally {
      setIsLoading(false);
    }

  }

  const fetchUserVotes = async () => {
    try {
      const res = await axios.get("http://localhost:7777/votes/myVotes", {
        withCredentials: true,
      });
      setVotedIds(res.data.votedPostIds || []);
    } catch (error) {
      console.error("Error fetching user votes:", error);
    }
  };

  useEffect(() => {
    if (isPublic && user) {
      fetchingPublicQuestions();
    }
    else if(!isPublic && user ){
      fetchingPrivateQuestions();
    }
  }, [isPublic, groupId, user]);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-green-700">{title}</h2>

      {isLoading ? (
        <>loading here ...</>
      ) : (
        <div>
          {questions.length === 0 ? (
            <p className="text-gray-500">No questions available.</p>
          ) : (
            questions.map((q) => {
              const questionId = q._id || q.id;
              const description = q.description || "";
              // Check if the user has voted on this post based on votedIds state.
              const hasVoted = votedIds.includes(questionId);

              return (
                <div
                  key={questionId}
                  onClick={() =>
                    navigate(`/publicdiscussion/question/${questionId}`)
                  }
                  className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer m-3"
                >
                  <h3 className="text-lg font-semibold text-green-700">
                    {q.title}
                  </h3>

                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                    {expanded[questionId] || description.length <= 150
                      ? description
                      : description.slice(0, 150) + "..."}
                    {description.length > 150 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(questionId);
                        }}
                        className="text-green-600 cursor-pointer hover:underline ml-2"
                      >
                        {expanded[questionId] ? "Show less" : "Read more"}
                      </span>
                    )}
                  </p>

                  <div
                    className="mt-4 flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleUpvote(questionId)}
                      className={`flex items-center gap-1 px-3 py-1 border text-sm rounded-md transition ${
                        // Button color changes if the user has already voted.
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
      )}
    </div>
  );
};

export default GroupQA;
