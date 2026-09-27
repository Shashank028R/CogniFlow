import React from "react";
import Avatar from "../ui/Avatar";

const RoomCard = ({
  room,
  currentUserId,
  selectedChat,
  setSelectedChat,
  getUnreadCount,
  onlineUsers = []
}) => {
  const getOtherUser = (members) =>
    members.find((m) => m._id !== currentUserId);

  const otherUser = !room.isGroupChat ? getOtherUser(room.members) : null;
  const unreadCount = getUnreadCount ? getUnreadCount(room._id) : 0;
  
  const isOnline = !room.isGroupChat && otherUser && onlineUsers.includes(otherUser._id);
  const isSelected = selectedChat?._id === room._id;

  return (
    <div
      onClick={() => setSelectedChat(room)}
      className={`
        flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer
        transition-colors duration-150 w-full mb-1
        ${
          isSelected
            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800/60"
            : unreadCount > 0
            ? "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80"
            : "hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
        }
      `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative flex-shrink-0">
          <Avatar
            src={room.isGroupChat ? (room.profilePic || "/RoomChat.png") : otherUser?.profilePic}
            text={
              !room.isGroupChat
                ? otherUser?.username?.charAt(0).toUpperCase()
                : room.name?.charAt(0).toUpperCase()
            }
            size="w-10 h-10"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <p className={`text-sm truncate ${unreadCount > 0 || isSelected ? "font-semibold text-slate-900 dark:text-slate-100" : "font-medium text-slate-700 dark:text-slate-300"}`}>
            {room.isGroupChat ? room.name : otherUser?.username}
          </p>

          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {room.lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="bg-blue-600 text-white text-[11px] px-2 py-0.5 rounded-full min-w-[20px] text-center font-semibold flex-shrink-0">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default RoomCard;