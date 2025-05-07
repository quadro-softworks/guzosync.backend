import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetBusStopHandler } from './get-bus-stop.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class GetBusStopController {
  private handler = appContainer.resolve(GetBusStopHandler);

  public getBusStop = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busStopId = req.params.busStopId;
      const busStop = await this.handler.execute({ busStopId });
      ResponseHandler.sendSuccess(
        res,
        busStop,
        'Bus stop retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 