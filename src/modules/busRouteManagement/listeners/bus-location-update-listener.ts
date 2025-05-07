import { injectable, inject } from 'tsyringe';
import { IEventBus } from '@core/events/event-bus.interface';
import { BusLocationUpdatedEvent } from '@modules/busRouteManagement/constants/events';
import { Server as SocketIoServer } from 'socket.io';
import TrackingEvents from '@modules/busRouteManagement/constants/tracking.constants';
import { BusLocationUpdateResult } from '@core/app/dtos/bus-location-update-result.dto';

/**
 * Listener that broadcasts bus location updates to WebSocket clients
 */
@injectable()
export class BusLocationUpdateListener {
  private io: SocketIoServer | null = null;

  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  initialize(io: SocketIoServer): void {
    this.io = io;
    this.setupEventHandlers();
    console.log('BusLocationUpdateListener initialized');
  }

  private setupEventHandlers(): void {
    // Subscribe to bus location update events
    this.eventBus.subscribe(BusLocationUpdatedEvent, (event: { payload: BusLocationUpdateResult; }) => {
      this.handleBusLocationUpdate(event.payload as BusLocationUpdateResult);
    });
  }

  private handleBusLocationUpdate(update: BusLocationUpdateResult): void {
    if (!this.io) {
      console.error('Socket.IO server not initialized in BusLocationUpdateListener');
      return;
    }

    // If there's a routeId, broadcast to that route's room
    if (update.routeId) {
      const roomName = `route_${update.routeId}`;
      
      console.log(`Broadcasting location update for bus ${update.busId} to room ${roomName}`);
      
      // Emit to the specific route room
      this.io.to(roomName).emit(TrackingEvents.EMIT_BUS_UPDATES, [update]);
    }
    
    // Also broadcast to any clients specifically tracking this bus
    const busRoom = `bus_${update.busId}`;
    this.io.to(busRoom).emit(TrackingEvents.EMIT_BUS_UPDATES, [update]);
  }
} 