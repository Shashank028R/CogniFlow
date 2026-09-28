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

  return (
    <div
      onClick={() => setSelectedChat(room)}
      className={`
        flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer
        transition-all duration-300 ease-out hover:-translate-y-[2px]
        w-[calc(100%-12px)] mx-auto mb-3
        ${
          selectedChat?._id === room._id
            ? "bg-[var(--bg)] shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_15px_#3b82f64d] scale-[0.98]" 
            : unreadCount > 0
            ? "bg-[var(--card)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] border-l-4 border-blue-500"
            : "bg-[var(--card)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)]"
        }
      `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative">
          <Avatar
            src={room.isGroupChat ? (room.profilePic || "/RoomChat.png") : otherUser?.profilePic}
            text={
              !room.isGroupChat
                ? otherUser?.username?.charAt(0).toUpperCase()
                : ""
            }
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--card)] rounded-full"></div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <p className={`truncate ${unreadCount > 0 ? "font-bold text-[var(--text)]" : "font-medium text-[var(--text)]"}`}>
            {room.isGroupChat ? room.name : otherUser?.username}
          </p>

          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {room.lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-xs px-2.5 py-1 rounded-full min-w-[24px] text-center shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse font-bold border border-blue-300/30">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default RoomCard;