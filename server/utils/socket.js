const socketIo = require("socket.io");

let io;

// Initialize Socket.io and export it for use in other parts of the app
const initSocket = (server) => {
  const corsOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "https://app.prospct.io",
        "https://get.prospct.io",
        "https://prospct.lovable.app",
        "http://localhost:5173",
        "http://localhost:5174",
      ];

  io = socketIo(server, {
    cors: {
      origin: corsOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Handle connection
  io.on("connection", (socket) => {
    // Connect user to personal room if userId is provided
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(`user_${userId}`);
    }

    // Handle joining a room (generic)
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId); // Join the specific room (e.g., fileId)
    });

    // Handle disconnection
    socket.on("disconnect", () => {
    });
  });
};

const getIO = () => io;

// Emit events for real-time updates
const emitVerificationUpdate = (fileId, status, filePath = null) => {
  if (io) {
    io.to(fileId).emit("verificationUpdate", { status, filePath });
  }
};

module.exports = { initSocket, emitVerificationUpdate, getIO };
