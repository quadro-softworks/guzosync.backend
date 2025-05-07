import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetBusStopsHandler } from './get-bus-stops.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class GetBusStopsController {
  private handler = appContainer.resolve(GetBusStopsHandler);

  public getBusStops = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        name: req.query.name as string | undefined,
        isActive: req.query.isActive !== undefined 
          ? req.query.isActive === 'true' 
          : undefined,
      };
      
      const busStops = await this.handler.execute(query);
      ResponseHandler.sendSuccess(
        res,
        busStops,
        'Bus stops retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 