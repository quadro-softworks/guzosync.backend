// src/modules/user-management/user.routes.ts
import { Router } from "express";
import { validateRequest } from "@core/middleware/validate-request";

// Import Schemas
import { RegisterUserSchema } from "./features/register-user/register-user.command";
import { LoginUserSchema } from "./features/login-user/login-user.command";

// Import Controllers
import { RegisterUserController } from "./features/register-user/register-user.controller";
import { LoginUserController } from "./features/login-user/login-user.controller";

const router = Router();

// Instantiate controllers
const registerUserController = new RegisterUserController();
const loginUserController = new LoginUserController();

// Define routes
router.post(
  "/register",
  validateRequest(RegisterUserSchema),
  registerUserController.register,
);

router.post(
  "/login",
  validateRequest(LoginUserSchema),
  loginUserController.login,
);

// Add other user routes here (e.g., get profile, update user etc.)
// Example: GET /api/v1/users/profile (would need an authentication middleware)
// router.get('/profile', /* authMiddleware, */ profileController.getProfile);

export { router as userRoutes };
