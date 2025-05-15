import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { CreateAlertHandler } from './create-alert.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';
import { UnauthorizedError } from '@core/errors/unauthorized.error';

@injectable()
export class CreateAlertController {
  private handler = appContainer.resolve(CreateAlertHandler);

  public createAlert = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ensure user is authenticated and userId is available
      if (!req.user?.id) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const command = req.body;
      const userId = req.user.id;
      
      const alert = await this.handler.execute(command, userId);
      
      ResponseHandler.sendSuccess(
        res,
        alert,
        'Alert created successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };
} 