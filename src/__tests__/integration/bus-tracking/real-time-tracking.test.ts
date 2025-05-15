import request from 'supertest';
import { setupTestApp, teardownTestApp, createSocketClient, testData } from '../test-utils';
import { Express } from 'express';
import http from 'http';
import { Socket } from 'socket.io-client';

describe('Real-time Bus Tracking Integration Tests', () => {
  let app: Express;
  let server: http.Server;
  let apiUrl: string;
  let passengerSocket: Socket;
  let driverSocket: Socket;
  let controlCenterSocket: Socket;
  let passengerToken: string;
  let driverToken: string;
  let controlCenterToken: string;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    server = setup.server;
    apiUrl = setup.apiUrl;
    
    // Register and authenticate users
    const passengerData = testData.user.passenger;
    const driverData = testData.user.driver;
    const controlCenterData = testData.user.controlCenter;
    
    // Register users
    await request(app)
      .post(`${apiUrl}/accounts/register`)
      .send(passengerData);
      
    await request(app)
      .post(`${apiUrl}/accounts/register`)
      .send(driverData);
      
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
    
    const driverLogin = await request(app)
      .post(`${apiUrl}/accounts/login`)
      .send({
        email: driverData.email,
        password: driverData.password,
      });
    driverToken = driverLogin.body.token;
    
    const adminLogin = await request(app)
      .post(`${apiUrl}/accounts/login`)
      .send({
        email: controlCenterData.email,
        password: controlCenterData.password,
      });
    controlCenterToken = adminLogin.body.token;
    
    // Connect WebSocket clients
    passengerSocket = (await createSocketClient(server, passengerToken))!;
    driverSocket = (await createSocketClient(server, driverToken))!;
    controlCenterSocket = (await createSocketClient(server, controlCenterToken))!;
  });

  afterAll(async () => {
    // Disconnect sockets
    if (passengerSocket) passengerSocket.disconnect();
    if (driverSocket) driverSocket.disconnect();
    if (controlCenterSocket) controlCenterSocket.disconnect();
    
    await teardownTestApp(server);
  });

  // Create test bus and route
  let busId: string;
  let routeId: string;

  describe('Bus and Route Setup', () => {
    it('should create a new route', async () => {
      const routeResponse = await request(app)
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

      expect(routeResponse.status).toBe(201);
      expect(routeResponse.body).toHaveProperty('id');
      routeId = routeResponse.body.id;
    });

    it('should create a new bus', async () => {
      const busResponse = await request(app)
        .post(`${apiUrl}/control-center/buses`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          registrationNumber: 'TEST-BUS-001',
          capacity: 50,
          type: 'STANDARD',
          status: 'ACTIVE',
        });

      expect(busResponse.status).toBe(201);
      expect(busResponse.body).toHaveProperty('id');
      busId = busResponse.body.id;
    });

    it('should assign bus to route', async () => {
      const assignResponse = await request(app)
        .put(`${apiUrl}/control-center/buses/${busId}/assign-route/${routeId}`)
        .set('Authorization', `Bearer ${controlCenterToken}`);

      expect(assignResponse.status).toBe(200);
    });
  });

  describe('Real-time Bus Tracking', () => {
    it('should send location updates from driver and receive them as passenger', async () => {
      // Promise to receive bus location update as passenger
      const passengerReceive = new Promise<any>((resolve) => {
        passengerSocket.once('tracking.bus_updates', (data) => {
          resolve(data);
        });
      });

      // Promise to receive bus location update in control center
      const controlCenterReceive = new Promise<any>((resolve) => {
        controlCenterSocket.once('tracking.bus_updates', (data) => {
          resolve(data);
        });
      });

      // Driver sends location update
      const locationUpdate = {
        busId,
        location: testData.location.addisAbaba,
        routeId,
        status: 'ACTIVE',
      };

      // Request tracking updates for the route
      passengerSocket.emit('tracking.bus_updates.request', { routeId });
      
      // Driver sends location update
      driverSocket.emit('driver.location_update', locationUpdate);

      // Wait for passenger and control center to receive updates
      const passengerData = await passengerReceive;
      const controlCenterData = await controlCenterReceive;

      // Verify the updates contain the expected bus information
      expect(passengerData).toBeDefined();
      expect(passengerData).toHaveProperty('buses');
      expect(passengerData.buses.length).toBeGreaterThan(0);
      
      const busList = passengerData.buses;
      const matchingBus = busList.find((bus: any) => bus.busId === busId);
      
      expect(matchingBus).toBeDefined();
      expect(matchingBus.routeId).toBe(routeId);
      expect(matchingBus).toHaveProperty('location');
      expect(matchingBus.location.latitude).toBeCloseTo(testData.location.addisAbaba.latitude);
      expect(matchingBus.location.longitude).toBeCloseTo(testData.location.addisAbaba.longitude);
      
      // Control center should also receive the updates
      expect(controlCenterData).toBeDefined();
      expect(controlCenterData).toHaveProperty('buses');
    });

    it('should receive ETAs for bus stops', async () => {
      // Request ETAs for a specific bus and route
      const etaResponse = await request(app)
        .get(`${apiUrl}/passenger/bus/${busId}/etas`)
        .set('Authorization', `Bearer ${passengerToken}`);

      expect(etaResponse.status).toBe(200);
      expect(etaResponse.body).toHaveProperty('etas');
      expect(Array.isArray(etaResponse.body.etas)).toBe(true);
    });
  });

  describe('Alerts and Notifications', () => {
    it('should allow passengers to set bus alerts', async () => {
      const alertResponse = await request(app)
        .post(`${apiUrl}/passenger/alerts`)
        .set('Authorization', `Bearer ${passengerToken}`)
        .send({
          busId,
          routeId,
          type: 'ARRIVAL',
          stopName: 'End Stop',
          minutesBefore: 10,
        });

      expect(alertResponse.status).toBe(201);
      expect(alertResponse.body).toHaveProperty('id');
    });

    it('should notify passengers of bus delays', async () => {
      // Setup listener for notifications
      const notificationPromise = new Promise<any>((resolve) => {
        passengerSocket.once('notification.received', (data) => {
          resolve(data);
        });
      });

      // Control center sends delay notification
      await request(app)
        .post(`${apiUrl}/notifications/broadcast`)
        .set('Authorization', `Bearer ${controlCenterToken}`)
        .send({
          routeId,
          type: 'DELAY',
          message: 'Bus is delayed by 15 minutes',
          affectedUsers: ['PASSENGER'],
        });

      // Wait for notification
      const notification = await notificationPromise;
      
      expect(notification).toBeDefined();
      expect(notification.type).toBe('DELAY');
      expect(notification.message).toContain('delayed');
    });
  });
}); 