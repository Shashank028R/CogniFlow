import React, { useState } from "react";
import RoomSideBar from "../components/sidebar/Sidebar";
import ChatContainer from "../components/chat/ChatContainer";
import { MessageSquare, Bot, Shield, Sparkles } from "lucide-react";

const Dashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`
          ${selectedChat ? "hidden md:flex" : "flex"}
          w-full md:w-[380px] lg:w-[420px] h-full
          p-3 md:p-4 md:pr-0
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
          flex-1 items-center justify-center p-3 md:p-4
          transition-all duration-200
        `}
      >
        {!selectedChat ? (
          <div className="p-8 sm:p-12 rounded-2xl text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-md w-full animate-[fadeIn_0.2s_ease]">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <MessageSquare size={24} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Welcome to <span className="text-blue-600 dark:text-blue-400">CogniFlow</span>
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Select an existing conversation from the sidebar or start a new direct or group chat.
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <Bot size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>CogniBot AI</span>
                </div>
                <p className="text-[11px] text-slate-400">Tag @cogni in any chat for instant answers</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <Shield size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Read Receipts</span>
                </div>
                <p className="text-[11px] text-slate-400">Sent, delivered, and read status</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full max-w-5xl animate-[fadeIn_0.2s_ease]">
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
