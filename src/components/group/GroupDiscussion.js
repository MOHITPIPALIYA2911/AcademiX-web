import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../../utils/socket";
import axios from 'axios'

const GroupDiscussion = ({ groupId }) => {
  const [messages, setMessages] = useState([]);

  const user=useSelector(store=>store.user)
  const userId=user?._id
  
  const [newMessage,setNewMessage]=useState("")

  const messagesEndRef = useRef(null);

  const fetchAllMessages=async()=>{
    const allMessages= await axios.get(`http://localhost:7777/chats/${groupId}`,{
      withCredentials:true
    })
    
    console.log("messaged from the server ")
    console.log(allMessages);

    const formattedMessages=allMessages.data.messages.map((msg)=>{
      const {user_id,content,createdAt} = msg
      return{
        userId:user_id._id,
        fullName:`${user_id.firstName} ${user_id.lastName}`,
        timestamp:createdAt,
        content
      }
    })

    //console.log(formattedMessages)
    setMessages(formattedMessages)

  }

  useEffect(()=>{
    if(groupId) fetchAllMessages()
  },[groupId])


  useEffect(() => {
    const socket = createSocketConnection();
    //groupId is hardcoded for now
    const fullName=user.firstName+" "+user?.lastName
    socket.emit("joinChat",  {fullName,groupId});
    socket.on("messageReceived",({userId,fullName,content,timestamp})=>{
      //console.log("--------------  message received from server is ==> ",content)
      setMessages((prev)=>[...prev,{userId,fullName,content,timestamp}])
      
    })
    return()=>{
      socket.disconnect()
    }
  }, [userId,groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    //console.log(newMessage);
    const socket=createSocketConnection()
    const fullName=user.firstName+" "+user?.lastName
    socket.emit("sendMessage",{
      userId,
      fullName,
      groupId,
      content:newMessage,
      timestamp:new Date()
    })
    setNewMessage("");
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
        {messages?.length>0 && userId && messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.userId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 text-sm shadow ${
                m.userId === userId
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border rounded-bl-none"
              }`}
            >
              <p className="mb-1">{m.content}</p>
              <div className="text-[11px] text-right opacity-70">
                {m.userId !== userId && <span className="mr-2">{m.fullName}</span>}
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
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className={`px-5 py-2 rounded-md text-sm font-medium text-white transition ${
            newMessage.trim()
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
