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
        flex items-center justify-between gap-3 p-3 rounded-[14px] cursor-pointer
        transition-all duration-150 ease-out active:scale-[0.98]
        w-full mb-1.5 border
        ${
          isSelected
            ? "bg-white dark:bg-[#272729] border-[#0066cc] dark:border-[#2997ff]" 
            : "bg-transparent hover:bg-white/60 dark:hover:bg-[#272729]/60 border-transparent hover:border-[#e0e0e0] dark:hover:border-[#333336]"
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
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#34c759] border-2 border-white dark:border-[#272729] rounded-full"></div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden text-left">
          <p className={`truncate text-[15px] ${unreadCount > 0 ? "font-semibold text-[#1d1d1f] dark:text-white" : "font-normal text-[#1d1d1f] dark:text-[#f5f5f7]"}`}>
            {room.isGroupChat ? room.name : otherUser?.username}
          </p>

          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? "text-[#0066cc] dark:text-[#2997ff] font-medium"
                : "text-[#86868b]"
            }`}
          >
            {room.lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="bg-[#0066cc] text-white text-[11px] px-2 py-0.5 rounded-full min-w-[20px] text-center font-semibold">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default RoomCard;