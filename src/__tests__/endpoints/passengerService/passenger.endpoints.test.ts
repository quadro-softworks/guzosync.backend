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

describe('Passenger API Endpoints', () => {
  let app: Express;
  let server: http.Server;
  let apiUrl: string;
  let passengerAuth: request.SuperAgentTest;
  let alertId: string;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    server = setup.server;
    apiUrl = setup.apiUrl;

    // Create authenticated requests for passenger
    passengerAuth = await createAuthenticatedRequest(
      app,
      testData.user.passenger.email,
      testData.user.passenger.password
    );

    // Create a test alert to use in tests
    const alertResponse = await passengerAuth
      .post(`${apiUrl}/passenger/alerts`)
      .send({
        routeId: 'test-route-id',
        busId: 'test-bus-id',
        alertType: 'DELAY',
        minutesBefore: 10
      });

    alertId = alertResponse.body.id;
  });

  afterAll(async () => {
    await teardownTestApp(server);
  });

  describe('GET /api/passenger/alerts', () => {
    it('should get passenger alerts successfully', async () => {
      const response = await passengerAuth
        .get(`${apiUrl}/passenger/alerts`);

      verifySuccessResponse(response, 200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return unauthorized error for unauthenticated request', async () => {
      const response = await request(app)
        .get(`${apiUrl}/passenger/alerts`);

      verifyErrorResponse(response, 401);
    });
  });

  describe('POST /api/passenger/alerts', () => {
    it('should create a new alert successfully', async () => {
      const response = await passengerAuth
        .post(`${apiUrl}/passenger/alerts`)
        .send({
          routeId: 'another-test-route',
          busId: 'another-test-bus',
          alertType: 'ETA_CHANGE',
          minutesBefore: 5
        });

      verifySuccessResponse(response, 201, ['id', 'alertType']);
    });

    it('should return error for invalid alert data', async () => {
      const response = await passengerAuth
        .post(`${apiUrl}/passenger/alerts`)
        .send({
          // Missing required fields
          alertType: 'INVALID_TYPE'
        });

      verifyErrorResponse(response, 400);
    });
  });

  describe('PUT /api/passenger/alerts/:alertId', () => {
    it('should update an existing alert successfully', async () => {
      const response = await passengerAuth
        .put(`${apiUrl}/passenger/alerts/${alertId}`)
        .send({
          minutesBefore: 15
        });

      verifySuccessResponse(response, 200);
    });

    it('should return not found error for invalid alert ID', async () => {
      const response = await passengerAuth
        .put(`${apiUrl}/passenger/alerts/invalid-alert-id`)
        .send({
          minutesBefore: 15
        });

      verifyErrorResponse(response, 404);
    });
  });

  describe('DELETE /api/passenger/alerts/:alertId', () => {
    it('should delete an alert successfully', async () => {
      const response = await passengerAuth
        .delete(`${apiUrl}/passenger/alerts/${alertId}`);

      verifySuccessResponse(response, 200);
    });

    it('should return not found error for invalid alert ID', async () => {
      const response = await passengerAuth
        .delete(`${apiUrl}/passenger/alerts/invalid-alert-id`);

      verifyErrorResponse(response, 404);
    });
  });

  describe('POST /api/passenger/trip/feedback', () => {
    it('should submit trip feedback successfully', async () => {
      const response = await passengerAuth
        .post(`${apiUrl}/passenger/trip/feedback`)
        .send({
          busId: 'test-bus-id',
          routeId: 'test-route-id',
          rating: 4,
          comment: 'Good service but bus was crowded',
          tripDate: new Date().toISOString()
        });

      verifySuccessResponse(response, 201);
    });

    it('should return error for invalid feedback data', async () => {
      const response = await passengerAuth
        .post(`${apiUrl}/passenger/trip/feedback`)
        .send({
          // Missing required fields
          rating: 10 // Invalid rating (assuming 1-5 scale)
        });

      verifyErrorResponse(response, 400);
    });
  });
}); 