import request from 'supertest';
import { setupTestApp, teardownTestApp, testData } from '../test-utils';
import { Express } from 'express';
import http from 'http';

describe('Passenger Services Integration Tests', () => {
  let app: Express;
  let server: http.Server;
  let apiUrl: string;
  let passengerToken: string;
  let controlCenterToken: string;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    server = setup.server;
    apiUrl = setup.apiUrl;
    
    // Register and authenticate users
    const passengerData = testData.user.passenger;
    const controlCenterData = testData.user.controlCenter;
    
    // Register users
    await request(app)
      .post(`${apiUrl}/accounts/register`)
      .send(passengerData);
      
    await request(app)
      .post(`${apiUrl}/accounts/register`)
      .send(controlCenterData);
    
    // Login users to get tokens
    const passengerLogin = await request(app)
      .post(`${apiUrl}/accounts/login`)
      .send({
        email: passengerData.email,
        password: passengerData.password,
      });
    passengerToken = passengerLogin.body.token;
    
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
  let busId: string;
  let routeId: string;
  let busStopId: string;
  let alertId: string;

  describe('Environment Setup', () => {
    it('should create test infrastructure', async () => {
      // Create a bus stop first
      const busStopResponse = await request(app)
        .post(`${apiUrl}/control-center/bus-stops`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          name: 'Passenger Test Stop',
          location: testData.location.addisAbaba,
          description: 'A test bus stop for passenger service testing',
          features: ['SHELTER', 'SEATING'],
          capacity: 50,
        });

      expect(busStopResponse.status).toBe(201);
      busStopId = busStopResponse.body.id;

      // Create a route
      const routeResponse = await request(app)
        .post(`${apiUrl}/control-center/routes`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          name: 'Passenger Test Route',
          description: 'A test route for passenger service testing',
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

      expect(routeResponse.status).toBe(201);
      routeId = routeResponse.body.id;

      // Create a bus
      const busResponse = await request(app)
        .post(`${apiUrl}/control-center/buses`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          registrationNumber: 'PASS-TEST-001',
          capacity: 40,
          type: 'STANDARD',
          status: 'ACTIVE',
        });

      expect(busResponse.status).toBe(201);
      busId = busResponse.body.id;

      // Assign bus to route
      const assignResponse = await request(app)
        .put(`${apiUrl}/control-center/buses/${busId}/assign-route/${routeId}`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(assignResponse.status).toBe(200);
    });
  });

  describe('Bus Stop Information', () => {
    it('should return list of all bus stops', async () => {
      const response = await request(app)
        .get(`${apiUrl}/buses/stops`)
        .set('Authorization', `Bearer ${passengerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Find our test bus stop
      const foundBusStop = response.body.items.find(
        (stop: any) => stop.name === 'Passenger Test Stop'
      );
      expect(foundBusStop).toBeDefined();
    });

    it('should search for bus stops by name', async () => {
      const response = await request(app)
        .get(`${apiUrl}/buses/stops`)
        .query({ search: 'Passenger Test' })
        .set('Authorization', `Bearer ${passengerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      
      // All results should match search term
      const allMatch = response.body.items.every(
        (stop: any) => stop.name.includes('Passenger Test')
      );
      expect(allMatch).toBe(true);
    });
  });

  describe('Bus and Route Information', () => {
    it('should get details of a specific bus', async () => {
      const response = await request(app)
        .get(`${apiUrl}/buses/${busId}`)
        .set('Authorization', `Bearer ${passengerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', busId);
      expect(response.body).toHaveProperty('registrationNumber', 'PASS-TEST-001');
      expect(response.body).toHaveProperty('routeId', routeId);
    });

    it('should get details of a specific route', async () => {
      const response = await request(app)
        .get(`${apiUrl}/routes/${routeId}`)
        .set('Authorization', `Bearer ${passengerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', routeId);
      expect(response.body).toHaveProperty('name', 'Passenger Test Route');
      expect(response.body).toHaveProperty('stops');
      expect(Array.isArray(response.body.stops)).toBe(true);
      expect(response.body.stops.length).toBe(2);
    });
  });

  describe('Alerts Management', () => {
    it('should create a bus alert', async () => {
      const response = await request(app)
        .post(`${apiUrl}/passenger/alerts`)
        .set('Authorization', `Bearer ${passengerToken}`)
        .send({
          busId,
          routeId,
          type: 'ARRIVAL',
          stopName: 'End Stop',
          minutesBefore: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      alertId = response.body.id;
    });

    it('should get passenger alerts', async () => {
      const response = await request(app)
        .get(`${apiUrl}/passenger/alerts`)
        .set('Authorization', `Bearer ${passengerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Find our alert
      const foundAlert = response.body.items.find(
        (alert: any) => alert.id === alertId
      );
      expect(foundAlert).toBeDefined();
      expect(foundAlert).toHaveProperty('busId', busId);
      expect(foundAlert).toHaveProperty('routeId', routeId);
      expect(foundAlert).toHaveProperty('type', 'ARRIVAL');
    });

    it('should update an alert', async () => {
      const response = await request(app)
        .put(`${apiUrl}/passenger/alerts/${alertId}`)
        .set('Authorization', `Bearer ${passengerToken}`)
        .send({
          minutesBefore: 15, // Update minutes before
        });

      expect(response.status).toBe(200);
      
      // Verify update
      const checkResponse = await request(app)
        .get(`${apiUrl}/passenger/alerts`)
        .set('Authorization', `Bearer ${passengerToken}`);
        
      const updatedAlert = checkResponse.body.items.find(
        (alert: any) => alert.id === alertId
      );
      expect(updatedAlert).toHaveProperty('minutesBefore', 15);
    });

    it('should delete an alert', async () => {
      const response = await request(app)
        .delete(`${apiUrl}/passenger/alerts/${alertId}`)
        .set('Authorization', `Bearer ${passengerToken}`);

      expect(response.status).toBe(200);
      
      // Verify deletion
      const checkResponse = await request(app)
        .get(`${apiUrl}/passenger/alerts`)
        .set('Authorization', `Bearer ${passengerToken}`);
        
      const deletedAlert = checkResponse.body.items.find(
        (alert: any) => alert.id === alertId
      );
      expect(deletedAlert).toBeUndefined();
    });
  });

  describe('Trip Feedback', () => {
    it('should submit trip feedback', async () => {
      const feedback = {
        busId,
        routeId,
        rating: 4,
        comment: 'Good service, bus was clean but slightly delayed',
        categories: ['CLEANLINESS', 'TIMELINESS'],
      };

      const response = await request(app)
        .post(`${apiUrl}/passenger/trip/feedback`)
        .set('Authorization', `Bearer ${passengerToken}`)
        .send(feedback);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should get passenger feedback history', async () => {
      const response = await request(app)
        .get(`${apiUrl}/passenger/trip/feedback`)
        .set('Authorization', `Bearer ${passengerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      
      // Check latest feedback
      const latestFeedback = response.body.items[0];
      expect(latestFeedback).toHaveProperty('busId', busId);
      expect(latestFeedback).toHaveProperty('routeId', routeId);
      expect(latestFeedback).toHaveProperty('rating', 4);
    });
  });
}); 