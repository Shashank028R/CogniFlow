import React, { useState, useEffect, useRef } from "react";
import Avatar from "../ui/Avatar";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";

const EndPoint = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const ChatContainer = ({ selectedChat, setSelectedChat }) => {
  const BackendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const currentUserId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(EndPoint);

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
    });

    socketRef.current.on("message received", (msg) => {
      const roomId = msg.room._id || msg.room;

      if (selectedChat && selectedChat._id === roomId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });

    return () => socketRef.current.disconnect();
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);

        const { data } = await axios.get(
          `${BackendUrl}/api/messages/${selectedChat._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setMessages(data);
        socketRef.current?.emit("join chat", selectedChat._id);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat, BackendUrl, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/messages`,
        {
          content: newMessage,
          roomId: selectedChat._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setNewMessage("");

      const textarea = document.getElementById("chat-textarea");
      if (textarea) textarea.style.height = "auto";

      setMessages((prev) => [...prev, data]);
      socketRef.current?.emit("new message", data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    }
  };

  const getChatName = () => {
    if (selectedChat.isGroupChat) return selectedChat.name;
    const otherUser = selectedChat.members.find((m) => m._id !== currentUserId);
    return otherUser ? otherUser.username : "Unknown User";
  };

  return (
    <div className="flex flex-col w-full h-full max-w-5xl bg-[#f5f7fa] rounded-3xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between p-4 bg-[#f5f7fa] shadow-[0_4px_10px_rgba(0,0,0,0.05)] z-10">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-blue-600 font-bold hover:scale-110 transition-transform cursor-pointer"
            onClick={() => setSelectedChat(null)}
          >
            ←
          </button>

          <Avatar
            src={selectedChat.isGroupChat ? "/RoomChat.png" : null}
            text={
              !selectedChat.isGroupChat
                ? getChatName().charAt(0).toUpperCase()
                : ""
            }
          />

          <h2 className="text-lg font-semibold text-gray-900">
            {getChatName()}
          </h2>
        </div>

        <button className="text-gray-500 hover:text-blue-600 font-bold px-3 py-1 rounded-xl shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] transition-all cursor-pointer">
          ⋮
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {loadingMessages ? (
          <p className="text-center text-gray-400 mt-10 animate-pulse text-sm">
            Loading chat history...
          </p>
        ) : (
          messages.map((m) => {
            const senderId = m.sender?._id || m.sender?.id;
            const isMyMessage = String(senderId) === String(currentUserId);

            return (
              <div
                key={m._id}
                className={`flex w-full ${isMyMessage ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%] flex flex-col">
                  {!isMyMessage && selectedChat.isGroupChat && (
                    <span className="text-xs text-gray-500 ml-2 mb-1">
                      {m.sender.username}
                    </span>
                  )}

                  <div
                    className={`px-4 py-3 text-sm shadow-sm ${
                      isMyMessage
                        ? "bg-blue-500 text-white rounded-2xl rounded-tr-none shadow-[4px_4px_10px_rgba(37,99,235,0.2)]"
                        : "bg-white text-gray-800 rounded-2xl rounded-tl-none shadow-[4px_4px_10px_#d1d9e6]"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-[#f5f7fa] flex items-end gap-3 z-10 border-t border-gray-200/50">
        <button className="w-10 h-10 mb-1 flex-shrink-0 flex items-center justify-center rounded-full text-blue-600 font-bold shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:scale-105 transition-all cursor-pointer">
          +
        </button>

        <textarea
          id="chat-textarea"
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-xl border-none outline-none bg-[#f5f7fa] text-gray-800 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] transition-all resize-none overflow-hidden"
          style={{ minHeight: "48px" }}
        />

        <button
          onClick={handleSubmit}
          className="w-10 h-10 mb-1 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:bg-blue-600 hover:scale-105 transition-all cursor-pointer"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
