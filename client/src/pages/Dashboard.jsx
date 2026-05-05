import React, { useState } from "react";
import RoomSideBar from "../components/sidebar/Sidebar";
import ChatContainer from "../components/chat/ChatContainer";

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen bg-[#eef2f7] overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`
          ${selectedChat ? "hidden md:block" : "block"}
          w-full md:w-[450px]
          transition-all duration-300
        `}
      >
        <RoomSideBar
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
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
            className="p-10 rounded-2xl text-center bg-[#eef2f7]
            shadow-[8px_8px_18px_#d1d9e6,-8px_-8px_18px_#ffffff]
            animate-[fadeIn_0.5s_ease]"
          >
            <h2 className="text-xl font-semibold text-gray-900">
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
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
