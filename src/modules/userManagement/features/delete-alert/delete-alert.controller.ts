import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { DeleteAlertHandler } from './delete-alert.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';
import { UnauthorizedError } from '@core/errors/unauthorized.error';

@injectable()
export class DeleteAlertController {
  private handler = appContainer.resolve(DeleteAlertHandler);

  public deleteAlert = async (
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
      const userId = req.user.id;
      
      const result = await this.handler.execute({ alertId }, userId);
      
      ResponseHandler.sendSuccess(
        res,
        result,
        'Alert deleted successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 