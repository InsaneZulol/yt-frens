const express = require("express");
const app = express();
const http = require("http");

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg); // emits to everyone else
  });
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
