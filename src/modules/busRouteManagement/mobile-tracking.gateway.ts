import { injectable, inject } from 'tsyringe';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { updateBusLocationMobileSchema, UpdateBusLocationMobileCommand } from './features/update-bus-location-mobile/update-bus-location-mobile.command';
import { UpdateBusLocationMobileHandler } from './features/update-bus-location-mobile/update-bus-location-mobile.handler';
import TrackingEvents from './constants/tracking.constants';
import { ITrackingService, ITrackingServiceMeta } from './services/tracking.service';

@injectable()
export class MobileTrackingGateway {
  private io: SocketIoServer | null = null;
  private activeDrivers: Map<string, { socketId: string, busId: string, lastUpdate: Date }> = new Map();

  constructor(
    @inject(ITrackingServiceMeta.name)
    private trackingService: ITrackingService,
    private updateBusLocationHandler: UpdateBusLocationMobileHandler
  ) {}

  // Initialize with the Socket.IO server instance
  init(io: SocketIoServer) {
    this.io = io;
    this.setupEventHandlers();
    console.log('MobileTrackingGateway initialized and event handlers set up.');
  }

  private setupEventHandlers() {
    if (!this.io) {
      console.error('Socket.IO server instance not available in MobileTrackingGateway setup.');
      return;
    }

    this.io.on(TrackingEvents.ON_CONNECTION, (socket: Socket) => {
      console.log(`MobileTrackingGateway handling connection: ${socket.id}`);

      // Handle driver authentication/connection
      socket.on(TrackingEvents.ON_DRIVER_CONNECTED, (data: { busId: string, driverId: string }) => {
        console.log(`Driver connected for bus ${data.busId}`, data);
        
        // Store driver connection info
        this.activeDrivers.set(data.busId, {
          socketId: socket.id,
          busId: data.busId,
          lastUpdate: new Date()
        });
        
        // Join bus-specific room
        socket.join(`bus_${data.busId}`);
      });

      // Handle location updates from mobile app
      socket.on(TrackingEvents.ON_BUS_LOCATION_UPDATE, async (data: any) => {
        console.log(`Received location update from mobile app:`, data);
        
        try {
          // Validate the incoming data
          const validatedData = updateBusLocationMobileSchema.parse(data);
          
          // Process the location update
          const result = await this.updateBusLocationHandler.execute(validatedData);
          
          // Update the last update timestamp
          if (this.activeDrivers.has(validatedData.busId)) {
            const driverInfo = this.activeDrivers.get(validatedData.busId);
            if (driverInfo) {
              driverInfo.lastUpdate = new Date();
              this.activeDrivers.set(validatedData.busId, driverInfo);
            }
          }
          
          // Send confirmation back to the driver
          socket.emit(TrackingEvents.EMIT_LOCATION_UPDATE_RESULT, {
            success: true,
            timestamp: new Date(),
            busId: validatedData.busId
          });
          
        } catch (error) {
          console.error('Error processing mobile location update:', error);
          socket.emit(TrackingEvents.EMIT_LOCATION_UPDATE_ERROR, {
            message: error instanceof Error ? error.message : 'Invalid location data',
            timestamp: new Date()
          });
        }
      });

      // Handle driver disconnection
      socket.on(TrackingEvents.ON_DISCONNECTION, () => {
        console.log(`Driver disconnected: ${socket.id}`);
        
        // Find and remove the disconnected driver
        for (const [busId, info] of this.activeDrivers.entries()) {
          if (info.socketId === socket.id) {
            console.log(`Removing driver for bus ${busId}`);
            this.activeDrivers.delete(busId);
            break;
          }
        }
      });
    });

    // Set up a periodic check for inactive drivers
    setInterval(() => this.checkInactiveDrivers(), 60000); // Check every minute
  }

  // Check for inactive drivers and log them
  private checkInactiveDrivers() {
    const now = new Date();
    const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
    
    for (const [busId, info] of this.activeDrivers.entries()) {
      const timeSinceLastUpdate = now.getTime() - info.lastUpdate.getTime();
      
      if (timeSinceLastUpdate > inactiveThreshold) {
        console.warn(`Bus ${busId} hasn't sent location updates for ${Math.round(timeSinceLastUpdate / 60000)} minutes`);
      }
    }
  }

  // Get active driver status - useful for monitoring
  getActiveDrivers() {
    return Array.from(this.activeDrivers.entries()).map(([busId, info]) => ({
      busId,
      socketId: info.socketId,
      lastUpdate: info.lastUpdate
    }));
  }
}
