// src/modules/user-management/user.routes.ts
import { Router } from 'express';
import { validateRequest } from '@core/middleware/validate-request';

// Import Schemas
import { RegisterUserSchema } from './features/register-user/register-user.command';
import { LoginUserSchema } from './features/login-user/login-user.command';

// Import Controllers
import { RegisterUserController } from './features/register-user/register-user.controller';
import { LoginUserController } from './features/login-user/login-user.controller';
import { requireAuth } from '@core/middleware/auth.middleware';
import { ConfirmPasswordResetSchema } from '@modules/userManagement/features/confirm-password-reset/confirm-password-reset.command';
import { ConfirmPasswordResetController } from '@modules/userManagement/features/confirm-password-reset/confirm-password-reset.controller';
import { GetMyProfileController } from '@modules/userManagement/features/get-my-profile/get-my-profile.controller';
import { LogoutUserController } from '@modules/userManagement/features/logout-user/logout-user.controller';
import { RequestPasswordResetSchema } from '@modules/userManagement/features/request-password-reset/request-password-reset.command';
import { RequestPasswordResetController } from '@modules/userManagement/features/request-password-reset/request-password-reset.controller';

export const userRoutes = (router: Router) => {
  // Instantiate controllers
  const registerUserController = new RegisterUserController();
  const loginUserController = new LoginUserController();
  const logoutUserController = new LogoutUserController();
  const requestPasswordResetController = new RequestPasswordResetController();
  const confirmPasswordResetController = new ConfirmPasswordResetController();
  const getMyProfileController = new GetMyProfileController();

  /**
   * @swagger
   * /register:
   *  post:
   *    description: Register a new user (Passenger / CC Admin)
   *    responses:
   *      201:
   *        description: User registered successfully
   */
  router.post(
    '/register',
    validateRequest(RegisterUserSchema),
    registerUserController.register,
  );

  /**
   * @swagger
   * /login:
   *  post:
   *    description: Log in a user
   *    responses:
   *      200:
   *        description: User logged in successfully
   */
  router.post(
    '/login',
    validateRequest(LoginUserSchema),
    loginUserController.login,
  );

  /**
   * @swagger
   * /logout:
   *  post:
   *    description: Log out a user
   *    responses:
   *      200:
   *        description: User logged out successfully
   */
  router.post(
    '/logout',
    requireAuth, // Requires authentication
    logoutUserController.logout,
  );

  /**
   * @swagger
   * /password/reset/request:
   *  post:
   *    description: Request a password reset
   *    responses:
   *      200:
   *        description: Password reset request submitted successfully
   */
  router.post(
    '/password/reset/request',
    validateRequest(RequestPasswordResetSchema),
    requestPasswordResetController.requestReset,
  );

  /**
   * @swagger
   * /password/reset/confirm:
   *  post:
   *    description: Confirm password reset with token
   *    responses:
   *      200:
   *        description: Password reset successfully
   */
  router.post(
    '/password/reset/confirm',
    validateRequest(ConfirmPasswordResetSchema),
    confirmPasswordResetController.confirmReset,
  );

  /**
   * @swagger
   * /me:
   *  get:
   *    description: Get the profile of the currently authenticated user
   *    responses:
   *      200:
   *        description: Profile retrieved successfully
   */
  router.get(
    '/me',
    requireAuth, // Requires authentication
    getMyProfileController.getProfile,
  );

  return router;
};
