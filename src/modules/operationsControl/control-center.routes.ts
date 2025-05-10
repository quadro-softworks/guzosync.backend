import { RegisterPersonnelCommandSchema } from './features/personnel/register-personnel/register-personnel.command';
import { Router } from 'express';
import { ControlCenterController } from '@modules/operationsControl/control-center.controller';
import { validateRequest } from '@core/middleware/validate-request';
import { RegisterBusCommandSchema } from '@modules/operationsControl/features/register-bus/register-bus.command';
import { CreateBusStopController } from './features/create-bus-stop/create-bus-stop.controller';
import { CreateBusStopSchema } from './features/create-bus-stop/create-bus-stop.command';
import { GetBusStopsController } from './features/get-bus-stops/get-bus-stops.controller';
import { GetBusStopsQuerySchema } from './features/get-bus-stops/get-bus-stops.query';
import { GetBusStopController } from './features/get-bus-stop/get-bus-stop.controller';
import { GetBusStopQuerySchema } from './features/get-bus-stop/get-bus-stop.query';
import { UpdateBusStopController } from './features/update-bus-stop/update-bus-stop.controller';
import { UpdateBusStopSchema } from './features/update-bus-stop/update-bus-stop.command';
import { DeleteBusStopController } from './features/delete-bus-stop/delete-bus-stop.controller';
import { DeleteBusStopSchema } from './features/delete-bus-stop/delete-bus-stop.command';
import { CreateRouteController } from './features/create-route/create-route.controller';
import { CreateRouteSchema } from './features/create-route/create-route.command';
import { GetRoutesController } from './features/get-routes/get-routes.controller';
import { GetRoutesQuerySchema } from './features/get-routes/get-routes.query';
import { GetRouteController } from './features/get-route/get-route.controller';
import { GetRouteQuerySchema } from './features/get-route/get-route.query';
import { AssignBusToRouteController } from './features/assign-bus-to-route/assign-bus-to-route.controller';
import { AssignBusToRouteSchema } from './features/assign-bus-to-route/assign-bus-to-route.command';
// Import schemas for personnel here as needed...

