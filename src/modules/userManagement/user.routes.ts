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
import { UpdateMyProfileController } from '@modules/userManagement/features/update-my-profile/update-my-profile.controller';
import { UpdateMyProfileSchema } from '@modules/userManagement/features/update-my-profile/update-my-profile.command';
import { UpdateLanguageController } from '@modules/userManagement/features/update-language/update-language.controller';
import { UpdateLanguageSchema } from '@modules/userManagement/features/update-language/update-language.command';
import { UpdateNotificationSettingsController } from '@modules/userManagement/features/update-notification-settings/update-notification-settings.controller';
import { UpdateNotificationSettingsSchema } from '@modules/userManagement/features/update-notification-settings/update-notification-settings.command';
import { GetAlertsQuerySchema } from './features/get-alerts/get-alerts.query';
import { GetAlertsController } from './features/get-alerts/get-alerts.controller';
import { CreateAlertController } from './features/create-alert/create-alert.controller';
import { DeleteAlertController } from './features/delete-alert/delete-alert.controller';
import { UpdateAlertController } from './features/update-alert/update-alert.controller';
import { CreateAlertSchema } from './features/create-alert/create-alert.command';
import { DeleteAlertSchema } from './features/delete-alert/delete-alert.command';
import { UpdateAlertSchema } from './features/update-alert/update-alert.command';

