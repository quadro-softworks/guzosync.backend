import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { DeleteBusStopHandler } from './delete-bus-stop.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class DeleteBusStopController {
  private handler = appContainer.resolve(DeleteBusStopHandler);

  public deleteBusStop = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busStopId = req.params.busStopId;
      
      const result = await this.handler.execute({ busStopId });
      ResponseHandler.sendSuccess(
        res,
        result,
        'Bus stop deleted successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 