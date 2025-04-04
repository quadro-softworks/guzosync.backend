// src/main.ts
import 'reflect-metadata'; // MUST be the first import for tsyringe
import express, { Express, Request, Response } from 'express';
import config from '@core/config';
import { connectDB } from '@core/database/mongo';
import { globalErrorHandler } from '@core/middleware/error-handler';
import { appContainer } from '@core/di/container';
import { AppEventBus, IEventBus, IEventBusMeta } from '@core/events/event-bus';
import {
  BcryptHashingService,
  IHashingService,
  IHashingServiceMeta,
} from '@core/services/hashing.service';
import {
  IJwtService,
  IJwtServiceMeta,
  JwtService,
} from '@core/services/jwt.service';
import { userRoutes } from '@modules/userManagement/user.routes';
import registerServices from '@core/di/registerServices';

const initializeApp = async (): Promise<Express> => {
  // --- Core Registrations ---
  // Register core singletons like EventBus in the DI container
  // Use interface token for loose coupling

  registerServices(appContainer);

  // --- Database Connection ---
  await connectDB();

  // --- Express App Setup ---
  const app: Express = express();
  app.use(express.json()); // Middleware to parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // Middleware for URL-encoded bodies

  // --- Health Check Endpoint ---
  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Bus Tracking API is running!');
  });

  // --- Register Module Routers ---
  const apiBasePath = config.api.basePath;

  const router = app.router;

  app.use(`${apiBasePath}/users`, userRoutes(router));

  // --- Global Error Handler (Must be LAST middleware) ---
  app.use(globalErrorHandler);

  return app;
};

// --- Start Server ---
console.log('Initializing application...'); // Add this line
initializeApp()
  .then((app) => {
    console.log('Application initialized successfully!'); // Add this line
    const port = config.port;
    app.listen(port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${port}`);
      console.log(`API base path: ${config.api.basePath}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  });
