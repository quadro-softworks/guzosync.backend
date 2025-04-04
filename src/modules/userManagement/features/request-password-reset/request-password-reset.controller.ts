import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { RequestPasswordResetHandler } from './request-password-reset.handler';
import { sendSuccess } from '@core/utils/api-response';
import { appContainer } from '@core/di/container';

@injectable()
export class RequestPasswordResetController {
  private handler = appContainer.resolve(RequestPasswordResetHandler);
  public requestReset = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.handler.execute(req.body);
      // Send generic success message regardless of user existence
      sendSuccess(
        res,
        null,
        'If your email is registered, you will receive a password reset link.',
      );
    } catch (error) {
      next(error); // Handle unexpected errors from handler/email service if they throw
    }
  };
}
