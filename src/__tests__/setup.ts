// Import reflect-metadata for tsyringe
import 'reflect-metadata';
import { BusStatus } from '@core/domain/enums/bus-status.enum';

// Create a proper Location type mock
const mockLocation = (coords: { latitude: number; longitude: number }) => ({
  latitude: coords.latitude,
  longitude: coords.longitude
});

// Mock MapBox SDK
jest.mock('@mapbox/mapbox-sdk/services/directions', () => {
  return jest.fn().mockImplementation(() => ({
    getDirections: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        body: {
          routes: [{ duration: 600 }] // 10 minutes
        }
      })
    })
  }));
});

jest.mock('@mapbox/mapbox-sdk/services/geocoding', () => {
  return jest.fn().mockImplementation(() => ({
    reverseGeocode: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        body: {
          features: [{ place_name: 'Test Location' }]
        }
      })
    })
  }));
});

// Mock mongoose models
jest.mock('@modules/userManagement/infrastructure/mongodb/schemas/user.schema', () => ({
  UserModel: {
    findById: jest.fn().mockResolvedValue({
      _id: 'test-user-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'USER',
      toJSON: () => ({
        _id: 'test-user-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'USER'
      })
    }),
    findByIdAndUpdate: jest.fn().mockResolvedValue({
      _id: 'test-user-id',
      firstName: 'John',
      lastName: 'Smith', // Updated
      email: 'john.doe@example.com',
      role: 'USER',
      toJSON: () => ({
        _id: 'test-user-id',
        firstName: 'John',
        lastName: 'Smith', // Updated
        email: 'john.doe@example.com',
        role: 'USER'
      })
    }),
    create: jest.fn()
  }
}));

// Mock class-transformer
jest.mock('class-transformer', () => ({
  plainToClass: jest.fn().mockImplementation((cls, plain) => {
    // For ProfileResult
    if (plain._id) {
      return {
        id: plain._id,
        firstName: plain.firstName,
        lastName: plain.lastName,
        email: plain.email,
        role: plain.role
      };
    }
    return plain;
  })
}));

// Mock BusLocationUpdateResult
jest.mock('@core/app/dtos/bus-location-update-result.dto', () => {
  return {
    BusLocationUpdateResult: jest.fn().mockImplementation(
      (busId, location, routeId, status, etas = []) => ({
        busId,
        location: mockLocation(location),
        routeId,
        status: status || BusStatus.Active,
        etas
      })
    )
  };
});

// Set environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MAPBOX_TOKEN = 'test-mapbox-token'; 