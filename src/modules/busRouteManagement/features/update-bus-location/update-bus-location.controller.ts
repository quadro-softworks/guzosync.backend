import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { UpdateBusLocationHandler } from './update-bus-location.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class UpdateBusLocationController {
  private handler = appContainer.resolve(UpdateBusLocationHandler);

  public updateBusLocation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busId = req.params.busId;
      const { location } = req.body;
      
      const result = await this.handler.execute({ busId, location });
      ResponseHandler.sendSuccess(
        res,
        result,
        'Bus location updated successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 