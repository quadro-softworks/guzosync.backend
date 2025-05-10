// src/core/websocket/socket-server.ts

import { TrackingGateway } from '@modules/busRouteManagement/tracking.gateway';
import { MobileTrackingGateway } from '@modules/busRouteManagement/mobile-tracking.gateway';
import { TrafficInfoGateway } from '@modules/busRouteManagement/traffic-info.gateway';
import { ConversationGateway } from '@modules/operationsControl/conversation.gateway';
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

  // --- Dependency Injection for Gateways ---
  // Resolve the gateway instances AFTER the io instance is created
  // The gateways need the 'io' instance implicitly or explicitly
  const trackingGateway = container.resolve(TrackingGateway);
  trackingGateway.init(io); // Pass the io instance to the gateway
  
  // Initialize the mobile tracking gateway for bus driver app
  try {
    const mobileTrackingGateway = container.resolve('MobileTrackingGateway') as MobileTrackingGateway;
    mobileTrackingGateway.init(io);
    console.log('Mobile tracking gateway initialized successfully');
  } catch (error) {
    console.error('Failed to initialize mobile tracking gateway:', error);
  }

  // Initialize the traffic info gateway for bus drivers
  try {
    const trafficInfoGateway = container.resolve(TrafficInfoGateway);
    trafficInfoGateway.init(io);
    console.log('Traffic info gateway initialized successfully');
  } catch (error) {
    console.error('Failed to initialize traffic info gateway:', error);
  }

  // Initialize the conversation gateway for communication between queue regulators and control center
  try {
    const conversationGateway = container.resolve(ConversationGateway);
    conversationGateway.init(io);
    console.log('Conversation gateway initialized successfully');
  } catch (error) {
    console.error('Failed to initialize conversation gateway:', error);
  }

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
