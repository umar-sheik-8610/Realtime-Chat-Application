import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A User connected", socket.id);

  const userId = socket.handshake.query.userId;
  if(userId) userSocketMap[userId] = socket.id;
  
  // Emit the list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  


  socket.on("disconnect", (socket) => {
    console.log("Client disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
