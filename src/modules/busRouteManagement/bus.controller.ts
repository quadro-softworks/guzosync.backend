import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { sendSuccess } from '@core/utils/api-response';
import { appContainer } from '@core/di/container';
import { GetBusDetailsHandler } from '@modules/busRouteManagement/features/get-bus-details/get-bus-details.handler';

@injectable()
export class BusController {
  private getBusDetailHandler = appContainer.resolve(GetBusDetailsHandler);

  public getBusDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busId = req.params.busId; // Validated
      const busDetails = await this.getBusDetailHandler.execute(busId);
      sendSuccess(res, busDetails, 'Bus details fetched successfully.');
    } catch (error) {
      next(error); // Catches NotFoundError
    }
  };
}
