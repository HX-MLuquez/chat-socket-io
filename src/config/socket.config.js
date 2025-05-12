const users = new Map();
const generalMessages = [];
const privateChats = new Map();

function socketHandler(io) {
  io.on("connection", socket => {
    console.log("Nuevo socket conectado:", socket.id);

    socket.on("userConnect", ({ id, name }) => {
      users.set(socket.id, { id, name });
      io.emit("userList", Array.from(users.values()));
      io.emit("generalMessages", generalMessages);
    });

    socket.on("sendGeneralMessage", ({ name, message }) => {
      generalMessages.push({ from: name, message });
      io.emit("generalMessages", generalMessages);
    });

    socket.on("sendPrivateMessage", ({ fromId, toId, fromName, message }) => {
      const chatKey = [fromId, toId].sort().join("-");
      if (!privateChats.has(chatKey)) privateChats.set(chatKey, []);
      if (message) {
        privateChats.get(chatKey).push({ from: fromName, message });
      }

      // Reenviar mensajes a ambos usuarios
      for (let [socketId, user] of users.entries()) {
        if (user.id === fromId || user.id === toId) {
          io.to(socketId).emit("receivePrivateMessage", {
            chatId: chatKey,
            withUserId: user.id === fromId ? toId : fromId,
            messages: privateChats.get(chatKey),
          });
        }
      }
    });

    socket.on("disconnect", () => {
      users.delete(socket.id);
      io.emit("userList", Array.from(users.values()));
      console.log("Socket desconectado:", socket.id);
    });
  });
}

module.exports = socketHandler;
