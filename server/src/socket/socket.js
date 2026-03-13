import { Server } from "socket.io";
import {
  markAsReadService,
  sendMessageService,
} from "../services/message.service.js";

let io;

const onlineUsers = new Map(); // userId → socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.APP_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ── Register user (existing — unchanged) ──────────────────────────────
    socket.on("register", (userId) => {
      onlineUsers.set(userId.toString(), socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // ── Join a conversation room ──────────────────────────────────────────
    // Client emits: { conversationId }
    socket.on("join_conversation", ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined room: ${conversationId}`);
    });

    // ── Leave a conversation room ─────────────────────────────────────────
    socket.on("leave_conversation", ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(conversationId);
    });

    // ── Send a message ────────────────────────────────────────────────────
    // Client emits: { conversationId, senderId, text?, attachment? }
    // attachment shape: { url, public_id, type, originalName }
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, senderId, text, attachment } = data;

        if (!conversationId || !senderId) return;
        if (!text && !attachment?.url) return;

        const { message, recipientId } = await sendMessageService({
          conversationId,
          senderId,
          text,
          attachment,
        });

        // Broadcast to everyone in the room (sender gets it back too for confirmation)
        io.to(conversationId).emit("message_received", { message });

        // If recipient is online but NOT in this room, send a push-style notification
        if (recipientId) {
          const recipientSocketId = onlineUsers.get(recipientId.toString());
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("new_message_notification", {
              conversationId,
              message,
            });
          }
        }
      } catch (err) {
        console.error("send_message error:", err.message);
        socket.emit("message_error", { error: err.message });
      }
    });

    // ── Typing indicators ─────────────────────────────────────────────────
    // Client emits: { conversationId, userId }
    socket.on("typing", ({ conversationId, userId }) => {
      if (!conversationId || !userId) return;
      socket.to(conversationId).emit("user_typing", { userId });
    });

    socket.on("stop_typing", ({ conversationId, userId }) => {
      if (!conversationId || !userId) return;
      socket.to(conversationId).emit("user_stop_typing", { userId });
    });

    // ── Mark messages as read ─────────────────────────────────────────────
    // Client emits: { conversationId, userId }
    socket.on("messages_read", async ({ conversationId, userId }) => {
      try {
        if (!conversationId || !userId) return;
        await markAsReadService(conversationId, userId);

        // Notify the other participant their messages were seen
        socket.to(conversationId).emit("messages_seen", {
          conversationId,
          readBy: userId,
        });
      } catch (err) {
        console.error("messages_read error:", err.message);
      }
    });

    // ── Disconnect (existing — unchanged) ─────────────────────────────────
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};

export const getOnlineUsers = () => onlineUsers;
