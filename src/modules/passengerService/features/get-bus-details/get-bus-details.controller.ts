import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetBusDetailsHandler } from './get-bus-details.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class GetBusDetailsController {
  private handler = appContainer.resolve(GetBusDetailsHandler);

  public getBusDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busId = req.params.busId;
      const busDetails = await this.handler.execute({ busId });
      ResponseHandler.sendSuccess(
        res,
        busDetails,
        'Bus details retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 