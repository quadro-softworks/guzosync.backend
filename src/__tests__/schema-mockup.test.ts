import 'reflect-metadata';
import mongoose from 'mongoose';
import * as tsyringe from 'tsyringe';

// Mock mongoose
jest.mock('mongoose', () => {
  class MockSchema {
    definition: any;
    
    constructor(definition: any) {
      this.definition = definition;
      return this;
    }
    
    index(): MockSchema {
      return this;
    }
    
    static get Types() {
      return {
        ObjectId: 'ObjectId',
        String: String,
        Number: Number,
        Boolean: Boolean,
        Mixed: 'Mixed',
        Date: Date,
        Buffer: Buffer,
      };
    }
  }

  return {
    Schema: MockSchema,
    model: jest.fn().mockImplementation((name) => {
      return {
        name,
        find: jest.fn().mockResolvedValue([]),
        findById: jest.fn().mockResolvedValue(null),
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation((data) => Promise.resolve({
          _id: `mock-${name}-id`,
          ...data,
          toJSON: () => ({
            id: `mock-${name}-id`,
            ...data,
          }),
        })),
        updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
        deleteOne: jest.fn().mockResolvedValue({ nDeleted: 1 }),
      };
    }),
    connect: jest.fn().mockResolvedValue(undefined),
    connection: {
      readyState: 1,
    },
  };
});

// Mock tsyringe
jest.mock('tsyringe', () => {
  return {
    injectable: () => jest.fn(),
    inject: () => jest.fn(),
    container: {
      resolve: jest.fn().mockImplementation((token) => {
        // Return a mock implementation of the requested dependency
        return {};
      }),
    },
    singleton: () => jest.fn(),
  };
});

describe('Schema Mockup Tests', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should mock Mongoose Schema.Types.ObjectId', () => {
    expect(mongoose.Schema.Types.ObjectId).toBe('ObjectId');
  });

  it('should create a model with mock functions', () => {
    const UserModel = mongoose.model('User');
    
    expect(UserModel.name).toBe('User');
    expect(typeof UserModel.find).toBe('function');
    expect(typeof UserModel.findById).toBe('function');
    expect(typeof UserModel.create).toBe('function');
  });

  it('should properly mock tsyringe', () => {
    // Use the injectable decorator on a class instead of a function
    class TestClass {}
    const injectableDecorator = tsyringe.injectable();
    injectableDecorator(TestClass);
    expect(typeof TestClass).toBe('function');
  });
}); 