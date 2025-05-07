import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { CreateRouteHandler } from './create-route.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class CreateRouteController {
  private handler = appContainer.resolve(CreateRouteHandler);

  public createRoute = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body;
      const createdRoute = await this.handler.execute(command);
      ResponseHandler.sendSuccess(
        res,
        createdRoute,
        'Route created successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };
} 