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
  console.log(`Servidor en http://localhost:${PORT}`);
});

/*
localhost o 127.0.0.1 → Solo acepta conexiones locales (desde la misma máquina)
0.0.0.0 → Acepta conexiones desde cualquier dirección IP, tanto internas como externas

httpServer.listen(8080, '0.0.0.0');
→ Puedes acceder desde:
http://localhost:8080 (local)
http://<IP-del-servidor>:8080 (externo)

Es útil para pruebas locales y desarrollo, pero en producción es mejor usar 
un proxy inverso (como Nginx) para manejar las conexiones externas.
*/