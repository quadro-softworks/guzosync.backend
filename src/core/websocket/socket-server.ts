// src/core/websocket/socket-server.ts

import { TrackingGateway } from '@modules/busRouteManagement/tracking.gateway';
import { Server as HttpServer } from 'http'; // Import HTTP server type
import { Server as SocketIoServer, Socket } from 'socket.io';
import { container } from 'tsyringe'; // Import DI container
import { BusLocationUpdateListener } from '@modules/busRouteManagement/listeners/bus-location-update-listener';

let io: SocketIoServer;

export function initSocketServer(httpServer: HttpServer): SocketIoServer {
  io = new SocketIoServer(httpServer, {
    // Configure CORS for your client URL
    cors: {
      origin: process.env.CLIENT_URL || '*', // Use config or allow all for dev
      methods: ['GET', 'POST'],
    },
    // Optional: Configure transports, path, etc.
    // path: '/socket.io'
  });

  console.log('Socket.IO server initialized.');

  // --- Dependency Injection for Gateway ---
  // Resolve the gateway instance AFTER the io instance is created
  // The gateway needs the 'io' instance implicitly or explicitly
  const trackingGateway = container.resolve(TrackingGateway);
  trackingGateway.init(io); // Pass the io instance to the gateway

  // Initialize the bus location update listener
  const busLocationUpdateListener = container.resolve(BusLocationUpdateListener);
  busLocationUpdateListener.initialize(io);

  // --- Basic Connection Logging (Optional) ---
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
      // Gateway can handle cleanup if needed
    });
  });

  return io;
}

// Optional: Export io instance if needed elsewhere (use with caution)
// export const getIoInstance = (): SocketIoServer => {
//     if (!io) {
//         throw new Error('Socket.IO server not initialized.');
//     }
//     return io;
// };
