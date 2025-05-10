import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { UpdateDriverLocationHandler } from './update-driver-location.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';
import { Location } from '@core/domain/valueObjects/location.vo';

@injectable()
export class UpdateDriverLocationController {
  private handler = appContainer.resolve(UpdateDriverLocationHandler);

  public updateLocation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { latitude, longitude, heading, speed, accuracy, busId, driverId } = req.body;
      
      // Create location object
      const location: Location = {
        latitude,
        longitude
      };
      
      // Execute command
      const result = await this.handler.execute({ 
        location, 
        heading, 
        speed, 
        accuracy, 
        busId, 
        driverId 
      });
      
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