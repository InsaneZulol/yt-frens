const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

const rooms = {};

// HTTP HANDLING
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// SOCKET HANDLING
io.on("connection", (socket) => {
  console.log("+ CONNECTED: ", socket.id);

  //ROOM
  socket.on("joinRoom", async (data) => {
    socket.room = data.roomName;
    await socket.join(socket.room);
    if (rooms[socket.room] === undefined) {
      const roomObj = {
        clients: 1,
        curURL: data.URL,
      };
      rooms[socket.room] = roomObj;
    } else {
      rooms[socket.room].clients++;
      socket.emit("URLOnJoin", { URL: rooms[socket.room].curURL });
    }
    io.to(socket.room).emit("roomStat", {
      room: socket.room,
      usercount: io.sockets.adapter.rooms[socket.room].length,
      URL: rooms[socket.room].curURL,
    });
    console.log(`++  ${socket.id} JOINING |${socket.room}|`);
  });

  //CHANGE IN SONG
  socket.on("newURL", (data) => {
    socket.curURL = data.URL;
    rooms[socket.room].curURL = data.URL;
    io.to(socket.room).emit("updateURL", data);
    console.log(data.URL);
  });

  //CONTROLS
  socket.on("controls", (data) => {
    console.log(data);
    io.to(socket.room).emit("updateControls", data);
  });

  //LEAVE & JOIN NEW ROOM
  socket.on("leaving", async (data) => {
    socket.broadcast
      .to(socket.room)
      .emit("newLeaving", { leftSocketId: socket.id });
    socket.broadcast
      .to(socket.room)
      .emit("roomStat", {
        room: socket.room,
        usercount: io.sockets.adapter.rooms[socket.room].length - 1,
        URL: rooms[socket.room].curURL,
      });
    rooms[socket.room].clients--;
    if (rooms[socket.room].clients === 0) delete rooms[socket.room];
    await socket.leave(socket.room);
    console.log(`--  ${socket.id} LEAVING |${socket.room}|`);
  });

  //HANDLE DISCONNECTION
  socket.on("disconnect", () => {
    if (socket.room && io.sockets.adapter.rooms[socket.room]) {
      socket.broadcast
        .to(socket.room)
        .emit("newLeaving", { leftSocketId: socket.id });
      socket.broadcast
        .to(socket.room)
        .emit("roomStat", {
          room: socket.room,
          usercount: io.sockets.adapter.rooms[socket.room].length,
          URL: rooms[socket.room].curURL,
        });
      rooms[socket.room].clients--;
      if (rooms[socket.room].clients === 0) delete rooms[socket.room];
      socket.leave(socket.room);
    }
    console.log("- DISCONNECTED: ", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`yt-frens server listening at http://localhost:${PORT}`);
});