export const userRoutes = (router: Router) => {
  // Instantiate controllers
  const registerUserController = new RegisterUserController();
  const loginUserController = new LoginUserController();
  const logoutUserController = new LogoutUserController();
  const requestPasswordResetController = new RequestPasswordResetController();
  const confirmPasswordResetController = new ConfirmPasswordResetController();
  const getMyProfileController = new GetMyProfileController();
  const updateMyProfileController = new UpdateMyProfileController();
  const updateLanguageController = new UpdateLanguageController();
  const updateNotificationSettingsController = new UpdateNotificationSettingsController();
  const getAlertsController = new GetAlertsController();
  const createAlertController = new CreateAlertController();
    const deleteAlertController = new DeleteAlertController();
    const updateAlertController = new UpdateAlertController();

  /**
   * @swagger
   * /api/accounts/register:
   *  post:
   *    tags: [Authentication]
   *    description: Register a new user (Passenger or Control Center Admin)
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - email
   *              - password
   *              - firstName
   *              - lastName
   *              - role
   *            properties:
   *              email:
   *                type: string
   *                format: email
   *              password:
   *                type: string
   *                minLength: 8
   *              firstName:
   *                type: string
   *                minLength: 2
   *              lastName:
   *                type: string
   *                minLength: 2
   *              phoneNumber:
   *                type: string
   *                minLength: 7
   *              role:
   *                type: string
   *                enum: [PASSENGER, CONTROL_CENTER]
   *              profilePicture:
   *                type: string
   *                format: uri
   *              address:
   *                type: object
   *                properties:
   *                  street:
   *                    type: string
   *                  city:
   *                    type: string
   *                  state:
   *                    type: string
   *                  zipCode:
   *                    type: string
   *                  country:
   *                    type: string
   *              preferredLanguage:
   *                type: string
   *                default: 'en'
   *              emergencyContact:
   *                type: object
   *                properties:
   *                  name:
   *                    type: string
   *                  relation:
   *                    type: string
   *                  phoneNumber:
   *                    type: string
   *    responses:
   *      201:
   *        description: User registered successfully
   *      400:
   *        description: Validation error
   *      409:
   *        description: Email already exists
   */
  router.post(
    '/register',
    validateRequest(RegisterUserSchema),
    registerUserController.register,
  );

  

  /**
   * @swagger
   * /api/accounts/login:
   *  post:
   *    tags: [Authentication]
   *    description: Log in a user and generate authentication token
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - email
   *              - password
   *            properties:
   *              email:
   *                type: string
   *                format: email
   *              password:
   *                type: string
   *              rememberMe:
   *                type: boolean
   *                default: false
   *    responses:
   *      200:
   *        description: User logged in successfully with auth token
   *      401:
   *        description: Invalid credentials
   *      404:
   *        description: User not found
   */
  router.post(
    '/login',
    validateRequest(LoginUserSchema),
    loginUserController.login,
  );

  /**
   * @swagger
   * /api/accounts/logout:
   *  post:
   *    tags: [Authentication]
   *    description: Log out a user and invalidate authentication token
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: User logged out successfully
   *      401:
   *        description: Unauthorized
   */
  router.post(
    '/logout',
    requireAuth, // Requires authentication
    logoutUserController.logout,
  );

  /**
   * @swagger
   * /api/accounts/password/reset/request:
   *  post:
   *    tags: [Authentication]
   *    description: Request a password reset via email
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - email
   *            properties:
   *              email:
   *                type: string
   *                format: email
   *    responses:
   *      200:
   *        description: Password reset request submitted successfully
   *      404:
   *        description: Email not found
   *      500:
   *        description: Error sending email
   */
  router.post(
    '/password/reset/request',
    validateRequest(RequestPasswordResetSchema),
    requestPasswordResetController.requestReset,
  );

  /**
   * @swagger
   * /api/accounts/password/reset/confirm:
   *  post:
   *    tags: [Authentication]
   *    description: Confirm password reset with token received via email
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - token
   *              - newPassword
   *            properties:
   *              token:
   *                type: string
   *              newPassword:
   *                type: string
   *                minLength: 8
   *    responses:
   *      200:
   *        description: Password reset successfully
   *      400:
   *        description: Invalid or expired token
   *      404:
   *        description: User not found
   */
  router.post(
    '/password/reset/confirm',
    validateRequest(ConfirmPasswordResetSchema),
    confirmPasswordResetController.confirmReset,
  );

  /**
   * @swagger
   * /api/accounts/me:
   *  get:
   *    tags: [User Profile]
   *    description: Get the profile of the currently authenticated user
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: Profile retrieved successfully
   *      401:
   *        description: Unauthorized
   */
  router.get(
    '/me',
    requireAuth, // Requires authentication
    getMyProfileController.getProfile,
  );

  /**
   * @swagger
   * /api/accounts/me:
   *  put:
   *    tags: [User Profile]
   *    description: Update the profile of the currently authenticated user
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              firstName:
   *                type: string
   *                minLength: 2
   *              lastName:
   *                type: string
   *                minLength: 2
   *              phoneNumber:
   *                type: string
   *                minLength: 7
   *              profilePicture:
   *                type: string
   *                format: uri
   *              address:
   *                type: object
   *                properties:
   *                  street:
   *                    type: string
   *                  city:
   *                    type: string
   *                  state:
   *                    type: string
   *                  zipCode:
   *                    type: string
   *                  country:
   *                    type: string
   *              emergencyContact:
   *                type: object
   *                properties:
   *                  name:
   *                    type: string
   *                  relation:
   *                    type: string
   *                  phoneNumber:
   *                    type: string
   *    responses:
   *      200:
   *        description: Profile updated successfully
   *      400:
   *        description: Validation error
   *      401:
   *        description: Unauthorized
   */
  router.put(
    '/me',
    requireAuth,
    validateRequest(UpdateMyProfileSchema),
    updateMyProfileController.updateProfile,
  );

  /**
   * @swagger
   * /api/accounts/language:
   *  put:
   *    tags: [User Preferences]
   *    description: Update the preferred language of the currently authenticated user
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - languageCode
   *            properties:
   *              languageCode:
   *                type: string
   *                example: 'en'
   *    responses:
   *      200:
   *        description: Language preference updated successfully
   *      400:
   *        description: Invalid language code
   *      401:
   *        description: Unauthorized
   */
  router.put(
    '/language',
    requireAuth,
    validateRequest(UpdateLanguageSchema),
    updateLanguageController.updateLanguage,
  );

  /**
   * @swagger
   * /api/accounts/notification-settings:
   *  put:
   *    tags: [User Preferences]
   *    description: Update notification preferences for the currently authenticated user
   *    security:
   *      - bearerAuth: []
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              emailNotifications:
   *                type: boolean
   *              pushNotifications:
   *                type: boolean
   *              smsNotifications:
   *                type: boolean
   *              notificationTypes:
   *                type: object
   *                properties:
   *                  alerts:
   *                    type: boolean
   *                  busDelays:
   *                    type: boolean
   *                  routeChanges:
   *                    type: boolean
   *                  promotions:
   *                    type: boolean
   *                  systemUpdates:
   *                    type: boolean
   *    responses:
   *      200:
   *        description: Notification settings updated successfully
   *      401:
   *        description: Unauthorized
   */
  router.put(
    '/notification-settings',
    requireAuth,
    validateRequest(UpdateNotificationSettingsSchema),
    updateNotificationSettingsController.updateSettings,
  );

  /**
   * @swagger
   * /api/config/languages:
   *  get:
   *    tags: [System Configuration]
   *    description: Get a list of all supported languages in the system
   *    responses:
   *      200:
   *        description: List of supported languages
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                languages:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      code:
   *                        type: string
   *                        example: 'en'
   *                      name:
   *                        type: string
   *                        example: 'English'
   *                      nativeName:
   *                        type: string
   *                        example: 'English'
   *                      isRTL:
   *                        type: boolean
   *                        example: false
   */
  router.get('/config/languages', (req, res) => {
    // Return supported languages
    const languages = [
      { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
      { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', isRTL: false },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
      { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false },
    ];
    
    res.status(200).json({ languages });
  });

  /**
   * @swagger
   * /api/accounts/alerts:
   *  get:
   *    tags: [User Preferences]
   *    description: Get all alerts for the authenticated user
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: integer
   *        description: Page number for pagination
   *      - in: query
   *        name: limit
   *        schema:
   *          type: integer
   *        description: Number of items per page
   *      - in: query
   *        name: isActive
   *        schema:
   *          type: boolean
   *        description: Filter by active status
   *    responses:
   *      200:
   *        description: Alerts retrieved successfully
   *      401:
   *        description: Unauthorized
   */
router.get(
  '/alerts',
  requireAuth,
  validateRequest(GetAlertsQuerySchema),
  getAlertsController.getAlerts,
);

  /**
     * @swagger
     * /api/passenger/alerts:
     *  post:
     *    tags: [User Preferences]
     *    description: Create a new alert
     *    security:
     *      - bearerAuth: []
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              alertType:
     *                type: string
     *                enum: [DELAY, ARRIVAL, DEPARTURE, ROUTE_CHANGE, ETA_CHANGE, CAPACITY]
     *              targetId:
     *                type: string
     *                description: Bus ID, Route ID, or Bus Stop ID
     *              targetType:
     *                type: string
     *                enum: [BUS, ROUTE, BUS_STOP]
     *              threshold:
     *                type: number
     *                description: For alerts based on time thresholds (in minutes)
     *              message:
     *                type: string
     *              isActive:
     *                type: boolean
     *    responses:
     *      201:
     *        description: Alert created successfully
     *      401:
     *        description: Unauthorized
     *      404:
     *        description: Target not found
     */
    router.post(
      '/alerts',
      requireAuth,
      validateRequest(CreateAlertSchema),
      createAlertController.createAlert,
    );
  
    /**
     * @swagger
     * /api/passenger/alerts/{alertId}:
     *  put:
     *    tags: [User Preferences]
     *    description: Update an existing alert
     *    security:
     *      - bearerAuth: []
     *    parameters:
     *      - in: path
     *        name: alertId
     *        schema:
     *          type: string
     *        required: true
     *        description: ID of the alert to update
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              alertType:
     *                type: string
     *                enum: [DELAY, ARRIVAL, DEPARTURE, ROUTE_CHANGE, ETA_CHANGE, CAPACITY]
     *              threshold:
     *                type: number
     *              message:
     *                type: string
     *              isActive:
     *                type: boolean
     *    responses:
     *      200:
     *        description: Alert updated successfully
     *      401:
     *        description: Unauthorized
     *      404:
     *        description: Alert not found
     */
    router.put(
      '/alerts/:alertId',
      requireAuth,
      validateRequest(UpdateAlertSchema),
      updateAlertController.updateAlert,
    );
  
    /**
     * @swagger
     * /api/passenger/alerts/{alertId}:
     *  delete:
     *    tags: [User Preferences]
     *    description: Delete an alert
     *    security:
     *      - bearerAuth: []
     *    parameters:
     *      - in: path
     *        name: alertId
     *        schema:
     *          type: string
     *        required: true
     *        description: ID of the alert to delete
     *    responses:
     *      200:
     *        description: Alert deleted successfully
     *      401:
     *        description: Unauthorized
     *      404:
     *        description: Alert not found
     */
    router.delete(
      '/alerts/:alertId',
      requireAuth,
      validateRequest(DeleteAlertSchema),
      deleteAlertController.deleteAlert,
    );

  return router;
};
