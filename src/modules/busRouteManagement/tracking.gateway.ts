import TrackingEvents from '@modules/busRouteManagement/constants/tracking.constants';
import {
  ITrackingService,
  ITrackingServiceMeta,
} from '@modules/busRouteManagement/services/tracking.service';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { injectable, inject } from 'tsyringe';

// Keep track of intervals for cleanup
const routeUpdateIntervals: Map<string, NodeJS.Timeout> = new Map();
const UPDATE_INTERVAL_MS = 15000; // Emit updates every 15 seconds (adjust as needed)

@injectable() // Make gateway injectable if it has dependencies
export class TrackingGateway {
  private io: SocketIoServer | null = null;

  constructor(
    @inject(ITrackingServiceMeta.name)
    private trackingService: ITrackingService,
  ) {}

  // Initialize with the Socket.IO server instance
  init(io: SocketIoServer) {
    this.io = io;
    this.setupEventHandlers();
    console.log('TrackingGateway initialized and event handlers set up.');
  }

  private setupEventHandlers() {
    if (!this.io) {
      console.error(
        'Socket.IO server instance not available in TrackingGateway setup.',
      );
      return;
    }

    this.io.on(TrackingEvents.ON_CONNECTION, (socket: Socket) => {
      console.log(`TrackingGateway handling connection: ${socket.id}`);

      // --- Handle Client Subscription Request ---
      socket.on(
        TrackingEvents.ON_BUS_UPDATES_REQUESTED,
        async (data: { routeId?: string }) => {
          console.log(
            `[${socket.id}] ${TrackingEvents.ON_BUS_UPDATES_REQUESTED}:`,
            data,
          );
          const routeId = data?.routeId;

          if (!routeId || typeof routeId !== 'string') {
            console.warn(
              `[${socket.id}] Invalid routeId received for tracking request.`,
            );
            socket.emit(TrackingEvents.EMIT_TRACKING_ERROR, {
              message: 'Valid routeId is required.',
            });
            return;
          }

          // **Manage Subscriptions using Rooms**
          // 1. Leave previous route rooms (optional, good practice)
          socket.rooms.forEach((room) => {
            if (room.startsWith('route_') && room !== `route_${routeId}`) {
              socket.leave(room);
              console.log(`[${socket.id}] Left room: ${room}`);
              this.stopRouteUpdatesIfUnused(room);
            }
          });

          // 2. Join the new route room
          const roomName = `route_${routeId}`;
          if (!socket.rooms.has(roomName)) {
            socket.join(roomName);
            console.log(`[${socket.id}] Joined room: ${roomName}`);

            // 3. Send initial update immediately
            try {
              const initialUpdates =
                await this.trackingService.getBusUpdatesForRoute(routeId);
              socket.emit(TrackingEvents.EMIT_BUS_UPDATES, initialUpdates);
            } catch (error) {
              console.error(
                `[${socket.id}] Error fetching initial updates for route ${routeId}:`,
                error,
              );
              socket.emit(TrackingEvents.EMIT_TRACKING_ERROR, {
                message: `Failed to get initial updates for route ${routeId}.`,
              });
            }

            // 4. Start periodic updates *if* not already started for this room
            this.startRouteUpdates(roomName, routeId);
          } else {
            console.log(`[${socket.id}] Already in room: ${roomName}`);
            // Optionally send current state again if requested multiple times
          }
        },
      );

      // --- Handle Client Disconnection ---
      socket.on(TrackingEvents.ON_DISCONNECTION, () => {
        console.log(`[${socket.id}] Disconnected. Cleaning up subscriptions.`);
        // Check rooms the socket was in and stop intervals if room becomes empty
        socket.rooms.forEach((room) => {
          if (room.startsWith('route_')) {
            // Socket.IO automatically removes socket from room on disconnect
            // We just need to check if the room is now empty
            this.stopRouteUpdatesIfUnused(room);
          }
        });
      });
    });
  }

  // --- Periodic Update Logic ---
  private startRouteUpdates(roomName: string, routeId: string) {
    if (!this.io) return;
    if (routeUpdateIntervals.has(roomName)) {
      console.log(`Updates already running for room: ${roomName}`);
      return; // Already running for this room
    }

    console.log(`Starting periodic updates for room: ${roomName}`);
    const intervalId = setInterval(async () => {
      try {
        const updates =
          await this.trackingService.getBusUpdatesForRoute(routeId);
        console.log(
          `Emitting updates to room <span class="math-inline">\{roomName\} \(</span>{updates.length} buses)`,
        );
        this.io?.to(roomName).emit(TrackingEvents.EMIT_BUS_UPDATES, updates); // Emit to room
      } catch (error) {
        console.error(`Error fetching updates for room ${roomName}:`, error);
        // Optionally emit an error to the room
        this.io?.to(roomName).emit(TrackingEvents.EMIT_TRACKING_ERROR, {
          message: `Failed to get updates for route ${routeId}.`,
        });
      }
    }, UPDATE_INTERVAL_MS);

    routeUpdateIntervals.set(roomName, intervalId);
  }

  private async stopRouteUpdatesIfUnused(roomName: string) {
    if (!this.io) return;

    // Need to check if the room is actually empty after a short delay,
    // as disconnect events might fire before room state is fully updated.
    // Or check immediately using io.sockets.adapter.rooms.get(roomName)
    setTimeout(async () => {
      try {
        const socketsInRoom = await this.io?.in(roomName).allSockets();
        if (socketsInRoom && socketsInRoom.size === 0) {
          const intervalId = routeUpdateIntervals.get(roomName);
          if (intervalId) {
            clearInterval(intervalId);
            routeUpdateIntervals.delete(roomName);
            console.log(`Stopped periodic updates for empty room: ${roomName}`);
          }
        } else {
          console.log(
            `Room ${roomName} still has ${socketsInRoom?.size || 0} sockets. Updates continue.`,
          );
        }
      } catch (e) {
        console.error('Error checking sockets in room:', e);
      }
    }, 500); // Small delay to ensure correct room state check
  }
}
