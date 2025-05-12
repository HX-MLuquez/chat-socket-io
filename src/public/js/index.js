//* CLIENT
console.log("IN CLIENT");
const socket = io();
let user = { id: crypto.randomUUID(), name: "" };
let openedChats = new Set();

function connect() {
  user.name = document.getElementById("username").value.trim();
  if (!user.name) return;
  socket.emit("userConnect", user);
}

socket.on("userList", users => {
  const list = document.getElementById("userList");
  list.innerHTML = "";
  users.forEach(u => {
    if (u.id !== user.id && !openedChats.has(u.id)) {
      const li = document.createElement("li");
      li.textContent = u.name;
      li.onclick = () => openPrivateChat(u);
      list.appendChild(li);
    }
  });
});

socket.on("generalMessages", messages => {
  const div = document.getElementById("generalMessages");
  div.innerHTML = messages.map(m => `<p><strong>${m.from}:</strong> ${m.message}</p>`).join("");
});

function sendGeneralMessage() {
  const input = document.getElementById("generalInput");
  const message = input.value.trim();
  if (message) {
    socket.emit("sendGeneralMessage", { name: user.name, message });
    input.value = "";
  }
}

function openPrivateChat(otherUser) {
  if (openedChats.has(otherUser.id)) return;

  const chatId = [user.id, otherUser.id].sort().join("-");
  openedChats.add(otherUser.id);

  const container = document.createElement("div");
  container.id = `chat-${chatId}`;
  container.innerHTML = `
    <h3>Chat con ${otherUser.name}</h3>
    <div id="messages-${chatId}"></div>
    <input id="input-${chatId}" placeholder="Mensaje..." />
    <button onclick="sendPrivateMessage('${chatId}', '${otherUser.id}', '${otherUser.name}')">Enviar</button>
    <button onclick="closeChat('${chatId}', '${otherUser.id}')">Cerrar</button>
  `;
  document.getElementById("privateChats").appendChild(container);

  // Trigger load
  socket.emit("sendPrivateMessage", {
    fromId: user.id,
    toId: otherUser.id,
    fromName: user.name,
    message: "",
  });
}

function sendPrivateMessage(chatId, toId, toName) {
  const input = document.getElementById(`input-${chatId}`);
  const message = input.value.trim();
  if (message) {
    socket.emit("sendPrivateMessage", {
      fromId: user.id,
      toId,
      fromName: user.name,
      message,
    });
    input.value = "";
  }
}

socket.on("receivePrivateMessage", ({ chatId, messages }) => {
  const div = document.getElementById(`messages-${chatId}`);
  if (div) {
    div.innerHTML = messages.map(m => `<p><strong>${m.from}:</strong> ${m.message}</p>`).join("");
  }
});

function closeChat(chatId, userId) {
  openedChats.delete(userId);
  const chat = document.getElementById(`chat-${chatId}`);
  if (chat) chat.remove();
}


// const userName = document.querySelector(".userName");
// const chatMessage = document.querySelector(".chatMessage");
// var uuid = "";

// //* Conexión con el servidor de Socket.IO
// // const socket = io("http://mi-server-aparte.com")
// const socket = io("http://localhost:8080");

// //TODO___ CLIENT ___

// //* Lista de mensajes a renderizar en el chat
// var messages = [];

// //* Función para actualizar los mensajes en el chat
// const updateMessagges = (newMessages) => {
//   messages = [...newMessages];
//   chatMessage.innerHTML = messages
//     .map((message) => {
//       if (message.info === "connection") {
//         return `<p class="connection">${message.message}</p>`;
//       } else {
//         return `
//         <div class="messageUser">
//           <h5>Nombre: ${message.name}</h5>
//           <p>ID - ${message.id}</p>
//           <p>${message.message}</p>
//         </div>
//       `;
//       }
//     })
//     .join("");
// };

// //* Formulario de entrada de usuario con SweetAlert2
// // Mostrar el formulario de entrada de usuario
// Swal.fire({
//   title: "Ingrese su información",
//   html: `
//         <input type="text" id="swal-input-name" class="swal2-input" placeholder="Nombre">
//         <input type="text" id="swal-input-id" class="swal2-input" placeholder="ID">
//       `,
//   focusConfirm: false,
//   showCancelButton: true,
//   confirmButtonText: "Ingresar",
//   preConfirm: () => {
//     const name = Swal.getPopup().querySelector("#swal-input-name").value;
//     const id = Swal.getPopup().querySelector("#swal-input-id").value;
//     if (!name || !id) {
//       Swal.showValidationMessage(`Por favor ingrese ambos campos`);
//     }
//     return { name: name, id: id };
//   },
// }).then((result) => {
//   console.log("-->", result);
//   const { name, id } = result.value;
//   uuid = id;
//   if (result.isConfirmed) {
//     userName.textContent = name;
//     socket.emit(`userConnect`, { user: name, id });
//   }
// });

