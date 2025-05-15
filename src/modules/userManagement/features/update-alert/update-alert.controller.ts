import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { UpdateAlertHandler } from './update-alert.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';
import { UnauthorizedError } from '@core/errors/unauthorized.error';

@injectable()
export class UpdateAlertController {
  private handler = appContainer.resolve(UpdateAlertHandler);

  public updateAlert = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ensure user is authenticated and userId is available
      if (!req.user?.id) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const alertId = req.params.alertId;
      const updates = req.body;
      const userId = req.user.id;
      
      const alert = await this.handler.execute({ alertId, updates }, userId);
      
      ResponseHandler.sendSuccess(
        res,
        alert,
        'Alert updated successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 