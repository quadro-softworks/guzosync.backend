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

describe('Bus API Endpoints', () => {
  let app: Express;
  let server: http.Server;
  let apiUrl: string;
  let controlCenterAuth: request.SuperAgentTest;
  let driverAuth: request.SuperAgentTest;
  let busId: string;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    server = setup.server;
    apiUrl = setup.apiUrl;

    // Create authenticated requests
    controlCenterAuth = await createAuthenticatedRequest(
      app,
      testData.user.controlCenter.email,
      testData.user.controlCenter.password
    );

    driverAuth = await createAuthenticatedRequest(
      app,
      testData.user.driver.email,
      testData.user.driver.password
    );

    // Register a test bus to use in tests
    const busResponse = await controlCenterAuth
      .post(`${apiUrl}/control-center/buses`)
      .send({
        registrationNumber: 'TEST-BUS-001',
        capacity: 40,
        busType: 'STANDARD',
        status: 'ACTIVE'
      });

    busId = busResponse.body.id;
  });

  afterAll(async () => {
    await teardownTestApp(server);
  });

  describe('GET /api/buses/:busId', () => {
    it('should get bus details successfully', async () => {
      const response = await request(app)
        .get(`${apiUrl}/buses/${busId}`);

      verifySuccessResponse(response, 200, ['id', 'registrationNumber', 'capacity']);
      expect(response.body.registrationNumber).toBe('TEST-BUS-001');
    });

    it('should return error for invalid bus ID', async () => {
      const response = await request(app)
        .get(`${apiUrl}/buses/invalid-bus-id`);

      verifyErrorResponse(response, 404);
    });
  });

  describe('PUT /api/buses/:busId/location', () => {
    it('should update bus location successfully', async () => {
      const response = await driverAuth
        .put(`${apiUrl}/buses/${busId}/location`)
        .send({
          location: {
            coordinates: [38.763611, 9.005401]
          }
        });

      verifySuccessResponse(response, 200);
      // Verify bus location was updated
      const busResponse = await request(app).get(`${apiUrl}/buses/${busId}`);
      expect(busResponse.body.location).toBeDefined();
    });

    it('should return error for invalid location data', async () => {
      const response = await driverAuth
        .put(`${apiUrl}/buses/${busId}/location`)
        .send({
          location: {
            coordinates: ['invalid', 'coordinates']
          }
        });

      verifyErrorResponse(response, 400);
    });
  });

  describe('POST /api/buses/mobile/location', () => {
    it('should update bus location from mobile device', async () => {
      const response = await driverAuth
        .post(`${apiUrl}/buses/mobile/location`)
        .send({
          busId: busId,
          latitude: 9.005401,
          longitude: 38.763611,
          accuracy: 10,
          speed: 35,
          heading: 90,
          timestamp: new Date().toISOString()
        });

      verifySuccessResponse(response, 200);
    });

    it('should return error for missing data', async () => {
      const response = await driverAuth
        .post(`${apiUrl}/buses/mobile/location`)
        .send({
          // Missing required fields
          busId: busId
        });

      verifyErrorResponse(response, 400);
    });
  });
}); 