import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { UpdateBusStopHandler } from './update-bus-stop.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class UpdateBusStopController {
  private handler = appContainer.resolve(UpdateBusStopHandler);

  public updateBusStop = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busStopId = req.params.busStopId;
      const updates = req.body;
      
      const updatedBusStop = await this.handler.execute({ busStopId, updates });
      ResponseHandler.sendSuccess(
        res,
        updatedBusStop,
        'Bus stop updated successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 