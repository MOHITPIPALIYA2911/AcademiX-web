import React, { useEffect, useRef, useState } from "react";

const GroupDiscussion = ({ groupId }) => {
  const [messages, setMessages] = useState([
    {
      sender: "Alice",
      content: "Hey! Is the meeting still on for tomorrow?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      sender: "Bob",
      content: "Yup, 10 AM sharp. Don’t be late 😄",
      timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
    },
    {
      sender: "Clara",
      content: "Should we prepare slides for the frontend part?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      sender: "You",
      content: "Just pushed the UI update on GitHub!",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
    },
    {
      sender: "You",
      content: "Anyone reviewed it yet?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
    },
  ]);

  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!msg.trim()) return;

    const messageData = {
      groupId,
      sender: "You",
      content: msg.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageData]);
    setMsg("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return isToday
      ? formattedTime
      : `${date.toLocaleDateString()} ${formattedTime}`;
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[80vh] bg-white rounded shadow border">
      {/* Header */}
      <div className="p-4 border-b bg-green-50 text-green-700 font-semibold text-lg">
        Group Discussion
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 text-sm shadow ${
                m.sender === "You"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border rounded-bl-none"
              }`}
            >
              <p className="mb-1">{m.content}</p>
              <div className="text-[11px] text-right opacity-70">
                {m.sender !== "You" && <span className="mr-2">{m.sender}</span>}
                {formatTime(m.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-white flex gap-3">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={!msg.trim()}
          className={`px-5 py-2 rounded-md text-sm font-medium text-white transition ${
            msg.trim()
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-300 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupDiscussion;
