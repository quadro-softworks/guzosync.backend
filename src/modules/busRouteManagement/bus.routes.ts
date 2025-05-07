import { validateRequest } from '@core/middleware/validate-request';
import { GetBusDetailsSchema } from './features/get-bus-details/get-bus-details.query';
import { Router } from 'express';
import { RegisterBusCommandSchema } from '@modules/operationsControl/features/register-bus/register-bus.command';
import { BusController } from '@modules/busRouteManagement/bus.controller';
import { UpdateBusLocationController } from './features/update-bus-location/update-bus-location.controller';
import { UpdateBusLocationSchema } from './features/update-bus-location/update-bus-location.command';

// ... other bus controllers/schemas

const busRoutes = (router: Router) => {
  const busController = new BusController();
  const updateBusLocationController = new UpdateBusLocationController();

  router.get(
    '/:busId',
    validateRequest(GetBusDetailsSchema),
    busController.getBusDetails,
  );

  /**
   * @swagger
   * /buses/{busId}/location:
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

  return router;
};

// ... other bus routes (e.g., POST / for register bus) ...

export { busRoutes }; // Export the router
