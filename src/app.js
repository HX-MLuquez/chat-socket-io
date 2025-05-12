const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");

const app = express();

//* Configuración de handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views", "partials"),
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//* Archivos estáticos y middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//* Rutas
app.get("/", (req, res) => {
  res.render("index");
});

module.exports = app;



// const express = require("express");
// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const path = require("path");
// const handlebars = require("express-handlebars");

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer);

// const users = new Map(); // socket.id => { id, name }
// const generalMessages = [];
// const privateChats = new Map(); // key = sorted user IDs => array of messages

// //* SETEO handlebars
// app.engine(
//   "hbs",
//   handlebars.engine({
//     extname: ".hbs",
//     defaultLayout: "main",
//     partialsDir: path.join(__dirname, "views", "partials"),
//   })
// );
// app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "views"));

// //* Configuración de archivos estáticos
// app.use(express.static(path.join(__dirname, "public")));

// //* Middleware
// app.use(express.json());

// //* Rutas
// app.get("/", (req, res) => {
//   res.render("index");
// });

// io.on("connection", socket => {
//   console.log("Nuevo socket conectado:", socket.id);

//   socket.on("userConnect", ({ id, name }) => {
//     users.set(socket.id, { id, name });
//     io.emit("userList", Array.from(users.values()));
//     io.emit("generalMessages", generalMessages);
//   });

//   socket.on("sendGeneralMessage", ({ name, message }) => {
//     generalMessages.push({ from: name, message });
//     io.emit("generalMessages", generalMessages);
//   });

//   socket.on("sendPrivateMessage", ({ fromId, toId, fromName, message }) => {
//     const chatKey = [fromId, toId].sort().join("-");
//     if (!privateChats.has(chatKey)) privateChats.set(chatKey, []);
//     if (message) {
//       privateChats.get(chatKey).push({ from: fromName, message });
//     }

//     // Reenviar mensajes a ambos usuarios
//     for (let [socketId, user] of users.entries()) {
//       if (user.id === fromId || user.id === toId) {
//         io.to(socketId).emit("receivePrivateMessage", {
//           chatId: chatKey,
//           withUserId: user.id === fromId ? toId : fromId,
//           messages: privateChats.get(chatKey),
//         });
//       }
//     }
//   });

//   socket.on("disconnect", () => {
//     users.delete(socket.id);
//     io.emit("userList", Array.from(users.values()));
//     console.log("Socket desconectado:", socket.id);
//   });
// });

// httpServer.listen(8080, () => {
//   console.log("Servidor en http://localhost:8080");
// });




// const express = require("express");
// const app = express();
// const handlebars = require("express-handlebars");
// const path = require("path");

// //* Importar socket.io
// const { Server } = require("socket.io");

// //* Definimos el puerto
// const PORT = 8080;

// //* SETEO handlebars
// app.engine(
//   "hbs",
//   handlebars.engine({
//     extname: ".hbs",
//     defaultLayout: "main",
//     partialsDir: path.join(__dirname, "views", "partials"),
//   })
// );
// app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "views"));

// //* Configuración de archivos estáticos
// app.use(express.static(path.join(__dirname, "public")));

// //* Middleware
// app.use(express.json());

// //* Rutas
// app.get("/", (req, res) => {
//   res.render("index");
// });

// //*-------------------------------

// const http = require("http");
// const server = http.createServer(app);
// server.listen(PORT, () => {
//   console.log(`Servidor escuchando en http://localhost:${PORT}`);
// });

// //* Levantar el servidor
// // const server = app.listen(PORT, () => {
// //   console.log(`Servidor escuchando en http://localhost:${PORT}`);
// // });

// //TODO___ SERVER ____
// //* Configuracion de socket.io.
// const io = new Server(server);

// //* Lista de mensajes que se guardan en el servidor (simulando una base de datos)
// const messages = [];

// const users = {}; // userId -> { name, socketId }

// //* Evento de conexión - Cada que se conecta un client se ejecuta su function CB
// io.on("connection", (socket) => {
//   console.log(`Usuario ID: ${socket.id} Conectado!!!`);

//   //* Simple 'connection'
//   // socket.on("userConnect", (data) => {
//   //   let message = {
//   //     id: socket.id,
//   //     info: "connection",
//   //     name: data.user,
//   //     message: `usuario: ${data.user} - id: ${data.id} - Conectado`,
//   //   };
//   //   messages.push(message);
//   //   io.emit("serverUserMessage", messages);
//   // });

//   socket.on("userConnect", (data) => {
//     users[data.id] = { name: data.user, socketId: socket.id };
//     console.log("Usuarios conectados:", users);

//     const message = {
//       id: socket.id,
//       info: "connection",
//       name: data.user,
//       message: `usuario: ${data.user} - id: ${data.id} - Conectado`,
//     };
//     messages.push(message);

//     // Enviar mensajes y usuarios conectados
//     io.emit("serverUserMessage", messages);
//     io.emit("updateUserList", users);
//   });

//   socket.on("userMessage", (data) => {
//     console.log("::::data:::::", data);
//     const message = {
//       id: socket.id,
//       info: "message",
//       name: data.user,
//       message: data.message,
//     };
//     messages.push(message);
//     io.emit("serverUserMessage", messages);
//   });

//   //* Simple 'disconnect'
//   // socket.on("disconnect", (data) => {
//   //   console.log("----> ", data); // transport close
//   //   console.log("Cliente desconectado:", socket.id);
//   // });

//   socket.on("disconnect", () => {
//     const userId = Object.keys(users).find(
//       (id) => users[id].socketId === socket.id
//     );
//     if (userId) {
//       delete users[userId];
//       console.log("Cliente desconectado:", socket.id);
//       io.emit("updateUserList", users);
//     }
//   });
// });

// //* Evento de desconexion
