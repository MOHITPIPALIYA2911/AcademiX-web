import React, { useEffect, useRef, useState } from "react";
import bgImage from "../../assets/public-discussion-bg.png";

const PublicDiscussion = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const chatEndRef = useRef(null);
  const username = localStorage.getItem("username") || "You";

  useEffect(() => {
    // Add two dummy messages initially
    setMessages([
      {
        user: "Alice",
        text: "Hey everyone! Excited to connect 👋",
        timestamp: new Date().toISOString(),
      },
      {
        user: username,
        text: "Hey Alice! Welcome to the discussion 👏",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [username]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    ws.current.onopen = () => {
      console.log("Connected to public discussion WebSocket");
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      user: username,
      text: input,
      timestamp: new Date().toISOString(),
    };

    ws.current.send(JSON.stringify(msg));
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 py-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-4xl mx-auto bg-white/80 rounded-xl shadow-lg backdrop-blur-md p-6 flex flex-col h-[80vh]">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          🌍 Public Discussion
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.user === username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-xl shadow ${
                  msg.user === username
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm font-semibold">{msg.user}</p>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-l-lg border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-6 py-2 rounded-r-lg hover:bg-green-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicDiscussion;
