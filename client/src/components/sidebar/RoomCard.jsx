import Avatar from "../ui/Avatar";

const RoomCard = ({ room, currentUserId }) => {
  const getOtherUser = (members) =>
    members.find((m) => m._id !== currentUserId);

  const otherUser = !room.isGroupChat ? getOtherUser(room.members) : null;

  return (
    <div
      onClick={() => onSelect(room)}
      className="
        flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-[#f5f7fa]
      transition-all duration-300 hover:translate-y-[1px] active:scale-[0.97]
      shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] w-[calc(100%-4px)]
      "
    >
      <Avatar
        src={room.isGroupChat ? "/RoomChat.png" : null}
        text={
          !room.isGroupChat ? otherUser?.username?.charAt(0).toUpperCase() : ""
        }
      />

      <div className="flex flex-col">
        <p className="font-medium text-gray-900">
          {room.isGroupChat ? room.name : otherUser?.username}
        </p>

        <p className="text-xs text-gray-500">
          {room.lastMessage?.content || "No messages yet"}
        </p>
      </div>
    </div>
  );
};

export default RoomCard;
