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
        flex items-center justify-between gap-2.5 p-2 rounded-xl cursor-pointer
        transition-colors duration-150 ease-out
        w-full mb-1
        ${
          isSelected
            ? "bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/25 shadow-xs" 
            : unreadCount > 0
            ? "bg-slate-50 dark:bg-slate-800/40 border-l-2 border-blue-500 hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
            : "bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 border border-transparent"
        }
      `}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="relative flex-shrink-0">
          <Avatar
            size="w-9 h-9"
            src={room.isGroupChat ? (room.profilePic || "/images/RoomChat.png") : otherUser?.profilePic}
            text={
              !room.isGroupChat
                ? otherUser?.username?.charAt(0).toUpperCase()
                : ""
            }
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <p className={`truncate text-sm ${isSelected ? "font-semibold text-blue-600 dark:text-blue-400" : unreadCount > 0 ? "font-semibold text-[var(--text)]" : "font-medium text-[var(--text)]"}`}>
            {room.isGroupChat ? room.name : otherUser?.username}
          </p>

          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? "text-blue-600 font-medium"
                : "text-slate-500"
            }`}
          >
            {room.lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center font-bold shadow-xs">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default RoomCard;