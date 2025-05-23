import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';

import { appContainer } from '@core/di/container';
import { GetRouteDetailsHandler } from '@modules/busRouteManagement/features/get-route-details/get-route-details.handler';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class RoutesController {
  private getRouteDetailsHandler = appContainer.resolve(GetRouteDetailsHandler);

  public getRouteDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busId = req.params.busId; // Validated
      const busDetails = await this.getRouteDetailsHandler.execute(busId);
      ResponseHandler.sendSuccess(
        res,
        busDetails,
        'Bus details fetched successfully.',
      );
    } catch (error) {
      next(error); // Catches NotFoundError
    }
  };
}
