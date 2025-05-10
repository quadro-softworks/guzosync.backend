import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetFeedbackHandler } from './get-feedback.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';
import { UnauthorizedError } from '@core/errors/unauthorized.error';

@injectable()
export class GetFeedbackController {
  private handler = appContainer.resolve(GetFeedbackHandler);

  public getFeedback = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ensure user is authenticated and userId is available
      if (!req.user?.id) {
        throw new UnauthorizedError('Authentication required');
      }
      
      // Ensure sortBy is one of the allowed values
      const sortByParam = req.query.sortBy as string;
      const sortBy = ['createdAt', 'rating', 'dateOfTrip'].includes(sortByParam) 
        ? sortByParam as 'createdAt' | 'rating' | 'dateOfTrip'
        : 'createdAt';
      
      const query = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };
      
      const userId = req.user.id;
      const feedback = await this.handler.execute(query, userId);
      
      ResponseHandler.sendSuccess(
        res,
        feedback,
        'Feedback retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 