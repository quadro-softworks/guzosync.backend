import { MapBoxService } from '@modules/busRouteManagement/services/map.service';
import * as turf from '@turf/turf';

// Mock turf
jest.mock('@turf/turf', () => ({
  point: jest.fn().mockImplementation((coords) => ({ type: 'Point', coordinates: coords })),
  distance: jest.fn().mockReturnValue(5), // Mock 5km distance
  nearestPointOnLine: jest.fn().mockImplementation((line, point) => ({
    geometry: {
      coordinates: [point.geometry.coordinates[0] + 0.001, point.geometry.coordinates[1] + 0.001]
    }
  }))
}));

// Mock MapBox SDK
const mockDirectionsClient = {
  getDirections: jest.fn().mockReturnValue({
    send: jest.fn().mockResolvedValue({
      body: {
        routes: [{ duration: 600 }] // 10 minutes
      }
    })
  })
};

jest.mock('@mapbox/mapbox-sdk/services/directions', () => {
  return jest.fn().mockImplementation(() => mockDirectionsClient);
});

describe('MapBoxService', () => {
  let service: MapBoxService;
  const originalEnv = process.env;

  beforeEach(() => {
    // Set test environment variables
    process.env.MAPBOX_TOKEN = 'test-token';
    
    // Create service instance
    service = new MapBoxService();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('calculateDistanceKm', () => {
    it('should calculate distance between two points', () => {
      const origin = { latitude: 9.005401, longitude: 38.763611 }; // Addis Ababa coordinates
      const destination = { latitude: 9.015401, longitude: 38.773611 }; // Nearby point
      
      const result = service.calculateDistanceKm(origin, destination);
      
      expect(turf.point).toHaveBeenCalledTimes(2);
      expect(turf.distance).toHaveBeenCalledTimes(1);
      expect(result).toBe(5); // Our mocked value
    });
  });

  describe('estimateTravelTimeBasic', () => {
    it('should estimate travel time based on distance', () => {
      const origin = { latitude: 9.005401, longitude: 38.763611 };
      const destination = { latitude: 9.015401, longitude: 38.773611 };
      
      // Using private method through any cast
      const result = (service as any).estimateTravelTimeBasic(origin, destination);
      
      // 5km at 25km/h = 0.2h = 12 minutes
      expect(result).toBe(12);
    });
  });

  describe('findNearestPointOnRoute', () => {
    it('should find the nearest point on a route', () => {
      const routeGeometry = { type: 'LineString', coordinates: [[38.763611, 9.005401], [38.773611, 9.015401]] };
      const location = { latitude: 9.010401, longitude: 38.768611 };
      
      const result = service.findNearestPointOnRoute(routeGeometry, location);
      
      expect(turf.nearestPointOnLine).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        longitude: 38.768611 + 0.001,
        latitude: 9.010401 + 0.001
      });
    });

    it('should return null if an error occurs', () => {
      (turf.nearestPointOnLine as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Turf error');
      });
      
      const routeGeometry = { type: 'LineString', coordinates: [[38.763611, 9.005401], [38.773611, 9.015401]] };
      const location = { latitude: 9.010401, longitude: 38.768611 };
      
      const result = service.findNearestPointOnRoute(routeGeometry, location);
      
      expect(result).toBeNull();
    });
  });

  describe('estimateTravelTimeBetweenPoints', () => {
    it('should estimate travel time between points', async () => {
      const origin = { latitude: 9.005401, longitude: 38.763611 };
      const destination = { latitude: 9.015401, longitude: 38.773611 };
      
      const result = await service.estimateTravelTimeBetweenPoints(origin, destination);
      
      // Since we mocked the MapBox response to be 600 seconds (10 minutes)
      expect(result).toBe(10);
    });
    
    it('should fall back to basic calculation if MapBox request fails', async () => {
      // Mock a rejection for this specific test
      mockDirectionsClient.getDirections().send.mockRejectedValueOnce(new Error('API error'));
      
      const origin = { latitude: 9.005401, longitude: 38.763611 };
      const destination = { latitude: 9.015401, longitude: 38.773611 };
      
      // Mock the basic estimation method
      jest.spyOn(service as any, 'estimateTravelTimeBasic').mockReturnValueOnce(15);
      
      const result = await service.estimateTravelTimeBetweenPoints(origin, destination);
      
      expect(result).toBe(15);
      expect((service as any).estimateTravelTimeBasic).toHaveBeenCalledWith(origin, destination);
    });
    
    it('should fall back to basic calculation if no MAPBOX_TOKEN', async () => {
      process.env.MAPBOX_TOKEN = '';
      const newService = new MapBoxService(); // Recreate with empty token
      
      jest.spyOn(newService as any, 'estimateTravelTimeBasic').mockReturnValueOnce(15);
      
      const origin = { latitude: 9.005401, longitude: 38.763611 };
      const destination = { latitude: 9.015401, longitude: 38.773611 };
      
      const result = await newService.estimateTravelTimeBetweenPoints(origin, destination);
      
      expect(result).toBe(15);
      expect((newService as any).estimateTravelTimeBasic).toHaveBeenCalledWith(origin, destination);
    });
  });
}); 