import { validateRequest } from '@core/middleware/validate-request';
import { Router } from 'express';
import { GetRouteDetailsSchema } from '@modules/busRouteManagement/features/get-route-details/get-route-details.query';
import { RoutesController } from '@modules/busRouteManagement/route.controller';

// ... other bus controllers/schemas

const routesRoutes = (router: Router) => {
  const routesController = new RoutesController();

  router.get(
    '/:routeId',
    validateRequest(GetRouteDetailsSchema),
    routesController.getRouteDetails,
  );

  return router;
};

// ... other bus routes (e.g., POST / for register bus) ...

export { routesRoutes }; // Export the router
