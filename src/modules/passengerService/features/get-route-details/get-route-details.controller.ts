import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetRouteDetailsHandler } from './get-route-details.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class GetRouteDetailsController {
  private handler = appContainer.resolve(GetRouteDetailsHandler);

  public getRouteDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const routeId = req.params.routeId;
      const routeDetails = await this.handler.execute({ routeId });
      ResponseHandler.sendSuccess(
        res,
        routeDetails,
        'Route details retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 