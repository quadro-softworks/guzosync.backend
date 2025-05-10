import { Router } from 'express';

/**
 * @swagger
 * tags:
 *   name: Bus Driver
 *   description: Bus driver mobile app API endpoints
 */

/**
 * @swagger
 * tags:
 *   name: WebSocket Driver
 *   description: WebSocket real-time tracking API for bus drivers
 */

/**
 * @swagger
 * /api/socket.io/driver:
 *   get:
 *     tags: [WebSocket Driver]
 *     summary: Connect to WebSocket for driver mobile app
 *     description: |
 *       ## Real-time Bus Location Tracking for Drivers
 *
 *       ### Connection
 *       Connect to the WebSocket server using Socket.IO client library:
 *       ```javascript
 *       const socket = io('https://api.guzo-sync.com');
 *       ```
 *
 *       ### Driver Authentication
 *       Authenticate as a driver for a specific bus:
 *       ```javascript
 *       socket.emit('driver.connected', { 
 *         busId: 'bus-id-here',
 *         driverId: 'driver-id-here'
 *       });
 *       ```
 *
 *       ### Send Location Updates
 *       Send regular location updates from the mobile device:
 *       ```javascript
 *       socket.emit('bus.location_update', {
 *         busId: 'bus-id-here',
 *         latitude: 9.0450,
 *         longitude: 38.7468,
 *         accuracy: 10,
 *         speed: 25,
 *         heading: 90,
 *         timestamp: new Date().toISOString()
 *       });
 *       ```
 *
 *       ### Receive Location Update Confirmations
 *       Listen for confirmation that location updates were processed:
 *       ```javascript
 *       socket.on('bus.location_update.result', (result) => {
 *         console.log('Location update processed:', result);
 *       });
 *       ```
 *
 *       ### Error Handling
 *       Listen for errors with location updates:
 *       ```javascript
 *       socket.on('bus.location_update.error', (error) => {
 *         console.error('Location update error:', error.message);
 *       });
 *       ```
 *
 *       ### Disconnect
 *       When finished, disconnect from the socket:
 *       ```javascript
 *       socket.disconnect();
 *       ```
 *     responses:
 *       101:
 *         description: Switching Protocols to WebSocket
 */

const busDriverRoutes = (router: Router) => {
  // Bus driver specific routes can be added here
  return router;
};

export { busDriverRoutes };
