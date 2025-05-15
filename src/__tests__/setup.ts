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

jest.mock('mongoose', () => {
  // Use createMockFromModule to retain some default behaviors if needed,
  // or just create a simple object.
  const mongoose = jest.createMockFromModule('mongoose');

  // Manually add the Schema.Types structure with ObjectId
  mongoose.Schema = {
    Types: {
      ObjectId: jest.fn(), // Mock ObjectId type or a simple placeholder object
      // Add other types if your schemas use them (e.g., String, Number, etc.)
    },
    // Add other Schema properties/methods you might need mocked if you
    // create new Schema objects in tests, though this is less common
    // for the 'type' property itself.
  };

  // Mock the connection status or methods if needed for tests that
  // check connection state. For schema loading, Schema.Types is key.
  // mongoose.connect = jest.fn();
  // mongoose.connection = {
  //   readyState: 1 // 1 means connected
  //   // ... other connection properties/methods you might use
  // };

  // Mock the model function if you are using mongoose.model in files
  // that are *not* already mocked like your UserModel above.
  // mongoose.model = jest.fn((name, schema) => ({ // Return a mock Model
  //   // Mock common model methods like find, findOne, create, etc.
  //   find: jest.fn(),
  //   findOne: jest.fn(),
  //   create: jest.fn(),
  //   // ... and so on
  // }));


  // If your schemas use mongoose.Types directly, you might need this too
  // (though less common than Schema.Types)
  // mongoose.Types = {
  //   ObjectId: jest.fn(),
  // };


  return mongoose;
});

// Set environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MAPBOX_TOKEN = 'test-mapbox-token'; 