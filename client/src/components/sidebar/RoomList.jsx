import RoomCard from "./RoomCard";

const RoomList = ({ isLoading, rooms, currentUserId, selectedChat, setSelectedChat, getUnreadCount, onlineUsers }) => {
  if (isLoading) {
    return <p className="text-center text-gray-500">Loading chats...</p>;
  }

  if (rooms.length === 0) {
    return <p className="text-center text-gray-500">No chats yet</p>;
  }

  return rooms.map((room) => (
    <RoomCard
      key={room._id}
      room={room}
      currentUserId={currentUserId}
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
      getUnreadCount={getUnreadCount}
      onlineUsers={onlineUsers}
    />
  ));
};

export default RoomList;
