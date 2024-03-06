// const http = require('http');

// const server = http.createServer();

// const io = require('socket.io')(server, {
//     cors: { origin: '*' }
// });

// io.on('connection', (socket) => {
//     console.log('Se ha conectado un cliente');

//     socket.broadcast.emit('chat_message', {
//         usuario: 'INFO',
//         mensaje: 'Se ha conectado un nuevo usuario'
//     });

//     socket.on('chat_message', (data) => {
//         io.emit('chat_message', data);
//         console.log(data);
//     });

//     socket.on('disconnect', () => {
//         console.log('Se ha desconectado un cliente');
//         socket.broadcast.emit('chat_message', {
//             usuario: 'INFO',
//             mensaje: 'Se ha desconectado un usuario'
//         });
//     });
// });



// server.listen(4000);

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`user with id-${socket.id} joined room - ${roomId}`);
  });

  socket.on("send_msg", (data) => {
    console.log(data, "DATA");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("receive_msg", data);
  });

  socket.on("typing", (data) => {
    console.log(data, "TYPING");
    //This will send a message to a specific room ID
    socket.to(data.roomId).socket.broadcast.emit("receive_msg", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});