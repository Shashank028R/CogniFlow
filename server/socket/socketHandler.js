export const handleSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Client Connected ", socket.id);

    socket.on("message", (data) => {
      console.log("Message Received: ", data);
      socket.emit("message", { message: `Echo ${data.message}` });
    });

    socket.on("disconnect", () => {
      console.log("Client Disconnected", socket.id);
    });
  });
};
