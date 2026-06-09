import Message from "../models/Message.js";

const onlineUsers = {};

export const handleSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Client Connected ", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData);
      onlineUsers[socket.id] = userData;
      io.emit("get online users", Array.from(new Set(Object.values(onlineUsers))));
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined the room ", room);
    });

    socket.on("new message", (newMessage) => {
      let chat = newMessage.room;

      if (!chat.members) {
        // Fallback if members are not populated
        return socket.in(chat._id || chat).emit("message received", newMessage);
      }

      chat.members.forEach((member) => {
        if (member._id.toString() === newMessage.sender._id.toString()) return;
        socket.in(member._id.toString()).emit("message received", newMessage);
      });
    });
    socket.on("message edited", (editedMessage) => {
      let chat = editedMessage.room;
      if (!chat.members) return socket.in(chat._id || chat).emit("message edited", editedMessage);

      chat.members.forEach((member) => {
        if (member._id.toString() === editedMessage.sender._id.toString()) return;
        socket.in(member._id.toString()).emit("message edited", editedMessage);
      });
    });

    socket.on("message deleted", (deletedMessage) => {
      let chat = deletedMessage.room;
      if (!chat.members) return socket.in(chat._id || chat).emit("message deleted", deletedMessage);

      chat.members.forEach((member) => {
        if (member._id.toString() === deletedMessage.sender._id.toString()) return;
        socket.in(member._id.toString()).emit("message deleted", deletedMessage);
      });
    });

    socket.on("chat cleared", (data) => {
      // Chat clear is local, so we don't strictly need to broadcast it to others,
      // but if the user has multiple sessions, they might want to clear it across devices.
      // We will emit "chat cleared" back to their own room so other devices sync.
      socket.in(data.userId).emit("chat cleared", data.roomId);
    });

    socket.on("mark delivered", async ({ messageIds, userId, roomId }) => {
      try {
        await Message.updateMany(
          { _id: { $in: messageIds }, deliveredTo: { $ne: userId } },
          { $addToSet: { deliveredTo: userId } }
        );
        socket.in(roomId).emit("messages delivered", { messageIds, userId, roomId });
      } catch (err) {
        console.error("Error marking messages delivered:", err);
      }
    });

    socket.on("mark read", async ({ messageIds, userId, roomId }) => {
      try {
        await Message.updateMany(
          { _id: { $in: messageIds }, readBy: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );
        socket.in(roomId).emit("messages read", { messageIds, userId, roomId });
      } catch (err) {
        console.error("Error marking messages read:", err);
      }
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("disconnect", () => {
      console.log("Client Disconnected", socket.id);
      delete onlineUsers[socket.id];
      io.emit("get online users", Array.from(new Set(Object.values(onlineUsers))));
    });
  });
};
