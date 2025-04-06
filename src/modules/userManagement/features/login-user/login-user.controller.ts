// src/modules/user-management/features/login-user/login-user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { LoginUserHandler } from './login-user.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class LoginUserController {
  private handler = appContainer.resolve(LoginUserHandler);

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body;
      const loginResult = await this.handler.execute(command);
      res.cookie('access_token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days before asking for login again
      });
      ResponseHandler.sendSuccess(res, loginResult, 'Login successful');
    } catch (error) {
      // Handles UnauthorizedError from the handler
      next(error);
    }
  };
}
