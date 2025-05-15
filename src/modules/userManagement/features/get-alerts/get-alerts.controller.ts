import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetAlertsHandler } from './get-alerts.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';
import { UnauthorizedError } from '@core/errors/unauthorized.error';

@injectable()
export class GetAlertsController {
  private handler = appContainer.resolve(GetAlertsHandler);

  public getAlerts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ensure user is authenticated and userId is available
      if (!req.user?.id) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        isActive: req.query.isActive !== undefined 
          ? req.query.isActive === 'true' 
          : undefined,
        targetType: req.query.targetType as string | undefined,
        alertType: req.query.alertType as string | undefined,
      };
      
      const userId = req.user.id;
      const alerts = await this.handler.execute(query, userId);
      
      ResponseHandler.sendSuccess(
        res,
        alerts,
        'Alerts retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 