import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { ConfirmPasswordResetHandler } from './confirm-password-reset.handler';
import { sendSuccess } from '@core/utils/api-response';
import { appContainer } from '@core/di/container';

@injectable()
export class ConfirmPasswordResetController {
  private handler = appContainer.resolve(ConfirmPasswordResetHandler);
  public confirmReset = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Combine params and body if token is in URL
      // const command = { ...req.body, token: req.params.token };
      const command = req.body; // Assuming token in body for now
      await this.handler.execute(command);
      sendSuccess(res, null, 'Password has been reset successfully.');
    } catch (error) {
      next(error); // Catches BadRequestError from handler
    }
  };
}
