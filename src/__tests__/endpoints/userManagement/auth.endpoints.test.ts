import request from 'supertest';
import { Express } from 'express';
import http from 'http';
import { setupTestApp, teardownTestApp, verifySuccessResponse, verifyErrorResponse } from '../test-utils';

describe('Auth API Endpoints', () => {
  let app: Express;
  let server: http.Server;
  let apiUrl: string;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    server = setup.server;
    apiUrl = setup.apiUrl;
  });

  afterAll(async () => {
    await teardownTestApp(server);
  });

  const testUser = {
    email: 'endpoint.test@example.com',
    password: 'Secure123!',
    firstName: 'Endpoint',
    lastName: 'Test',
    role: 'PASSENGER',
  };

  describe('POST /api/accounts/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post(`${apiUrl}/accounts/register`)
        .send(testUser);

      verifySuccessResponse(response, 201, ['id', 'email']);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should return validation error for invalid data', async () => {
      const invalidUser = {
        email: 'not-an-email',
        password: '123', // Too short
        firstName: '', // Empty
        lastName: 'Test',
        role: 'INVALID_ROLE',
      };

      const response = await request(app)
        .post(`${apiUrl}/accounts/register`)
        .send(invalidUser);

      verifyErrorResponse(response, 400);
    });
  });

  describe('POST /api/accounts/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post(`${apiUrl}/accounts/login`)
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      verifySuccessResponse(response, 200, ['token']);
      expect(typeof response.body.token).toBe('string');
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post(`${apiUrl}/accounts/login`)
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

      verifyErrorResponse(response, 401);
    });
  });

  describe('POST /api/accounts/logout', () => {
    it('should logout successfully with valid token', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post(`${apiUrl}/accounts/login`)
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      const token = loginResponse.body.token;

      const logoutResponse = await request(app)
        .post(`${apiUrl}/accounts/logout`)
        .set('Authorization', `Bearer ${token}`);

      verifySuccessResponse(logoutResponse, 200);
    });

    it('should return error when accessing without token', async () => {
      const response = await request(app)
        .post(`${apiUrl}/accounts/logout`);

      verifyErrorResponse(response, 401);
    });
  });

  describe('GET /api/account/me', () => {
    let authToken: string;

    beforeAll(async () => {
      // Login to get a token
      const loginResponse = await request(app)
        .post(`${apiUrl}/accounts/login`)
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      authToken = loginResponse.body.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get(`${apiUrl}/account/me`)
        .set('Authorization', `Bearer ${authToken}`);

      verifySuccessResponse(response, 200, ['id', 'email', 'firstName', 'lastName']);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should return error when accessing without token', async () => {
      const response = await request(app).get(`${apiUrl}/account/me`);

      verifyErrorResponse(response, 401);
    });
  });
}); 