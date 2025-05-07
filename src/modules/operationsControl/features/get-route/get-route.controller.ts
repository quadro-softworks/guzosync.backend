import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetRouteHandler } from './get-route.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class GetRouteController {
  private handler = appContainer.resolve(GetRouteHandler);

  public getRoute = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const routeId = req.params.routeId;
      const route = await this.handler.execute({ routeId });
      ResponseHandler.sendSuccess(
        res,
        route,
        'Route retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 