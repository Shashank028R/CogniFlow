export const handleSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Client Connected ", socket.id);

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined the room ", room);
    });

    socket.on("new message", (newMessage) => {
      socket.in(newMessage.room._id || newMessage.room).emit("message received", newMessage);
    })
    socket.on("disconnect", () => {
      console.log("Client Disconnected", socket.id);
    });
  });
};
