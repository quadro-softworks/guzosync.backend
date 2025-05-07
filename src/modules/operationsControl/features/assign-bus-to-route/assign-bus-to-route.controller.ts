import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { AssignBusToRouteHandler } from './assign-bus-to-route.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class AssignBusToRouteController {
  private handler = appContainer.resolve(AssignBusToRouteHandler);

  public assignBusToRoute = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busId = req.params.busId;
      const routeId = req.params.routeId;
      
      const result = await this.handler.execute({ busId, routeId });
      ResponseHandler.sendSuccess(
        res,
        result,
        'Bus assigned to route successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 