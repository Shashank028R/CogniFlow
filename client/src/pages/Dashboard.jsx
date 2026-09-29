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
          w-full md:w-[360px] lg:w-[390px] h-full
          p-2 md:p-3 md:pr-0
          transition-all duration-200
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
          flex-1 items-center justify-center p-2 md:p-3
          transition-all duration-200
        `}
      >
        {!selectedChat ? (
          <div
            className="p-8 rounded-2xl text-center bg-[var(--card)]/80 backdrop-blur-xl
            shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]
            animate-[fadeIn_0.3s_ease] border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center max-w-sm mx-4"
          >
            <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-2.5 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shadow-xs">
              <img src="/images/CogniFlow.png" alt="CogniFlow Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Welcome to <span className="text-blue-600">CogniFlow</span>
            </h2>

            <p className="mt-2 text-gray-500">
              Select a chat to start messaging 🚀
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
