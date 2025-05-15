import request from 'supertest';
import { Express } from 'express';
import http from 'http';
import {
  setupTestApp,
  teardownTestApp,
  testData,
  createAuthenticatedRequest,
  verifySuccessResponse,
  verifyErrorResponse
} from '../test-utils';

describe('Control Center API Endpoints', () => {
  let app: Express;
  let server: http.Server;
  let apiUrl: string;
  let controlCenterAuth: request.SuperAgentTest;
  let busId: string;
  let routeId: string;
  let busStopId: string;
  let regulatorId: string;
  let driverId: string;
  let reallocationRequestId: string;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    server = setup.server;
    apiUrl = setup.apiUrl;

    // Create authenticated requests for control center admin
    controlCenterAuth = await createAuthenticatedRequest(
      app,
      testData.user.controlCenter.email,
      testData.user.controlCenter.password
    );

    // Register test entities for use in tests
    const busResponse = await controlCenterAuth
      .post(`${apiUrl}/control-center/buses`)
      .send({
        registrationNumber: 'CC-TEST-001',
        capacity: 50,
        busType: 'STANDARD',
        status: 'ACTIVE'
      });
    busId = busResponse.body.id;

    const routeResponse = await controlCenterAuth
      .post(`${apiUrl}/control-center/routes`)
      .send({
        name: 'Test Route',
        description: 'Test route for endpoint tests',
        stops: [
          { name: 'Stop 1', latitude: 9.005401, longitude: 38.763611 },
          { name: 'Stop 2', latitude: 9.015401, longitude: 38.773611 }
        ]
      });
    routeId = routeResponse.body.id;

    const busStopResponse = await controlCenterAuth
      .post(`${apiUrl}/control-center/bus-stops`)
      .send({
        name: 'Test Bus Stop',
        latitude: 9.025401,
        longitude: 38.783611,
        description: 'Test bus stop for endpoint tests'
      });
    busStopId = busStopResponse.body.id;

    const regulatorResponse = await controlCenterAuth
      .post(`${apiUrl}/control-center/personnel/register`)
      .send({
        email: 'test.regulator@example.com',
        password: 'Regulator123!',
        firstName: 'Test',
        lastName: 'Regulator',
        role: 'QUEUE_REGULATOR'
      });
    regulatorId = regulatorResponse.body.id;

    const driverResponse = await controlCenterAuth
      .post(`${apiUrl}/control-center/personnel/register`)
      .send({
        email: 'test.driver@example.com',
        password: 'Driver123!',
        firstName: 'Test',
        lastName: 'Driver',
        role: 'BUS_DRIVER'
      });
    driverId = driverResponse.body.id;

    // Create a test reallocation request
    const reallocationResponse = await controlCenterAuth
      .post(`${apiUrl}/buses/reallocate`)
      .send({
        busStopId: busStopId,
        estimatedPassengers: 100,
        reason: 'Test reallocation request'
      });
    reallocationRequestId = reallocationResponse.body.id;
  });

  afterAll(async () => {
    await teardownTestApp(server);
  });

  describe('GET /api/control-center/buses', () => {
    it('should get all buses successfully', async () => {
      const response = await controlCenterAuth
        .get(`${apiUrl}/control-center/buses`);

      verifySuccessResponse(response, 200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return unauthorized error for unauthenticated request', async () => {
      const response = await request(app)
        .get(`${apiUrl}/control-center/buses`);

      verifyErrorResponse(response, 401);
    });
  });

  describe('GET /api/control-center/buses/:busId', () => {
    it('should get specific bus details successfully', async () => {
      const response = await controlCenterAuth
        .get(`${apiUrl}/control-center/buses/${busId}`);

      verifySuccessResponse(response, 200, ['id', 'registrationNumber']);
      expect(response.body.id).toBe(busId);
    });

    it('should return not found error for invalid bus ID', async () => {
      const response = await controlCenterAuth
        .get(`${apiUrl}/control-center/buses/invalid-bus-id`);

      verifyErrorResponse(response, 404);
    });
  });

  describe('PUT /api/control-center/buses/:busId/assign-route/:routeId', () => {
    it('should assign a bus to a route successfully', async () => {
      const response = await controlCenterAuth
        .put(`${apiUrl}/control-center/buses/${busId}/assign-route/${routeId}`);

      verifySuccessResponse(response, 200);
    });

    it('should return error for invalid bus or route ID', async () => {
      const response = await controlCenterAuth
        .put(`${apiUrl}/control-center/buses/${busId}/assign-route/invalid-route-id`);

      verifyErrorResponse(response, 404);
    });
  });

  describe('GET /api/control-center/reallocation-requests', () => {
    it('should get all reallocation requests successfully', async () => {
      const response = await controlCenterAuth
        .get(`${apiUrl}/control-center/reallocation-requests`);

      verifySuccessResponse(response, 200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should filter reallocation requests by status', async () => {
      const response = await controlCenterAuth
        .get(`${apiUrl}/control-center/reallocation-requests?status=pending`);

      verifySuccessResponse(response, 200);
      expect(Array.isArray(response.body)).toBeTruthy();
      // Verify all returned requests have pending status
      if (response.body.length > 0) {
        expect(response.body.every((req: { status: string }) => req.status === 'PENDING')).toBeTruthy();
      }
    });
  });

  describe('PUT /api/control-center/reallocation-requests/:requestId/approve', () => {
    it('should approve a reallocation request successfully', async () => {
      const response = await controlCenterAuth
        .put(`${apiUrl}/control-center/reallocation-requests/${reallocationRequestId}/approve`);

      verifySuccessResponse(response, 200);
      
      // Verify the request status changed to APPROVED
      const requestResponse = await controlCenterAuth
        .get(`${apiUrl}/control-center/reallocation-requests/${reallocationRequestId}`);
        
      expect(requestResponse.body.status).toBe('APPROVED');
    });

    it('should return not found error for invalid request ID', async () => {
      const response = await controlCenterAuth
        .put(`${apiUrl}/control-center/reallocation-requests/invalid-request-id/approve`);

      verifyErrorResponse(response, 404);
    });
  });

  describe('PUT /api/control-center/personnel/queue-regulators/:regulatorId/assign/bus-stop/:busStopId', () => {
    it('should assign a regulator to a bus stop successfully', async () => {
      const response = await controlCenterAuth
        .put(`${apiUrl}/control-center/personnel/queue-regulators/${regulatorId}/assign/bus-stop/${busStopId}`);

      verifySuccessResponse(response, 200);
    });

    it('should return error for invalid regulator or bus stop ID', async () => {
      const response = await controlCenterAuth
        .put(`${apiUrl}/control-center/personnel/queue-regulators/${regulatorId}/assign/bus-stop/invalid-stop-id`);

      verifyErrorResponse(response, 404);
    });
  });

  describe('PUT /api/control-center/personnel/bus-drivers/:driverId/assign-bus/:busId', () => {
    it('should assign a driver to a bus successfully', async () => {
      const response = await controlCenterAuth
        .put(`${apiUrl}/control-center/personnel/bus-drivers/${driverId}/assign-bus/${busId}`);

      verifySuccessResponse(response, 200);
    });

    it('should return error for invalid driver or bus ID', async () => {
      const response = await controlCenterAuth
        .put(`${apiUrl}/control-center/personnel/bus-drivers/${driverId}/assign-bus/invalid-bus-id`);

      verifyErrorResponse(response, 404);
    });
  });
}); 