const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

getReceiverSocketId = (userId) => {
  // Function to get the socket ID of a user by their userId
  return onlineUsers[userId] || null;
};

// to store online users
let onlineUsers = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected : ", userId);

  if (userId) onlineUsers[userId] = socket.id;

  // emit online users to all clients
  io.emit("onlineUsers", Object.keys(onlineUsers));

  socket.on("disconnect", () => {
    console.log("User disconnected : ", userId);
    delete onlineUsers[userId];

    // emit online users to all clients
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});

module.exports = { io, server, app, getReceiverSocketId, onlineUsers };
