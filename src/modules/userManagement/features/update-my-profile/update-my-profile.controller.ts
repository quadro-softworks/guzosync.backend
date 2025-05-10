import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { UpdateMyProfileHandler } from './update-my-profile.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';
import { UnauthorizedError } from '@core/errors/unauthorized.error';

@injectable()
export class UpdateMyProfileController {
  private handler = appContainer.resolve(UpdateMyProfileHandler);

  public updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!req.user?.id) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const userId = req.user.id;
      const updates = req.body;
      
      const updatedProfile = await this.handler.execute(updates, userId);
      
      ResponseHandler.sendSuccess(
        res,
        updatedProfile,
        'Profile updated successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 