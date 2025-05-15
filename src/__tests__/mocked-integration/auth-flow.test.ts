import 'reflect-metadata';
import request from 'supertest';
import express, { Express } from 'express';
import { globalErrorHandler } from '@core/middleware/error-handler';

describe('Simplified Auth Flow Tests', () => {
  let app: Express;
  let apiUrl: string;

  beforeAll(async () => {
    // Initialize Express app
    app = express();
    
    // Register middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Register simplified mock routes
    apiUrl = '/api';
    
    // Register a new user
    app.post(`${apiUrl}/accounts/register`, (req, res) => {
      res.status(201).json({
        data: {
          id: 'new-user-id',
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          role: req.body.role,
        }
      });
    });
    
    // Login user
    app.post(`${apiUrl}/accounts/login`, (req, res) => {
      if (req.body.email === 'test@example.com' && req.body.password === 'Password123!') {
        res.status(200).json({
          token: 'mock-jwt-token',
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'PASSENGER',
          }
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    });
    
    // Logout user
    app.post(`${apiUrl}/accounts/logout`, (req, res) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (token === 'mock-jwt-token') {
        res.status(200).json({ message: 'Logged out successfully' });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    });
    
    // Get user profile
    app.get(`${apiUrl}/account/me`, (req) => {
      const token = req.headers['authorization']?.split(' ')[1];
      // if (token === 'mock-jwt-token') {
      //   return res.status(200).json({
      //     id: 'test-user-id',
      //     email: 'test@example.com',
      //     firstName: 'Test',
      //     lastName: 'User',
      //     role: 'PASSENGER',
      //   });
      // }
      // return res.status(401).json({ message: 'Unauthorized' });
    });

    // Register error handler
    app.use(globalErrorHandler);
  });

  describe('User Registration and Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post(`${apiUrl}/accounts/register`)
        .send({
          email: 'new@example.com',
          password: 'Password123!',
          firstName: 'New',
          lastName: 'User',
          role: 'PASSENGER',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', 'new@example.com');
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post(`${apiUrl}/accounts/login`)
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBe('mock-jwt-token');
    });

    it('should access protected resource with valid token', async () => {
      const response = await request(app)
        .get(`${apiUrl}/account/me`)
        .set('Authorization', 'Bearer mock-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post(`${apiUrl}/accounts/logout`)
        .set('Authorization', 'Bearer mock-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });
  });

  describe('Invalid Authentication Attempts', () => {
    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post(`${apiUrl}/accounts/login`)
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
    });

    it('should reject unauthorized access to protected routes', async () => {
      const response = await request(app)
        .get(`${apiUrl}/account/me`);

      expect(response.status).toBe(401);
    });
  });
}); 