import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { RegisterUserHandler } from './register-user.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class RegisterUserController {
  private handler = appContainer.resolve(RegisterUserHandler);

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body;
      const createdUser = await this.handler.execute(command);
      ResponseHandler.sendSuccess(
        res,
        createdUser,
        'User registered successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };
}
