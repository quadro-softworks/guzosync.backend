import { validateRequest } from '@core/middleware/validate-request';
import { GetBusDetailsSchema } from './features/get-bus-details/get-bus-details.query';
import { Router } from 'express';
import { RegisterBusCommandSchema } from '@modules/operationsControl/features/register-bus/register-bus.command';
import { BusController } from '@modules/busRouteManagement/bus.controller';

// ... other bus controllers/schemas

const busRoutes = (router: Router) => {
  const busController = new BusController();

  router.get(
    '/:busId',
    validateRequest(GetBusDetailsSchema),
    busController.getBusDetails,
  );

  return router;
};

// ... other bus routes (e.g., POST / for register bus) ...

export { busRoutes }; // Export the router
