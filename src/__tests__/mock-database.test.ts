import 'reflect-metadata';
import mongoose from 'mongoose';

// Mock mongoose entirely
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true),
  connection: {
    readyState: 1,
  },
  Schema: jest.fn().mockImplementation(() => ({
    index: jest.fn().mockReturnThis(),
  })),
  model: jest.fn().mockImplementation((name) => ({
    findById: jest.fn().mockResolvedValue({
      _id: `mock-${name}-id`,
      name: `Mock ${name}`,
      toJSON: () => ({ _id: `mock-${name}-id`, name: `Mock ${name}` }),
    }),
    find: jest.fn().mockResolvedValue([
      {
        _id: `mock-${name}-id-1`,
        name: `Mock ${name} 1`,
        toJSON: () => ({ _id: `mock-${name}-id-1`, name: `Mock ${name} 1` }),
      },
      {
        _id: `mock-${name}-id-2`,
        name: `Mock ${name} 2`,
        toJSON: () => ({ _id: `mock-${name}-id-2`, name: `Mock ${name} 2` }),
      },
    ]),
    create: jest.fn().mockImplementation((data) => Promise.resolve({
      _id: `new-${name}-id`,
      ...data,
      toJSON: () => ({ _id: `new-${name}-id`, ...data }),
    })),
    findByIdAndUpdate: jest.fn().mockImplementation((id, data) => Promise.resolve({
      _id: id,
      ...data,
      toJSON: () => ({ _id: id, ...data }),
    })),
    findByIdAndDelete: jest.fn().mockResolvedValue({ _id: `deleted-${name}-id` }),
  })),
}));

// Mock DB Connection
jest.mock('@core/database/mongo', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));

describe('Database mock tests', () => {
  it('should mock mongoose.connect', async () => {
    const connectResult = await mongoose.connect('mongodb://fake-url');
    expect(connectResult).toBe(true);
    expect(mongoose.connect).toHaveBeenCalled();
  });

  it('should create a mock model', () => {
    const UserModel = mongoose.model('User');
    expect(UserModel).toBeDefined();
    expect(UserModel.findById).toBeDefined();
    expect(UserModel.find).toBeDefined();
    expect(UserModel.create).toBeDefined();
  });

  it('should mock finding a document', async () => {
    const UserModel = mongoose.model('User');
    const user = await UserModel.findById('some-id');
    expect(user).toHaveProperty('_id', 'mock-User-id');
    expect(user).toHaveProperty('name', 'Mock User');
  });

  it('should mock creating a document', async () => {
    const UserModel = mongoose.model('User');
    const newUser = await UserModel.create({ name: 'New User', email: 'user@example.com' });
    expect(newUser).toHaveProperty('_id', 'new-User-id');
    expect(newUser).toHaveProperty('name', 'New User');
    expect(newUser).toHaveProperty('email', 'user@example.com');
  });
}); 