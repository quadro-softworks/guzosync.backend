import { TrackingGateway } from '@modules/busRouteManagement/tracking.gateway';
import { ITrackingService } from '@modules/busRouteManagement/services/tracking.service';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { mock, mockDeep } from 'jest-mock-extended';
import TrackingEvents from '@modules/busRouteManagement/constants/tracking.constants';
import { BusStatus } from '@core/domain/enums/bus-status.enum';

// Import the real BusLocationUpdateResult to see its signature
import { BusLocationUpdateResult } from '@core/app/dtos/bus-location-update-result.dto';

// Use Jest's automatic mock instead of manual mock
jest.mock('@core/app/dtos/bus-location-update-result.dto');

describe('TrackingGateway', () => {
  let gateway: TrackingGateway;
  let mockTrackingService: jest.Mocked<ITrackingService>;
  let mockIo: jest.Mocked<SocketIoServer>;
  let mockSocket: jest.Mocked<Socket>;
  
  beforeEach(() => {
    // Create mocks
    mockTrackingService = mockDeep<ITrackingService>();
    mockIo = mockDeep<SocketIoServer>();
    mockSocket = mockDeep<Socket>();
    
    // Set up socket mocks - using type assertion to bypass readonly properties
    (mockSocket as any).id = 'test-socket-id';
    (mockSocket as any).rooms = new Set(['socket-id']);
    
    // Mock io.on to handle 'connection' event
    mockIo.on.mockImplementation((event, callback) => {
      if (event === 'connection') {
        callback(mockSocket);
      }
      return mockIo;
    });
    
    // Create a valid mock update
    const mockUpdate = new BusLocationUpdateResult(
      'bus-1',
      { latitude: 9.005401, longitude: 38.763611 },
      'route-1',
      BusStatus.Active,
      []
    );
    
    mockTrackingService.getBusUpdatesForRoute.mockResolvedValue([mockUpdate]);
    
    // Create gateway instance
    gateway = new TrackingGateway(mockTrackingService);
  });
  
  describe('init', () => {
    it('should initialize the gateway and set up event handlers', () => {
      gateway.init(mockIo);
      
      expect(mockIo.on).toHaveBeenCalledWith(TrackingEvents.ON_CONNECTION, expect.any(Function));
    });
    
    it('should set up socket events when a client connects', () => {
      gateway.init(mockIo);
      
      expect(mockSocket.on).toHaveBeenCalledWith(
        TrackingEvents.ON_BUS_UPDATES_REQUESTED, 
        expect.any(Function)
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        TrackingEvents.ON_DISCONNECTION, 
        expect.any(Function)
      );
    });
  });
  
  describe('bus updates request', () => {
    it('should handle bus updates request and join room', async () => {
      gateway.init(mockIo);
      
      // Extract the handler function
      const busUpdatesHandler = mockSocket.on.mock.calls.find(
        call => call[0] === TrackingEvents.ON_BUS_UPDATES_REQUESTED
      )?.[1] as (data: any) => void;
      
      // Call the handler
      await busUpdatesHandler({ routeId: 'route-1' });
      
      // Verify socket joins room
      expect(mockSocket.join).toHaveBeenCalledWith('route_route-1');
      
      // Verify tracking service is called
      expect(mockTrackingService.getBusUpdatesForRoute).toHaveBeenCalledWith('route-1');
      
      // Verify socket emits initial updates
      expect(mockSocket.emit).toHaveBeenCalledWith(
        TrackingEvents.EMIT_BUS_UPDATES, 
        expect.arrayContaining([
          expect.objectContaining({
            busId: 'bus-1',
            routeId: 'route-1'
          })
        ])
      );
    });
    
    it('should emit error if routeId is missing', async () => {
      gateway.init(mockIo);
      
      const busUpdatesHandler = mockSocket.on.mock.calls.find(
        call => call[0] === TrackingEvents.ON_BUS_UPDATES_REQUESTED
      )?.[1] as (data: any) => void;
      
      // Call the handler without routeId
      await busUpdatesHandler({});
      
      // Verify error is emitted
      expect(mockSocket.emit).toHaveBeenCalledWith(
        TrackingEvents.EMIT_TRACKING_ERROR, 
        expect.objectContaining({
          message: expect.stringContaining('routeId')
        })
      );
      
      // Verify socket doesn't join room
      expect(mockSocket.join).not.toHaveBeenCalled();
    });
    
    it('should handle tracking service errors', async () => {
      gateway.init(mockIo);
      
      // Make tracking service throw error
      mockTrackingService.getBusUpdatesForRoute.mockRejectedValueOnce(new Error('Service error'));
      
      const busUpdatesHandler = mockSocket.on.mock.calls.find(
        call => call[0] === TrackingEvents.ON_BUS_UPDATES_REQUESTED
      )?.[1] as (data: any) => void;
      
      // Call the handler
      await busUpdatesHandler({ routeId: 'route-1' });
      
      // Verify socket joins room despite error
      expect(mockSocket.join).toHaveBeenCalledWith('route_route-1');
      
      // Verify error is emitted
      expect(mockSocket.emit).toHaveBeenCalledWith(
        TrackingEvents.EMIT_TRACKING_ERROR, 
        expect.objectContaining({
          message: expect.stringContaining('route-1')
        })
      );
    });
  });
}); 