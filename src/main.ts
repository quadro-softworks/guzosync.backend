// src/main.ts
import "reflect-metadata"; // MUST be the first import for tsyringe
import express, { Express, Request, Response } from "express";
import config from "@core/config";
import { connectDB } from "@core/database/mongo";
import { globalErrorHandler } from "@core/middleware/error-handler";
import { appContainer } from "@core/di/container";
import { AppEventBus, IEventBus } from "@core/events/event-bus";
import {
  BcryptHashingService,
  IHashingService,
} from "@core/services/hashing.service";
import { IJwtService, JwtService } from "@core/services/jwt.service";
import { userRoutes } from "@modules/userManagement/user.routes";

// --- Import Module Routers ---
// import { busRoutes } from '@modules/bus-management/bus.routes';
// import { trackingRoutes } from '@modules/tracking/tracking.routes';
// ... import other module routers

const initializeApp = async (): Promise<Express> => {
  // --- Core Registrations ---
  // Register core singletons like EventBus in the DI container
  // Use interface token for loose coupling
  appContainer.registerSingleton<IEventBus>("IEventBus", AppEventBus);
  appContainer.registerSingleton<IHashingService>(
    "IHashingService",
    BcryptHashingService,
  );
  appContainer.registerSingleton<IJwtService>("IJwtService", JwtService);

  // --- Database Connection ---
  await connectDB();

  // --- Express App Setup ---
  const app: Express = express();
  app.use(express.json()); // Middleware to parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // Middleware for URL-encoded bodies

  // --- Health Check Endpoint ---
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Bus Tracking API is running!");
  });

  // --- Register Module Routers ---
  const apiBasePath = config.api.basePath;

  app.use(`${apiBasePath}/users`, userRoutes);
  // app.use(`${apiBasePath}/buses`, busRoutes); // Mount bus management routes
  // app.use(`${apiBasePath}/tracking`, trackingRoutes); // Mount tracking routes
  // ... mount other module routers

  // --- Global Error Handler (Must be LAST middleware) ---
  app.use(globalErrorHandler);

  return app;
};

// --- Start Server ---
initializeApp()
  .then((app) => {
    const port = config.port;
    app.listen(port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${port}`);
      console.log(`API base path: ${config.api.basePath}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  });
