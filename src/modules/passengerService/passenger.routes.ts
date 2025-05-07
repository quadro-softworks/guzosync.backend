import { Router } from 'express';
import { validateRequest } from '@core/middleware/validate-request';
import { SearchBusStopsController } from './features/search-bus-stops/search-bus-stops.controller';
import { SearchBusStopsQuerySchema } from './features/search-bus-stops/search-bus-stops.query';
import { GetBusDetailsController } from './features/get-bus-details/get-bus-details.controller';
import { GetBusDetailsQuerySchema } from './features/get-bus-details/get-bus-details.query';
import { GetRouteDetailsController } from './features/get-route-details/get-route-details.controller';
import { GetRouteDetailsQuerySchema } from './features/get-route-details/get-route-details.query';
import { TrackBusLocationController } from './features/track-bus-location/track-bus-location.controller';
import { TrackBusLocationQuerySchema } from './features/track-bus-location/track-bus-location.query';

export const passengerRoutes = (router: Router) => {
  const searchBusStopsController = new SearchBusStopsController();
  const getBusDetailsController = new GetBusDetailsController();
  const getRouteDetailsController = new GetRouteDetailsController();
  const trackBusLocationController = new TrackBusLocationController();

  /**
   * @swagger
   * /passenger/buses/stops:
   *  get:
   *    description: Search for bus stops by name or location
   *    parameters:
   *      - in: query
   *        name: search
   *        schema:
   *          type: string
   *        description: Search term for bus stop name
   *      - in: query
   *        name: filterBy
   *        schema:
   *          type: string
   *          enum: [name, location]
   *        description: Filter by name or location
   *      - in: query
   *        name: pn
   *        schema:
   *          type: integer
   *        description: Page number (pagination)
   *      - in: query
   *        name: ps
   *        schema:
   *          type: integer
   *        description: Page size (pagination)
   *      - in: query
   *        name: lat
   *        schema:
   *          type: number
   *        description: Latitude (for location-based search)
   *      - in: query
   *        name: lng
   *        schema:
   *          type: number
   *        description: Longitude (for location-based search)
   *      - in: query
   *        name: distance
   *        schema:
   *          type: number
   *        description: Distance in kilometers (for location-based search)
   *    responses:
   *      200:
   *        description: Bus stops retrieved successfully
   */
  router.get(
    '/buses/stops',
    validateRequest(SearchBusStopsQuerySchema),
    searchBusStopsController.searchBusStops,
  );

  /**
   * @swagger
   * /passenger/buses/{busId}:
   *  get:
   *    description: Get details of a specific bus
   *    parameters:
   *      - in: path
   *        name: busId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the bus to get details for
   *    responses:
   *      200:
   *        description: Bus details retrieved successfully
   *      404:
   *        description: Bus not found
   */
  router.get(
    '/buses/:busId',
    validateRequest(GetBusDetailsQuerySchema),
    getBusDetailsController.getBusDetails,
  );

  /**
   * @swagger
   * /passenger/routes/{routeId}:
   *  get:
   *    description: Get details of a specific route
   *    parameters:
   *      - in: path
   *        name: routeId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the route to get details for
   *    responses:
   *      200:
   *        description: Route details retrieved successfully
   *      404:
   *        description: Route not found
   */
  router.get(
    '/routes/:routeId',
    validateRequest(GetRouteDetailsQuerySchema),
    getRouteDetailsController.getRouteDetails,
  );

  /**
   * @swagger
   * /passenger/buses/{busId}/track:
   *  get:
   *    description: Get current location of a specific bus with ETA information
   *    parameters:
   *      - in: path
   *        name: busId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the bus to track
   *    responses:
   *      200:
   *        description: Bus location retrieved successfully
   *      404:
   *        description: Bus not found
   */
  router.get(
    '/buses/:busId/track',
    validateRequest(TrackBusLocationQuerySchema),
    trackBusLocationController.trackBusLocation,
  );

  /**
   * @swagger
   * tags:
   *   name: WebSocket
   *   description: WebSocket real-time tracking API
   */

  /**
   * @swagger
   * /socket.io:
   *   get:
   *     tags: [WebSocket]
   *     summary: Connect to WebSocket for real-time tracking
   *     description: |
   *       ## Real-time Bus Tracking via WebSocket
   *
   *       ### Connection
   *       Connect to the WebSocket server using Socket.IO client library:
   *       ```javascript
   *       const socket = io('https://api.guzo-sync.com');
   *       ```
   *
   *       ### Request bus updates for a route
   *       To subscribe to real-time updates for buses on a specific route:
   *       ```javascript
   *       socket.emit('tracking.bus_updates.request', { routeId: 'route-id-here' });
   *       ```
   *
   *       ### Receive bus location updates
   *       Listen for bus location updates:
   *       ```javascript
   *       socket.on('tracking.bus_updates', (updates) => {
   *         console.log('Received bus updates:', updates);
   *         // updates is an array of bus location objects with ETA information
   *       });
   *       ```
   *
   *       ### Error handling
   *       Listen for tracking errors:
   *       ```javascript
   *       socket.on('tracking.error', (error) => {
   *         console.error('Tracking error:', error.message);
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
   *         description: WebSocket handshake successful
   */

  return router;
}; 