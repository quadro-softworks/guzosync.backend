// src/modules/userManagement/features/logout-user/logout-user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class LogoutUserController {
  // No complex handler needed for simple client-side discard strategy
  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Server-side logic would go here if blacklisting tokens
      // For now, just acknowledge the request. The client clears the token.
      ResponseHandler.sendSuccess(
        res,
        null,
        'Logout successful. Please discard your token.',
      );
    } catch (error) {
      next(error);
    }
  };
}
