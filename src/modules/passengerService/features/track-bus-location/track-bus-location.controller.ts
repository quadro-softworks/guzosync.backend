import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { TrackBusLocationHandler } from './track-bus-location.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class TrackBusLocationController {
  private handler = appContainer.resolve(TrackBusLocationHandler);

  public trackBusLocation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busId = req.params.busId;
      const busLocation = await this.handler.execute({ busId });
      
      ResponseHandler.sendSuccess(
        res,
        busLocation,
        'Bus location retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 