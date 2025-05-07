import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetRoutesHandler } from './get-routes.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class GetRoutesController {
  private handler = appContainer.resolve(GetRoutesHandler);

  public getRoutes = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        name: req.query.name as string | undefined,
        isActive: req.query.isActive !== undefined 
          ? req.query.isActive === 'true' 
          : undefined,
      };
      
      const routes = await this.handler.execute(query);
      ResponseHandler.sendSuccess(
        res,
        routes,
        'Routes retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 