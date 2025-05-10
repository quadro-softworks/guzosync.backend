import { injectable, inject } from 'tsyringe';
import { Server as SocketIoServer, Socket } from 'socket.io';
import TrafficEvents from './constants/traffic.constants';
import { IMapService, IMapServiceMeta } from './services/map.service';

@injectable()
export class TrafficInfoGateway {
  private io: SocketIoServer | null = null;
  private activeSubscribers: Map<string, { socketId: string, routeId: string, driverId: string }> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private readonly UPDATE_INTERVAL_MS = 120000; // 2 minutes
  
  constructor(
    @inject(IMapServiceMeta.name)
    private mapService: IMapService
  ) {}

  // Initialize with the Socket.IO server instance
  init(io: SocketIoServer) {
    this.io = io;
    this.setupEventHandlers();
    console.log('TrafficInfoGateway initialized and event handlers set up.');
  }

  private setupEventHandlers() {
    if (!this.io) {
      console.error('Socket.IO server instance not available in TrafficInfoGateway setup.');
      return;
    }

    this.io.on('connection', (socket: Socket) => {
      console.log(`TrafficInfoGateway handling connection: ${socket.id}`);

      // Handle subscription to traffic info
      socket.on(TrafficEvents.ON_TRAFFIC_INFO_REQUESTED, async (data: { 
        routeId: string, 
        driverId: string,
        currentLocation?: { latitude: number, longitude: number } 
      }) => {
        console.log(`Traffic info requested:`, data);
        
        try {
          // Validate data
          if (!data.routeId || !data.driverId) {
            throw new Error('Invalid traffic info request');
          }
          
          // Store subscription info
          const subscriptionId = `${data.driverId}_${data.routeId}`;
          this.activeSubscribers.set(subscriptionId, {
            socketId: socket.id,
            routeId: data.routeId,
            driverId: data.driverId
          });
          
          // Join route-specific room
          socket.join(`traffic_${data.routeId}`);
          
          // Send initial traffic info
          const trafficInfo = await this.getTrafficInfoForRoute(data.routeId, data.currentLocation);
          socket.emit(TrafficEvents.EMIT_TRAFFIC_INFO, trafficInfo);
          
          // Start periodic updates if not already started
          this.startPeriodicUpdates(data.routeId);
          
        } catch (error) {
          console.error('Error processing traffic info request:', error);
          socket.emit(TrafficEvents.EMIT_TRAFFIC_ERROR, {
            message: error instanceof Error ? error.message : 'Error getting traffic info',
            timestamp: new Date()
          });
        }
      });

      // Handle unsubscribe
      socket.on(TrafficEvents.ON_TRAFFIC_INFO_UNSUBSCRIBE, (data: { routeId: string, driverId: string }) => {
        if (data.routeId && data.driverId) {
          const subscriptionId = `${data.driverId}_${data.routeId}`;
          this.activeSubscribers.delete(subscriptionId);
          socket.leave(`traffic_${data.routeId}`);
          
          // Check if room is empty and stop updates if so
          this.stopUpdatesIfNoSubscribers(data.routeId);
        }
      });

      // Handle driver disconnection
      socket.on('disconnect', () => {
        console.log(`Driver disconnected from traffic info: ${socket.id}`);
        
        // Find and remove the disconnected driver's subscriptions
        for (const [subscriptionId, info] of this.activeSubscribers.entries()) {
          if (info.socketId === socket.id) {
            console.log(`Removing traffic subscription for ${subscriptionId}`);
            this.activeSubscribers.delete(subscriptionId);
            
            // Check if we should stop updates for this route
            this.stopUpdatesIfNoSubscribers(info.routeId);
          }
        }
      });
    });
  }

  // Get traffic info for a route
  private async getTrafficInfoForRoute(routeId: string, currentLocation?: { latitude: number, longitude: number }) {
    // This would typically make API calls to traffic services or use internal data
    // For now, we'll return mocked data based on time of day
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate traffic conditions based on time of day
    let trafficCondition: 'light' | 'moderate' | 'heavy';
    if (hour >= 7 && hour <= 9) {
      trafficCondition = 'heavy'; // Morning rush hour
    } else if (hour >= 16 && hour <= 19) {
      trafficCondition = 'heavy'; // Evening rush hour
    } else if ((hour >= 10 && hour <= 15) || (hour >= 20 && hour <= 22)) {
      trafficCondition = 'moderate'; // Mid-day or evening
    } else {
      trafficCondition = 'light'; // Late night or early morning
    }
    
    // Simulate some incidents
    const incidents = [];
    if (Math.random() > 0.7) {
      incidents.push({
        type: 'accident',
        location: 'Near city center',
        impactLevel: 'moderate',
        timestamp: new Date(now.getTime() - Math.random() * 3600000)
      });
    }
    if (Math.random() > 0.8) {
      incidents.push({
        type: 'roadWork',
        location: 'Main avenue',
        impactLevel: 'high',
        timestamp: new Date(now.getTime() - Math.random() * 7200000)
      });
    }
    
    return {
      routeId,
      timestamp: now,
      trafficCondition,
      estimatedDelayMinutes: trafficCondition === 'heavy' ? Math.floor(Math.random() * 20) + 10 : 
                             trafficCondition === 'moderate' ? Math.floor(Math.random() * 10) + 5 : 
                             Math.floor(Math.random() * 5),
      incidents,
      alternateRouteAvailable: trafficCondition === 'heavy' && incidents.length > 0
    };
  }

  // Start periodic updates for a route
  private startPeriodicUpdates(routeId: string) {
    if (this.updateIntervals.has(routeId)) {
      return; // Already sending updates for this route
    }
    
    const intervalId = setInterval(async () => {
      try {
        // Check if we still have subscribers
        let hasSubscribers = false;
        for (const info of this.activeSubscribers.values()) {
          if (info.routeId === routeId) {
            hasSubscribers = true;
            break;
          }
        }
        
        if (!hasSubscribers) {
          this.stopUpdatesIfNoSubscribers(routeId);
          return;
        }
        
        // Get updated traffic info
        const trafficInfo = await this.getTrafficInfoForRoute(routeId);
        
        // Send to all subscribers for this route
        this.io?.to(`traffic_${routeId}`).emit(TrafficEvents.EMIT_TRAFFIC_INFO, trafficInfo);
        
      } catch (error) {
        console.error(`Error sending traffic updates for route ${routeId}:`, error);
      }
    }, this.UPDATE_INTERVAL_MS);
    
    this.updateIntervals.set(routeId, intervalId);
  }

  // Stop updates if no subscribers
  private stopUpdatesIfNoSubscribers(routeId: string) {
    // Check if there are any subscribers for this route
    let hasSubscribers = false;
    for (const info of this.activeSubscribers.values()) {
      if (info.routeId === routeId) {
        hasSubscribers = true;
        break;
      }
    }
    
    if (!hasSubscribers && this.updateIntervals.has(routeId)) {
      clearInterval(this.updateIntervals.get(routeId)!);
      this.updateIntervals.delete(routeId);
      console.log(`Stopped traffic updates for route ${routeId} - no subscribers`);
    }
  }
} 