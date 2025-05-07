import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { CreateBusStopHandler } from './create-bus-stop.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class CreateBusStopController {
  private handler = appContainer.resolve(CreateBusStopHandler);

  public createBusStop = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body;
      const createdBusStop = await this.handler.execute(command);
      ResponseHandler.sendSuccess(
        res,
        createdBusStop,
        'Bus stop created successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };
} 