const controlCenterRoutes = (router: Router) => {
  const ccc = new ControlCenterController();
  const createBusStopController = new CreateBusStopController();
  const getBusStopsController = new GetBusStopsController();
  const getBusStopController = new GetBusStopController();
  const updateBusStopController = new UpdateBusStopController();
  const deleteBusStopController = new DeleteBusStopController();
  const createRouteController = new CreateRouteController();
  const getRoutesController = new GetRoutesController();
  const getRouteController = new GetRouteController();
  const assignBusToRouteController = new AssignBusToRouteController();

  // ✅ BUS REGISTRATION

  router.post(
    '/buses/register',
    validateRequest(RegisterBusCommandSchema),
    ccc.registerBus,
  );

  // ✅ BUS STOP MANAGEMENT
  /**
   * @swagger
   * /api/control-center/bus-stops:
   *  post:
   *    description: Create a new bus stop
   *    responses:
   *      201:
   *        description: Bus stop created successfully
   */
  router.post(
    '/bus-stops',
    validateRequest(CreateBusStopSchema),
    createBusStopController.createBusStop,
  );

  /**
   * @swagger
   * /api/control-center/bus-stops:
   *  get:
   *    description: List all bus stops with optional filtering
   *    parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: integer
   *        description: Page number for pagination
   *      - in: query
   *        name: limit
   *        schema:
   *          type: integer
   *        description: Number of items per page
   *      - in: query
   *        name: name
   *        schema:
   *          type: string
   *        description: Filter by bus stop name
   *      - in: query
   *        name: isActive
   *        schema:
   *          type: boolean
   *        description: Filter by active status
   *    responses:
   *      200:
   *        description: Bus stops retrieved successfully
   */
  router.get(
    '/bus-stops',
    validateRequest(GetBusStopsQuerySchema),
    getBusStopsController.getBusStops,
  );

  /**
   * @swagger
   * /api/control-center/bus-stops/{busStopId}:
   *  get:
   *    description: Get details of a specific bus stop
   *    parameters:
   *      - in: path
   *        name: busStopId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the bus stop to get
   *    responses:
   *      200:
   *        description: Bus stop retrieved successfully
   *      404:
   *        description: Bus stop not found
   */
  router.get(
    '/bus-stops/:busStopId',
    validateRequest(GetBusStopQuerySchema),
    getBusStopController.getBusStop,
  );

  /**
   * @swagger
   * /api/control-center/bus-stops/{busStopId}:
   *  put:
   *    description: Update a specific bus stop
   *    parameters:
   *      - in: path
   *        name: busStopId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the bus stop to update
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *              location:
   *                type: object
   *              capacity:
   *                type: integer
   *              isActive:
   *                type: boolean
   *    responses:
   *      200:
   *        description: Bus stop updated successfully
   *      404:
   *        description: Bus stop not found
   *      409:
   *        description: A bus stop with this name already exists
   */
  router.put(
    '/bus-stops/:busStopId',
    validateRequest(UpdateBusStopSchema),
    updateBusStopController.updateBusStop,
  );

  /**
   * @swagger
   * /api/control-center/bus-stops/{busStopId}:
   *  delete:
   *    description: Delete a specific bus stop
   *    parameters:
   *      - in: path
   *        name: busStopId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the bus stop to delete
   *    responses:
   *      200:
   *        description: Bus stop deleted successfully
   *      404:
   *        description: Bus stop not found
   */
  router.delete(
    '/bus-stops/:busStopId',
    validateRequest(DeleteBusStopSchema),
    deleteBusStopController.deleteBusStop,
  );

  // ✅ ROUTE MANAGEMENT
  /**
   * @swagger
   * /api/control-center/routes:
   *  post:
   *    description: Create a new route
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *              description:
   *                type: string
   *              stopIds:
   *                type: array
   *                items:
   *                  type: string
   *              totalDistance:
   *                type: number
   *              estimatedDuration:
   *                type: number
   *              isActive:
   *                type: boolean
   *    responses:
   *      201:
   *        description: Route created successfully
   *      404:
   *        description: One or more bus stops do not exist
   *      409:
   *        description: A route with this name already exists
   */
  router.post(
    '/routes',
    validateRequest(CreateRouteSchema),
    createRouteController.createRoute,
  );

  /**
   * @swagger
   * /api/control-center/routes:
   *  get:
   *    description: List all routes with optional filtering
   *    parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: integer
   *        description: Page number for pagination
   *      - in: query
   *        name: limit
   *        schema:
   *          type: integer
   *        description: Number of items per page
   *      - in: query
   *        name: name
   *        schema:
   *          type: string
   *        description: Filter by route name
   *      - in: query
   *        name: isActive
   *        schema:
   *          type: boolean
   *        description: Filter by active status
   *    responses:
   *      200:
   *        description: Routes retrieved successfully
   */
  router.get(
    '/routes',
    validateRequest(GetRoutesQuerySchema),
    getRoutesController.getRoutes,
  );

  /**
   * @swagger
   * /api/control-center/routes/{routeId}:
   *  get:
   *    description: Get details of a specific route
   *    parameters:
   *      - in: path
   *        name: routeId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the route to get
   *    responses:
   *      200:
   *        description: Route retrieved successfully
   *      404:
   *        description: Route not found
   */
  router.get(
    '/routes/:routeId',
    validateRequest(GetRouteQuerySchema),
    getRouteController.getRoute,
  );

  // ✅ BUS MANAGEMENT
  /**
   * @swagger
   * /api/control-center/buses/{busId}/assign-route/{routeId}:
   *  put:
   *    description: Assign a bus to a route
   *    parameters:
   *      - in: path
   *        name: busId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the bus to assign
   *      - in: path
   *        name: routeId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the route to assign to the bus
   *    responses:
   *      200:
   *        description: Bus assigned to route successfully
   *      404:
   *        description: Bus or route not found
   */
  router.put(
    '/buses/:busId/assign-route/:routeId',
    validateRequest(AssignBusToRouteSchema),
    assignBusToRouteController.assignBusToRoute,
  );

  // ✅ PERSONNEL REGISTRATION
  router.post(
    '/personnel/register',
    validateRequest(RegisterPersonnelCommandSchema),
    ccc.registerPersonnel,
  );

  // ✅ QUEUE REGULATORS
  router.get('/personnel/queue-regulators', ccc.getQueueRegulators); // Add filter/pagination middleware if needed

  // router.get('/personnel/queue-regulators/:regulatorId', ccc.getQueueRegulatorById);

  // router.put(
  //   '/personnel/queue-regulators/:regulatorId',
  //   validateRequest(/* UpdateRegulatorCommandSchema */),
  //   ccc.updateQueueRegulator
  // );

  // router.delete('/personnel/queue-regulators/:regulatorId', ccc.deleteQueueRegulator);

  // router.put(
  //   '/personnel/queue-regulators/:regulatorId/assign/bus-stop/:busStopId',
  //   ccc.assignQueueRegulatorToBusStop
  // );

  // // ✅ BUS DRIVERS
  // router.get('/personnel/bus-drivers', ccc.getBusDrivers); // Add filter/pagination middleware if needed

  // router.get('/personnel/bus-drivers/:driverId', ccc.getBusDriverById);

  // router.put(
  //   '/personnel/bus-drivers/:driverId',
  //   validateRequest(/* UpdateBusDriverCommandSchema */),
  //   ccc.updateBusDriver
  // );

  // router.delete('/personnel/bus-drivers/:driverId', ccc.deleteBusDriver);

  // router.put(
  //   '/personnel/bus-drivers/:driverId/assign-bus/:busId',
  //   ccc.assignBusToDriver
  // );

  return router;
};

export { controlCenterRoutes };
