import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { CreateFeedbackHandler } from './create-feedback.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';
import { UnauthorizedError } from '@core/errors/unauthorized.error';

@injectable()
export class CreateFeedbackController {
  private handler = appContainer.resolve(CreateFeedbackHandler);

  public createFeedback = async (
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
      
      const feedback = await this.handler.execute(command, userId);
      
      ResponseHandler.sendSuccess(
        res,
        feedback,
        'Feedback submitted successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };
} 