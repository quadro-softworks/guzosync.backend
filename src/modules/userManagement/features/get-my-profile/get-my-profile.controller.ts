import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetMyProfileHandler } from './get-my-profile.handler';
import { ResponseHandler } from '@core/utils/api-response';
import { appContainer } from '@core/di/container';
import { UnauthorizedError } from '@core/errors/unauthorized.error';

@injectable()
export class GetMyProfileController {
  private handler = appContainer.resolve(GetMyProfileHandler);
  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // The requireAuth middleware should have attached req.user
      if (!req.user?.userId) {
        // This check is belt-and-suspenders; middleware should handle it
        throw new UnauthorizedError('Authentication required.');
      }

      const userProfile = await this.handler.execute(req.user.userId);
      if (userProfile.isErr())
        ResponseHandler.sendApiError(res, userProfile.error);
      else
        ResponseHandler.sendSuccess(
          res,
          userProfile.value,
          'Profile fetched successfully.',
        );
    } catch (error) {
      next(error); // Catches NotFoundError etc.
    }
  };
}
