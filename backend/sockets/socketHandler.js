import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ✅ JWT Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.user.role} (${socket.user.id})`);

    // 🔔 Notification Event
    socket.on("sendNotification", (data) => {
      io.emit("receiveNotification", data); // broadcast to all
    });

    // 💬 Chat Event
    socket.on("sendMessage", (messageData) => {
      io.emit("receiveMessage", messageData);
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};
