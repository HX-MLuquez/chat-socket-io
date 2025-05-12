const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app.js");
const socketHandler = require("./src/config/socket.config.js");

const httpServer = createServer(app);
const io = new Server(httpServer);

// Socket.io configuration
socketHandler(io);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
