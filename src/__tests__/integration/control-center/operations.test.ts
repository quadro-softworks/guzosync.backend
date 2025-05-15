import request from 'supertest';
import { setupTestApp, teardownTestApp, testData } from '../test-utils';
import { Express } from 'express';
import http from 'http';

describe('Control Center Operations Integration Tests', () => {
  let app: Express;
  let server: http.Server;
  let apiUrl: string;
  let controlCenterToken: string;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    server = setup.server;
    apiUrl = setup.apiUrl;
    
    // Register and authenticate control center admin
    const controlCenterData = testData.user.controlCenter;
    
    // Register admin user
    await request(app)
      .post(`${apiUrl}/accounts/register`)
      .send(controlCenterData);
    
    // Login to get token
    const adminLogin = await request(app)
      .post(`${apiUrl}/accounts/login`)
      .send({
        email: controlCenterData.email,
        password: controlCenterData.password,
      });
    controlCenterToken = adminLogin.body.token;
  });

  afterAll(async () => {
    await teardownTestApp(server);
  });

  // Test variables
  let routeId: string;
  let busId: string;
  let busStopId: string;
  let driverId: string;
  let regulatorId: string;

  describe('Personnel Management', () => {
    it('should register a new bus driver', async () => {
      const response = await request(app)
        .post(`${apiUrl}/control-center/personnel/register`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          email: 'driver_test@example.com',
          password: 'Driver123!',
          firstName: 'Test',
          lastName: 'Driver',
          role: 'BUS_DRIVER',
          licenseNumber: 'DL12345678',
          experience: 5,
          phoneNumber: '+1234567890',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      driverId = response.body.id;
    });

    it('should register a new queue regulator', async () => {
      const response = await request(app)
        .post(`${apiUrl}/control-center/personnel/register`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          email: 'regulator_test@example.com',
          password: 'Regulator123!',
          firstName: 'Test',
          lastName: 'Regulator',
          role: 'QUEUE_REGULATOR',
          employeeId: 'REG12345',
          phoneNumber: '+1234567891',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      regulatorId = response.body.id;
    });

    it('should list all bus drivers', async () => {
      const response = await request(app)
        .get(`${apiUrl}/control-center/personnel/bus-drivers`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Find our test driver
      const foundDriver = response.body.items.find(
        (driver: any) => driver.email === 'driver_test@example.com'
      );
      expect(foundDriver).toBeDefined();
    });

    it('should list all queue regulators', async () => {
      const response = await request(app)
        .get(`${apiUrl}/control-center/personnel/queue-regulators`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Find our test regulator
      const foundRegulator = response.body.items.find(
        (regulator: any) => regulator.email === 'regulator_test@example.com'
      );
      expect(foundRegulator).toBeDefined();
    });
  });

  describe('Bus Stop Management', () => {
    it('should create a new bus stop', async () => {
      const response = await request(app)
        .post(`${apiUrl}/control-center/bus-stops`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          name: 'Test Bus Stop',
          location: testData.location.addisAbaba,
          description: 'A test bus stop for integration testing',
          features: ['SHELTER', 'SEATING', 'LIGHTING'],
          capacity: 50,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      busStopId = response.body.id;
    });

    it('should assign a queue regulator to a bus stop', async () => {
      const response = await request(app)
        .put(`${apiUrl}/control-center/personnel/queue-regulators/${regulatorId}/assign/bus-stop/${busStopId}`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
    });

    it('should list all bus stops', async () => {
      const response = await request(app)
        .get(`${apiUrl}/control-center/bus-stops`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Find our test bus stop
      const foundBusStop = response.body.items.find(
        (stop: any) => stop.name === 'Test Bus Stop'
      );
      expect(foundBusStop).toBeDefined();
    });
  });

  describe('Route Management', () => {
    it('should create a new route', async () => {
      const response = await request(app)
        .post(`${apiUrl}/control-center/routes`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          name: 'Test Route',
          description: 'A test route for integration testing',
          stops: [
            {
              name: 'Start Stop',
              location: testData.location.addisAbaba,
            },
            {
              name: 'End Stop',
              location: testData.location.mekelle,
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      routeId = response.body.id;
    });

    it('should list all routes', async () => {
      const response = await request(app)
        .get(`${apiUrl}/control-center/routes`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Find our test route
      const foundRoute = response.body.items.find(
        (route: any) => route.name === 'Test Route'
      );
      expect(foundRoute).toBeDefined();
    });

    it('should update a route', async () => {
      const response = await request(app)
        .put(`${apiUrl}/control-center/routes/${routeId}`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          name: 'Updated Test Route',
          description: 'An updated test route',
        });

      expect(response.status).toBe(200);
      
      // Verify the update
      const getResponse = await request(app)
        .get(`${apiUrl}/control-center/routes/${routeId}`)
        .set('Authorization', `Bearer ${controlCenterToken}`);
        
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toHaveProperty('name', 'Updated Test Route');
    });
  });

  describe('Bus Management', () => {
    it('should create a new bus', async () => {
      const response = await request(app)
        .post(`${apiUrl}/control-center/buses`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          registrationNumber: 'TEST-BUS-001',
          capacity: 50,
          type: 'STANDARD',
          status: 'ACTIVE',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      busId = response.body.id;
    });

    it('should assign a bus to a route', async () => {
      const response = await request(app)
        .put(`${apiUrl}/control-center/buses/${busId}/assign-route/${routeId}`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
    });

    it('should assign a driver to a bus', async () => {
      const response = await request(app)
        .put(`${apiUrl}/control-center/personnel/bus-drivers/${driverId}/assign-bus/${busId}`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
    });

    it('should list all buses', async () => {
      const response = await request(app)
        .get(`${apiUrl}/control-center/buses`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Find our test bus
      const foundBus = response.body.items.find(
        (bus: any) => bus.registrationNumber === 'TEST-BUS-001'
      );
      expect(foundBus).toBeDefined();
    });
  });

  describe('Reallocation Management', () => {
    it('should handle a reallocation request', async () => {
      // First we need to create a reallocation request
      // (In a real app this would come from a queue regulator)
      const createResponse = await request(app)
        .post(`${apiUrl}/buses/reallocate`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          busStopId,
          estimatedPassengers: 75,
          reason: 'Overcrowding at test stop',
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body).toHaveProperty('id');
      const requestId = createResponse.body.id;
      
      // Now control center approves the request
      const approveResponse = await request(app)
        .put(`${apiUrl}/control-center/reallocation-requests/${requestId}/approve`)
        .set('Authorization', `Bearer ${controlCenterToken}`);
        
      expect(approveResponse.status).toBe(200);
      
      // Check the request status
      const checkResponse = await request(app)
        .get(`${apiUrl}/control-center/reallocation-requests/${requestId}`)
        .set('Authorization', `Bearer ${controlCenterToken}`);
        
      expect(checkResponse.status).toBe(200);
      expect(checkResponse.body).toHaveProperty('status', 'APPROVED');
    });
  });

  describe('Analytics and Reporting', () => {
    it('should get bus performance report', async () => {
      const response = await request(app)
        .get(`${apiUrl}/control-center/reports/bus-performance`)
        .query({
          fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          toDate: new Date().toISOString(),
        })
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('report');
    });

    it('should get route performance report', async () => {
      const response = await request(app)
        .get(`${apiUrl}/control-center/reports/route-performance`)
        .query({
          fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          toDate: new Date().toISOString(),
        })
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('report');
    });
  });
}); 