require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app.js");
const socketHandler = require("./src/config/socket.config.js");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.CLIENT_HOST,
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  path: "/socket.io"
});

socketHandler(io);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en http://0.0.0.0:${PORT}`);
});