// //* Evento de conexión con el servidor
// socket.on("serverUserMessage", (data) => {
//   chatMessage.innerHTML = "";
//   updateMessagges(data);
// });

// //* Enlace de eventos de los botones de la interfaz - al DOM
// const btnMessage = document.getElementById("btnMessage");
// const inputMessage = document.getElementById("inputMessage");

// //* Función para enviar un mensaje al servidor
// btnMessage.addEventListener("click", (e) => {
//   e.preventDefault();
//   const message = inputMessage.value;
//   socket.emit("userMessage", { message, user: userName.innerHTML });
// });

// //* Evento para escuchar mensajes nuevos del servidor y actualizar la lista de mensajes

// /*
// Los eventos de Socket.IO son asíncronos, lo que significa que no podemos detener el flujo
// de la aplicación esperando una respuesta directa.
// Para manejar esto, podemos:

// 1. Usar callbacks proporcionados por el cliente o el servidor.
// 2. Emitir eventos personalizados y escuchar las respuestas por separado.

// Esto permite que el flujo de la aplicación continúe mientras se gestionan las respuestas.
// */

// //* EXTRA - CHAT PRIVATE -

// // 1. **Agregar un contenedor para mostrar los usuarios** (puede ir en `chat.hbs`):

// // ```html
// // <aside class="userListContainer">
// //   <h4>Usuarios conectados</h4>
// //   <ul id="userList"></ul>
// // </aside>
// // ```

// // 2. **Mostrar usuarios conectados**:

// const userList = document.getElementById("userList");

// socket.on("updateUserList", (users) => {
//   userList.innerHTML = "";
//   Object.entries(users).forEach(([id, user]) => {
//     if (id !== uuid) { // No mostrarte a ti mismo
//       const li = document.createElement("li");
//       li.textContent = user.name;
//       li.dataset.id = id;
//       li.classList.add("userItem");
//       li.style.cursor = "pointer";
//       userList.appendChild(li);
//     }
//   });
// });

// // 3. **Crear chat privado al hacer click**:

// userList.addEventListener("click", (e) => {
//   if (e.target.matches(".userItem")) {
//     const toId = e.target.dataset.id;
//     const toName = e.target.textContent;
//     openPrivateChat(toId, toName);
//   }
// });

// // 4. **Función para abrir un nuevo chat privado**:

// function openPrivateChat(toId, toName) {
//   const chatBox = document.createElement("div");
//   chatBox.classList.add("privateChat");
//   chatBox.innerHTML = `
//     <h4>Chat privado con ${toName}</h4>
//     <div class="messages" id="messages-${toId}"></div>
//     <input type="text" placeholder="Mensaje privado..." id="input-${toId}" />
//     <button id="send-${toId}">Enviar</button>
//   `;
//   document.body.appendChild(chatBox);

//   document.getElementById(`send-${toId}`).addEventListener("click", () => {
//     const input = document.getElementById(`input-${toId}`);
//     const msg = input.value;
//     socket.emit("privateMessage", {
//       toId,
//       from: userName.textContent,
//       message: msg
//     });
//     appendPrivateMessage(toId, userName.textContent, msg);
//     input.value = "";
//   });
// }

// function appendPrivateMessage(toId, sender, message) {
//   const msgBox = document.getElementById(`messages-${toId}`);
//   const p = document.createElement("p");
//   p.innerHTML = `<strong>${sender}:</strong> ${message}`;
//   msgBox.appendChild(p);
// }

// // 5. **Recibir mensajes privados**:

// socket.on("receivePrivateMessage", ({ from, message }) => {
//   const existingBox = [...document.querySelectorAll(".privateChat")].find(box =>
//     box.querySelector("h4").textContent.includes(from)
//   );

//   // Si ya existe el chat, mostrar el mensaje
//   if (existingBox) {
//     const id = existingBox.querySelector(".messages").id.split("-")[1];
//     appendPrivateMessage(id, from, message);
//   } else {
//     // Sino, crear uno nuevo
//     openPrivateChat("desconocido", from); // ID no disponible, solo mostrar nombre
//     setTimeout(() => appendPrivateMessage("desconocido", from, message), 100);
//   }
// });
