const express = require("express");
const app = express();
const http = require("http");

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

// http
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// socket.io rooms
const rooms = {};

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`)

  socket.on("join room", async (roomId) => {
    socket.roomId = roomId;
    await socket.join(roomId);

    if (rooms[roomId] === undefined) {
      const room = {
        clients: 1,
      };
      rooms[roomId] = room;
      console.log(`user ${socket.id} created room ${roomId}`)

      io.to(socket.roomId).emit('room stats', {usersCount: rooms[socket.roomId].clients})
    } else {
      rooms[roomId].clients++;
      console.log(`user ${socket.id} joined room ${roomId}`)

      io.to(socket.roomId).emit('room stats', {usersCount: rooms[socket.roomId].clients})
    }
  })

  socket.on("play", () => {
    console.log(`user ${socket.id} clicked play`);
    socket.broadcast.to(socket.roomId).emit("play");
  });

  socket.on("pause", () => {
    console.log(`user ${socket.id} clicked pause`);
    socket.broadcast.to(socket.roomId).emit("pause");
  });

  socket.on("change time", (time) => {
    console.log(`user ${socket.id} changed time to ${time}`);
    socket.broadcast.to(socket.roomId).emit("change time", time);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`)
    // TODO: disconnecting from rooms and removing existing rooms
    io.to(socket.roomId).emit('room stats', {usersCount: rooms[socket.roomId].clients})
  });
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
