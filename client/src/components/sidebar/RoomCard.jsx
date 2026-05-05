import Avatar from "../ui/Avatar";

const RoomCard = ({
  room,
  currentUserId,
  selectedChat,
  setSelectedChat,
  getUnreadCount,
}) => {
  const getOtherUser = (members) =>
    members.find((m) => m._id !== currentUserId);

  const otherUser = !room.isGroupChat ? getOtherUser(room.members) : null;
  const unreadCount = getUnreadCount ? getUnreadCount(room._id) : 0;

  return (
    <div
      onClick={() => setSelectedChat(room)}
      className={`
        flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer
        transition-all duration-300 ease-out hover:-translate-y-[1px]
        w-[calc(100%-4px)] mx-auto
        ${
          selectedChat?._id === room._id
            ? "bg-blue-50 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff]" 
            : unreadCount > 0
            ? "bg-blue-50 border-l-4 border-blue-500 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff]"
            : "bg-[#f5f7fa] shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff]"
        }
      `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar
          src={room.isGroupChat ? "/RoomChat.png" : null}
          text={
            !room.isGroupChat
              ? otherUser?.username?.charAt(0).toUpperCase()
              : ""
          }
        />

        <div className="flex flex-col overflow-hidden">
          <p className={`truncate ${unreadCount > 0 ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>
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
        <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center shadow-sm animate-pulse">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default RoomCard;