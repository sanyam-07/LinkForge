import { Server } from 'socket.io';

let io = null;

export const initSocket = (server) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  io = new Server(server, {
    cors: {
      origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join specific link room for live analytics updates
    const handleJoin = (payload) => {
      const shortCode = typeof payload === 'object' ? payload.shortCode : payload;
      if (shortCode) {
        const roomName = `link:${shortCode}`;
        socket.join(roomName);
        console.log(`[Socket.IO] Client ${socket.id} joined room: ${roomName}`);
      }
    };

    // Leave specific link room
    const handleLeave = (payload) => {
      const shortCode = typeof payload === 'object' ? payload.shortCode : payload;
      if (shortCode) {
        const roomName = `link:${shortCode}`;
        socket.leave(roomName);
        console.log(`[Socket.IO] Client ${socket.id} left room: ${roomName}`);
      }
    };

    socket.on('join:link', handleJoin);
    socket.on('join:shortCode', handleJoin);
    socket.on('leave:link', handleLeave);
    socket.on('leave:shortCode', handleLeave);

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log('[Socket.IO] Real-time engine initialized');
  return io;
};

export const getIO = () => {
  return io;
};

/**
 * Emit click event to all connected dashboards and specific link room
 */
export const emitClickEvent = (data) => {
  if (!io) return;
  try {
    console.log(`[Socket.IO] Emitting click event:`, {
      shortCode: data.shortCode,
      clicks: data.clicks,
    });

    // 1. Broadcast to global dashboard listener
    io.emit('click:recorded', data);

    // 2. Broadcast to specific link room for analytics page
    if (data.shortCode) {
      const roomName = `link:${data.shortCode}`;
      io.to(roomName).emit('analytics:update', data);
    }
  } catch (err) {
    console.error('[Socket.IO] Error emitting click event:', err.message);
  }
};

export default {
  initSocket,
  getIO,
  emitClickEvent,
};
