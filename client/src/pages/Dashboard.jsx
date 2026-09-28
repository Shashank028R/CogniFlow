import React, { useState } from "react";
import RoomSideBar from "../components/sidebar/Sidebar";
import ChatContainer from "../components/chat/ChatContainer";

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`
          ${selectedChat ? "hidden md:flex" : "flex"}
          w-full md:w-[450px] h-full
          p-3 md:p-5 md:pr-0
          transition-all duration-300
        `}
      >
        <RoomSideBar
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setOnlineUsers={setOnlineUsers}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* CHAT AREA */}
      <div
        className={`
          ${selectedChat ? "flex" : "hidden md:flex"}
          flex-1 items-center justify-center p-3 md:p-5
          transition-all duration-300
        `}
      >
        {!selectedChat ? (
          <div
            className="p-10 rounded-[18px] text-center bg-white dark:bg-[#1d1d1f]
            border border-[#e0e0e0] dark:border-[#333336]
            max-w-md w-full animate-[fadeIn_0.3s_ease]"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] flex items-center justify-center">
              <svg className="w-7 h-7 text-[#0066cc] dark:text-[#2997ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h2 className="text-[21px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
              Welcome to <span className="text-[#0066cc] dark:text-[#2997ff]">CogniFlow</span>
            </h2>

            <p className="mt-2 text-sm text-[#86868b] leading-relaxed">
              Select a conversation from the sidebar to start messaging in real time.
            </p>
          </div>
        ) : (
          <div
            className="w-full h-full max-w-5xl
            animate-[slideIn_0.3s_ease]"
          >
            <ChatContainer
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              onlineUsers={onlineUsers}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
