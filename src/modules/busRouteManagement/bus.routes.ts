import { validateRequest } from '@core/middleware/validate-request';
import { GetBusDetailsSchema } from './features/get-bus-details/get-bus-details.query';
import { Router } from 'express';
import { RegisterBusCommandSchema } from '@modules/operationsControl/features/register-bus/register-bus.command';
import { BusController } from '@modules/busRouteManagement/bus.controller';
import { UpdateBusLocationController } from './features/update-bus-location/update-bus-location.controller';
import { UpdateBusLocationSchema } from './features/update-bus-location/update-bus-location.command';
import { UpdateBusLocationMobileController } from './features/update-bus-location-mobile/update-bus-location-mobile.controller';
import { updateBusLocationMobileSchema } from './features/update-bus-location-mobile/update-bus-location-mobile.command';
import { container } from 'tsyringe';

// ... other bus controllers/schemas

const busRoutes = (router: Router) => {
  const busController = new BusController();
  const updateBusLocationController = new UpdateBusLocationController();
  const updateBusLocationMobileController = container.resolve('UpdateBusLocationMobileController') as UpdateBusLocationMobileController;

  router.get(
    '/:busId',
    validateRequest(GetBusDetailsSchema),
    busController.getBusDetails,
  );

  /**
   * @swagger
   * /api/buses/{busId}/location:
   *  put:
   *    description: Update the location of a bus (for real-time tracking)
   *    parameters:
   *      - in: path
   *        name: busId
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the bus to update
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              location:
   *                type: object
   *                properties:
   *                  coordinates:
   *                    type: array
   *                    items:
   *                      type: number
   *                    description: [longitude, latitude]
   *    responses:
   *      200:
   *        description: Bus location updated successfully
   *      404:
   *        description: Bus not found
   */
  router.put(
    '/:busId/location',
    validateRequest(UpdateBusLocationSchema),
    updateBusLocationController.updateBusLocation,
  );

  /**
   * @swagger
   * /api/buses/mobile/location:
   *  post:
   *    tags:
   *      - Bus Tracking
   *    summary: Update bus location from mobile app
   *    description: Update the location of a bus from the driver's mobile app (for real-time tracking)
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - busId
   *              - latitude
   *              - longitude
   *            properties:
   *              busId:
   *                type: string
   *                description: ID of the bus
   *              latitude:
   *                type: number
   *                description: Latitude coordinate
   *              longitude:
   *                type: number
   *                description: Longitude coordinate
   *              accuracy:
   *                type: number
   *                description: GPS accuracy in meters
   *              speed:
   *                type: number
   *                description: Current speed in km/h
   *              heading:
   *                type: number
   *                description: Direction of travel in degrees
   *              timestamp:
   *                type: string
   *                format: date-time
   *                description: Timestamp of the location update
   *              routeId:
   *                type: string
   *                description: Optional route ID if different from assigned route
   *    responses:
   *      200:
   *        description: Bus location updated successfully
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: boolean
   *                  example: true
   *                data:
   *                  type: object
   *      400:
   *        description: Invalid request data
   *      404:
   *        description: Bus not found
   *      500:
   *        description: Server error
   */
  router.post(
    '/mobile/location',
    validateRequest(updateBusLocationMobileSchema),
    (req, res) => updateBusLocationMobileController.handle(req, res)
  );

  return router;
};


// ... other bus routes (e.g., POST / for register bus) ...

export { busRoutes }; // Export the router
