import React from "react";
import RoomCard from "./RoomCard";
import { MessageSquare } from "lucide-react";

const RoomList = ({ isLoading, rooms, currentUserId, selectedChat, setSelectedChat, getUnreadCount, onlineUsers }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-28" />
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-44" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
          <MessageSquare size={18} />
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">No conversations yet</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Search a user or create a room to start</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {rooms.map((room) => (
        <RoomCard
          key={room._id}
          room={room}
          currentUserId={currentUserId}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          getUnreadCount={getUnreadCount}
          onlineUsers={onlineUsers}
        />
      ))}
    </div>
  );
};

export default RoomList;
